import sql from 'mssql';

import {
  DefaultAzureCredential,
  AzureCliCredential,
  ChainedTokenCredential,
  ManagedIdentityCredential
} from '@azure/identity';

import { appConfig } from './appConfig.js';
import { logger } from '../utils/logger.js';

let pool = null;
let isConnectedToAzure = false;
let lastConnectionError = null;
let connectionAttempted = false;

const AZURE_SQL_RESOURCE = 'https://database.windows.net/.default';

/**
 * Acquires a Microsoft Entra ID access token for Azure SQL
 */

export async function getAzureSqlToken() {
  const credentialOptions = appConfig.db.tenantId
    ? { tenantId: appConfig.db.tenantId }
    : {};

  // Production: explicitly use the App Service managed identity.
  // Development: use Azure CLI, then DefaultAzureCredential.
  const credential =
    appConfig.env === 'production'
      ? new ManagedIdentityCredential()
      : new ChainedTokenCredential(
          new AzureCliCredential(credentialOptions),
          new DefaultAzureCredential(credentialOptions)
        );

  const tokenResponse = await credential.getToken(
    AZURE_SQL_RESOURCE
  );

  if (!tokenResponse?.token) {
    throw new Error(
      'Received an empty access token from Microsoft Entra ID.'
    );
  }

  return tokenResponse;
}


/**
 * Categorizes raw SQL / network / Entra ID errors into actionable diagnostics
 */
export function classifyDbError(err, authMode = appConfig.db.authMode) {
  const msg = err.message || '';
  const code = err.code || err.originalError?.code || '';

  if (
    err.type === 'AZURE_IDENTITY_TOKEN_FAILURE' ||
    msg.includes('ChainedTokenCredential') ||
    msg.includes('CredentialUnavailableError') ||
    msg.includes("Please run 'az login'") ||
    msg.includes('AuthenticationRequiredError')
  ) {
    return {
      type: 'AZURE_IDENTITY_TOKEN_FAILURE',
      message: `Failed to acquire Microsoft Entra ID access token: ${msg.split('\n')[0]}`,
      action: 'Run "az login --tenant 3fa4e4bd-010b-47e1-b418-16840b1509fa" (or your Azure tenant ID) in PowerShell, then confirm with "az account show".'
    };
  }

  if (code === 'ENOTFOUND' || msg.includes('getaddrinfo ENOTFOUND')) {
    return {
      type: 'DNS_RESOLUTION_FAILURE',
      message: `Failed to resolve SQL Server host "${appConfig.db.server}". Check that the hostname is spelled correctly.`,
      action: 'Verify your DB_SERVER value. For Azure SQL, use: campustrace.database.windows.net'
    };
  }

  if (code === 'ETIMEOUT' || msg.includes('timeout') || (msg.includes('Failed to connect') && msg.includes('sequence'))) {
    return {
      type: 'CONNECTION_TIMEOUT',
      message: `Connection timed out while reaching ${appConfig.db.server}:${appConfig.db.port}.`,
      action: 'The Serverless Azure SQL Database may be currently PAUSED and waking up (takes ~15-30s), or a network firewall is dropping packets.'
    };
  }

  if (code === 'ECONNREFUSED') {
    return {
      type: 'CONNECTION_REFUSED',
      message: `TCP Connection refused on ${appConfig.db.server}:${appConfig.db.port}.`,
      action: 'Ensure the SQL Server instance is listening on port 1433 and not blocked by local outbound firewalls.'
    };
  }

  if (msg.includes('Client with IP address') || msg.includes('Cannot open server') || err.number === 40615) {
    const ipMatch = msg.match(/Client with IP address '([0-9.]+)'/);
    const clientIp = ipMatch ? ipMatch[1] : null;
    return {
      type: 'FIREWALL_BLOCKED',
      message: `Azure SQL Firewall rejected connection from your current IP address${clientIp ? ` (${clientIp})` : ''}.`,
      clientIp,
      action: clientIp
        ? `In Azure Portal > SQL Server "campustrace" > Networking > Click "Add your client IPv4 address (${clientIp})" and Save. Or run: az sql server firewall-rule create -g CampusTrace-RG -s campustrace -n AllowDevIP --start-ip-address ${clientIp} --end-ip-address ${clientIp}`
        : 'Go to Azure Portal > SQL database > "Set server firewall" > Click "Add your client IPv4 address" and Save.'
    };
  }

  if (code === 'ELOGIN' || msg.includes('Login failed') || err.number === 18456) {
    if (authMode === 'azure-identity') {
      return {
        type: 'ENTRA_DATABASE_USER_MISSING',
        message: `Microsoft Entra authentication token was verified by Azure SQL Server, but the authenticated identity lacks permission or a matching user in database "${appConfig.db.name}".`,
        action: `Connect to ${appConfig.db.name} as Microsoft Entra admin in Azure Portal Query Editor, and execute:\nCREATE USER [<your-email-address>] FROM EXTERNAL PROVIDER;\nALTER ROLE db_datareader ADD MEMBER [<your-email-address>];\nALTER ROLE db_datawriter ADD MEMBER [<your-email-address>];`
      };
    }
    return {
      type: 'AUTHENTICATION_FAILURE',
      message: `SQL Server login failed for user "${appConfig.db.user}".`,
      action: 'Verify your DB_USER and DB_PASSWORD credentials in backend/.env.'
    };
  }

  if (msg.includes('Cannot open database') || err.number === 4060) {
    return {
      type: 'DATABASE_NOT_FOUND',
      message: `Database "${appConfig.db.name}" not found on server ${appConfig.db.server}.`,
      action: 'Check that DB_NAME matches your created database name in Azure Portal.'
    };
  }

  if (msg.includes('certificate') || msg.includes('self signed') || msg.includes('TLS')) {
    return {
      type: 'TLS_CERTIFICATE_ERROR',
      message: `TLS/SSL encryption negotiation failed.`,
      action: 'Azure SQL requires DB_ENCRYPT=true. Set DB_TRUST_SERVER_CERTIFICATE=false for strict validation.'
    };
  }

  return {
    type: 'GENERIC_DATABASE_ERROR',
    message: msg,
    action: 'Inspect full error details and verify database status in Azure Portal.'
  };
}

