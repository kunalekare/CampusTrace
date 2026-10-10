import sql from 'mssql';
import { appConfig } from '../src/config/appConfig.js';
import { getAzureSqlToken, classifyDbError } from '../src/config/database.js';

console.log('='.repeat(72));
console.log('  CampusTrace - Azure SQL Database Connectivity Checker');
console.log('='.repeat(72));
console.log(`Env File Source:    ${appConfig.envLoadedFrom || 'None found (using process.env)'}`);
console.log(`Node Environment:   ${appConfig.env}`);
console.log(`USE_MOCK_DB:        ${appConfig.useMockDb}`);
console.log('-'.repeat(72));

const { authMode, server, port, name, user, password, tenantId, encrypt, trustServerCertificate } = appConfig.db;

console.log(`Authentication:     ${authMode} ${authMode === 'azure-identity' ? '(Microsoft Entra ID Token)' : '(SQL Password)'}`);
console.log(`Target Server:      ${server || '(NOT SET)'}`);
console.log(`Target Port:        ${port}`);
console.log(`Target Database:    ${name || '(NOT SET)'}`);
if (authMode === 'azure-identity') {
  console.log(`Tenant ID:          ${tenantId ? tenantId : '(default from active Azure login)'}`);
} else {
  console.log(`Database User:      ${user ? user : '(NOT SET)'}`);
  console.log(`Password:           ${password ? '******** (configured)' : '(NOT SET)'}`);
}
console.log(`Encrypt (SSL/TLS):  ${encrypt}`);
console.log(`Trust Cert:         ${trustServerCertificate}`);
console.log('-'.repeat(72));

// Validation checks
if (!server) {
  console.error('❌ Configuration Error: DB_SERVER is not set.');
  process.exit(1);
}
if (!name) {
  console.error('❌ Configuration Error: DB_NAME is not set.');
  process.exit(1);
}

let sqlConfig;