// In-Memory Data Store: ONLY used when USE_MOCK_DB=true is explicitly set
export const memoryDb = {
  users: [
    {
      userId: 1,
      fullName: 'Chief Security Officer',
      email: 'admin@campustrace.edu',
      passwordHash: '$2a$10$GJHltGncNTclqK3l9RRcrONsYogmQs4ruCxFi1FJdNqCTOHRLgzpG', // Password@123
      role: 'admin',
      accountStatus: 'ACTIVE',
      department: 'Campus Safety',
      phoneNumber: '+15551002000',
      createdAt: new Date().toISOString()
    },
    {
      userId: 2,
      fullName: 'Alex Mercer',
      email: 'student@campus.edu',
      passwordHash: '$2a$10$GJHltGncNTclqK3l9RRcrONsYogmQs4ruCxFi1FJdNqCTOHRLgzpG',
      role: 'student',
      accountStatus: 'ACTIVE',
      department: 'Computer Science',
      phoneNumber: '+15551003001',
      studentId: 'STU-10492',
      createdAt: new Date().toISOString()
    },
    {
      userId: 3,
      fullName: 'Sam Taylor',
      email: 'finder@campus.edu',
      passwordHash: '$2a$10$GJHltGncNTclqK3l9RRcrONsYogmQs4ruCxFi1FJdNqCTOHRLgzpG',
      role: 'student',
      accountStatus: 'ACTIVE',
      department: 'Mathematics',
      phoneNumber: '+15551004002',
      studentId: 'STU-10884',
      createdAt: new Date().toISOString()
    }
  ],
  itemReports: [
    {
      reportId: 1,
      userId: 2,
      reportType: 'LOST',
      title: 'Lost Texas Instruments TI-84 Plus Calculator',
      category: 'Electronics',
      description: 'Left my black TI-84 graphing calculator on the 2nd-floor study desks in the Central Library.',
      brand: 'Texas Instruments',
      color: 'Black',
      location: 'Central Library',
      eventDate: new Date().toISOString().split('T')[0],
      imageBlobName: null,
      status: 'OPEN',
      distinctiveCharacteristics: 'Slight scratch across back battery cover and silver initials AM in faint marker.',
      privateVerificationDetails: 'Serial Number: K-0418M-29402; Panasonic AAA batteries inside.',
      handoverNotes: null,
      storageLocation: null,
      createdAt: new Date().toISOString()
    },
    {
      reportId: 2,
      userId: 3,
      reportType: 'FOUND',
      title: 'Found Graphing Calculator in Central Library',
      category: 'Electronics',
      description: 'Found a black Texas Instruments scientific graphing calculator unattended on a table in the Central Library.',
      brand: 'Texas Instruments',
      color: 'Black',
      location: 'Central Library',
      eventDate: new Date().toISOString().split('T')[0],
      imageBlobName: null,
      status: 'OPEN',
      distinctiveCharacteristics: null,
      privateVerificationDetails: null,
      handoverNotes: 'Deposited at the front circulation desk with Student Security assistant.',
      storageLocation: 'Library Front Desk Lost & Found Box #3',
      createdAt: new Date().toISOString()
    },
    {
      reportId: 3,
      userId: 3,
      reportType: 'FOUND',
      title: 'Found Blue Hydro Flask Water Bottle',
      category: 'Clothing & Accessories',
      description: 'Blue 32oz Hydro Flask with assorted campus stickers left on the gym bleachers.',
      brand: 'Hydro Flask',
      color: 'Blue',
      location: 'Campus Recreation Center',
      eventDate: new Date().toISOString().split('T')[0],
      imageBlobName: null,
      status: 'OPEN',
      distinctiveCharacteristics: null,
      privateVerificationDetails: null,
      handoverNotes: 'Kept in gym staff office.',
      storageLocation: 'Recreation Center Room 102',
      createdAt: new Date().toISOString()
    }
  ],
  potentialMatches: [],
  claims: [],
  notifications: [],
  auditLogs: []
};

/**
 * Obtains or initializes the shared Azure SQL Database connection pool
 */
export async function getDbPool() {
  // If explicit mock mode is set for offline testing
  if (appConfig.useMockDb) {
    if (!connectionAttempted) {
      connectionAttempted = true;
      logger.info('ℹ️ [Database] Running in MOCK storage mode (USE_MOCK_DB=true is enabled).');
    }
    return null;
  }

  // If already connected, return existing pool
  if (pool && pool.connected) {
    return pool;
  }

  // Validate that DB_SERVER is set
  if (!appConfig.db.server || appConfig.db.server === 'localhost' || appConfig.db.server.includes('your-server-name')) {
    const errorMsg = 'DB_SERVER is missing or unconfigured. Expected Azure SQL hostname (e.g. campustrace.database.windows.net).';
    if (!connectionAttempted) {
      connectionAttempted = true;
      logger.error(`❌ [Database] Configuration Error: ${errorMsg}`);
      logger.info('👉 Set DB_SERVER=campustrace.database.windows.net in your .env file or set USE_MOCK_DB=true for offline mock mode.');
    }
    lastConnectionError = { type: 'MISSING_CONFIGURATION', message: errorMsg };
    return null;
  }

  let sqlConfig;

  if (appConfig.db.authMode === 'azure-identity') {
    if (!connectionAttempted) {
      logger.info(`🔄 [Database] Acquiring Microsoft Entra ID token for Azure SQL (${appConfig.db.server})...`);
    }
    let tokenResponse;
    try {
      tokenResponse = await getAzureSqlToken();
    } catch (tokenErr) {
      isConnectedToAzure = false;
      const classified = classifyDbError(tokenErr, 'azure-identity');
      lastConnectionError = classified;
      logger.error(`❌ [Database] Azure Entra ID Token Acquisition Failed: ${classified.message}`);
      logger.warn(`👉 Action Required: ${classified.action}`);
      if (appConfig.env === 'production') {
        throw new Error(`Azure Entra token error: ${classified.message}`);
      }
      return null;
    }

    sqlConfig = {
      server: appConfig.db.server,
      port: appConfig.db.port,
      database: appConfig.db.name,
      authentication: {
        type: 'azure-active-directory-access-token',
        options: {
          token: tokenResponse.token
        }
      },
      options: {
        encrypt: appConfig.db.encrypt,
        trustServerCertificate: appConfig.db.trustServerCertificate
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      connectionTimeout: 30000, // 30s allowance for serverless Azure SQL database resume
      requestTimeout: 30000
    };
  } else {
    // SQL Server username/password authentication mode
    if (!appConfig.db.user || !appConfig.db.password) {
      const errorMsg = 'DB_USER or DB_PASSWORD is missing for sql-password authentication mode.';
      if (!connectionAttempted) {
        connectionAttempted = true;
        logger.error(`❌ [Database] Configuration Error: ${errorMsg}`);
        logger.info('👉 Set DB_USER and DB_PASSWORD or switch DB_AUTH_MODE=azure-identity in .env.');
      }
      lastConnectionError = { type: 'MISSING_CONFIGURATION', message: errorMsg };
      return null;
    }

    sqlConfig = {
      server: appConfig.db.server,
      port: appConfig.db.port,
      database: appConfig.db.name,
      user: appConfig.db.user,
      password: appConfig.db.password,
      options: {
        encrypt: appConfig.db.encrypt,
        trustServerCertificate: appConfig.db.trustServerCertificate
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      connectionTimeout: 30000,
      requestTimeout: 30000
    };
  }

  try {
    if (!connectionAttempted) {
      logger.info(`🔄 [Database] Connecting to Azure SQL: ${appConfig.db.server}:${appConfig.db.port} [DB: ${appConfig.db.name}, Mode: ${appConfig.db.authMode}]...`);
    }
    connectionAttempted = true;
    pool = await sql.connect(sqlConfig);
    isConnectedToAzure = true;
    lastConnectionError = null;

    logger.info(`✅ [Database] Azure SQL Database connected successfully to ${appConfig.db.server} (${appConfig.db.name}) via ${appConfig.db.authMode}.`);
    return pool;
  } catch (err) {
    isConnectedToAzure = false;
    const classified = classifyDbError(err, appConfig.db.authMode);
    lastConnectionError = classified;

    logger.error(`❌ [Database] Azure SQL Connection Failed [${classified.type}]: ${classified.message}`);
    logger.warn(`👉 Action Required: ${classified.action}`);

    // If production, throw explicitly to avoid silent invalid state
    if (appConfig.env === 'production') {
      throw new Error(`Production database connection failed: ${classified.message}`);
    }

    return null;
  }
}

export function isAzureSql() {
  return isConnectedToAzure;
}

export function getLastDbError() {
  return lastConnectionError;
}

/**
 * Health check querying the database
 */
export async function checkDbHealth() {
  if (appConfig.useMockDb) {
    return {
      status: 'healthy',
      adapter: 'mock_memory',
      message: 'Running in mock database mode (USE_MOCK_DB=true)'
    };
  }

  const activePool = await getDbPool();
  if (!activePool || !isConnectedToAzure) {
    const err = lastConnectionError || { type: 'UNAVAILABLE', message: 'Database connection not established' };
    return {
      status: 'unhealthy',
      adapter: 'azure_sql',
      server: appConfig.db.server,
      database: appConfig.db.name,
      authMode: appConfig.db.authMode,
      error: err
    };
  }

  try {
    const result = await activePool.request().query('SELECT DB_NAME() AS databaseName, @@SERVERNAME AS serverName, CURRENT_USER AS currentUser, SYSUTCDATETIME() AS serverTime');
    return {
      status: 'healthy',
      adapter: 'azure_sql',
      server: appConfig.db.server,
      database: result.recordset[0]?.databaseName || appConfig.db.name,
      currentUser: result.recordset[0]?.currentUser,
      authMode: appConfig.db.authMode,
      serverTime: result.recordset[0]?.serverTime
    };
  } catch (err) {
    const classified = classifyDbError(err, appConfig.db.authMode);
    return {
      status: 'unhealthy',
      adapter: 'azure_sql',
      server: appConfig.db.server,
      authMode: appConfig.db.authMode,
      error: classified
    };
  }
}