if (authMode === 'azure-identity') {
  console.log('🔑 Step 1: Acquiring Microsoft Entra ID access token...');
  console.log('   Resource: https://database.windows.net/.default');
  console.log('   Using: DefaultAzureCredential (Azure CLI / Environment / Managed Identity)');

  let tokenResponse;
  try {
    tokenResponse = await getAzureSqlToken();
    const expiresDate = tokenResponse.expiresOnTimestamp 
      ? new Date(tokenResponse.expiresOnTimestamp).toLocaleTimeString() 
      : 'in ~1 hour';
    console.log(`✅ Entra ID token acquired successfully (valid until: ${expiresDate})`);
  } catch (err) {
    const classified = classifyDbError(err, 'azure-identity');
    console.error('\n' + '='.repeat(72));
    console.error(`❌ TOKEN ACQUISITION FAILED: [${classified.type}]`);
    console.error(`Message: ${classified.message}`);
    console.error('-'.repeat(72));
    console.error('👉 Action Required:');
    console.error('   1. Open PowerShell and run:');
    console.error('      az login --tenant 3fa4e4bd-010b-47e1-b418-16840b1509fa');
    console.error('   2. Set your active subscription:');
    console.error('      az account set --subscription ecf96527-1aee-46c9-af04-8ae2fa8ea114');
    console.error('   3. Verify login status with:');
    console.error('      az account show');
    console.error('='.repeat(72) + '\n');
    process.exit(1);
  }

  sqlConfig = {
    server,
    port,
    database: name,
    authentication: {
      type: 'azure-active-directory-access-token',
      options: {
        token: tokenResponse.token
      }
    },
    options: {
      encrypt,
      trustServerCertificate
    },
    connectionTimeout: 30000, // 30s allowance for Serverless resume
    requestTimeout: 30000
  };
} else {
  // SQL Server username/password mode
  if (!user || !password) {
    console.error('❌ Configuration Error: DB_USER and DB_PASSWORD are required for sql-password mode.');
    console.log('👉 Switch to DB_AUTH_MODE=azure-identity in .env to use Microsoft Entra ID.');
    process.exit(1);
  }

  sqlConfig = {
    server,
    port,
    database: name,
    user,
    password,
    options: {
      encrypt,
      trustServerCertificate
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
  };
}

console.log(`\n🔄 Step 2: Connecting to Azure SQL Database (${server})...`);
console.log('⏳ Please wait up to 30 seconds (Serverless database auto-resumes if paused)...');

try {
  const startTime = Date.now();
  const pool = await sql.connect(sqlConfig);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n✅ Connected successfully to Azure SQL in ${elapsed}s!\n`);

  // Query metadata
  const metaResult = await pool.request().query(`
    SELECT 
      @@SERVERNAME AS serverName,
      DB_NAME() AS databaseName,
      CURRENT_USER AS currentUser,
      SYSUTCDATETIME() AS serverUtcTime
  `);

  const meta = metaResult.recordset[0] || {};
  console.log('--- Azure SQL Database Session Details ---');
  console.log(`Server Name:       ${meta.serverName}`);
  console.log(`Database Name:     ${meta.databaseName}`);
  console.log(`Current SQL User:  ${meta.currentUser}`);
  console.log(`Server UTC Time:   ${meta.serverUtcTime}`);
  console.log('------------------------------------------\n');

  // Check tables
  const tablesResult = await pool.request().query(`
    SELECT TABLE_NAME 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_TYPE = 'BASE TABLE'
    ORDER BY TABLE_NAME;
  `);

  const existingTables = tablesResult.recordset.map(r => r.TABLE_NAME);
  console.log(`Existing Tables in [${name}] (${existingTables.length} found):`);
  if (existingTables.length > 0) {
    existingTables.forEach(t => console.log(`  ✓ ${t}`));
  } else {
    console.log('  (No tables found yet)');
  }

  const expectedTables = ['Users', 'ItemReports', 'PotentialMatches', 'Claims', 'AuditLogs'];
  const missingTables = expectedTables.filter(t => !existingTables.includes(t));

  console.log('\n--- Schema Status ---');
  if (missingTables.length === 0) {
    console.log('🎉 All essential CampusTrace tables are present and ready!');
  } else {
    console.log(`⚠️ Some CampusTrace tables are missing: ${missingTables.join(', ')}`);
    console.log('👉 To initialize the database schema, open Azure Portal Query Editor (or Azure Data Studio) and run:');
    console.log('   1. database/schema.sql');
    console.log('   2. database/constraints.sql');
    console.log('   3. database/indexes.sql');
    console.log('   4. database/seed.sql');
  }

  await pool.close();
  console.log('\n' + '='.repeat(72));
  console.log('✨ Azure SQL connectivity check completed SUCCESSFULLY.');
  console.log('='.repeat(72));
  process.exit(0);
} catch (err) {
  const classified = classifyDbError(err, authMode);
  console.error('\n' + '='.repeat(72));
  console.error(`❌ DATABASE CONNECTION FAILED: [${classified.type}]`);
  console.error(`Message: ${classified.message}`);
  console.error('-'.repeat(72));
  console.error('👉 Required Action:');
  console.error(`   ${classified.action}`);

  if (classified.type === 'ENTRA_DATABASE_USER_MISSING') {
    console.error('\n📋 How to Add the Database User for Entra ID in Azure Portal:');
    console.error('   1. Open Azure Portal > CampusTraceDB');
    console.error('   2. Click "Query editor (preview)" in the left menu');
    console.error('   3. Sign in using your Microsoft Entra account');
    console.error('   4. Run the following T-SQL command (replace with your active sign-in account):');
    console.error('      CREATE USER [ekareks@rknec.edu] FROM EXTERNAL PROVIDER;');
    console.error('      ALTER ROLE db_datareader ADD MEMBER [ekareks@rknec.edu];');
    console.error('      ALTER ROLE db_datawriter ADD MEMBER [ekareks@rknec.edu];');
    console.error('      ALTER ROLE db_ddladmin ADD MEMBER [ekareks@rknec.edu];');
  }

  if (classified.type === 'FIREWALL_BLOCKED') {
    console.error('\n📋 Firewall Resolution:');
    console.error('   1. Open Azure Portal > CampusTraceDB');
    console.error('   2. Click "Set server firewall" in the top bar');
    console.error('   3. Click "+ Add your client IPv4 address"');
    console.error('   4. Toggle "Allow Azure services and resources to access this server" = Yes');
    console.error('   5. Click "Save"');
  }

  console.error('='.repeat(72) + '\n');
  process.exit(1);
}
