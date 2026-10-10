import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robustly discover the appropriate .env file regardless of invocation working directory
const candidateEnvPaths = [
  path.resolve(__dirname, '../../.env'),              // backend/.env
  path.resolve(__dirname, '../../../.env'),             // CampusTrace/.env
  path.resolve(process.cwd(), '.env'),                 // Current working dir .env
  path.resolve(process.cwd(), 'backend/.env')          // If executed from root
];

let envLoadedFrom = null;
for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    envLoadedFrom = envPath;
    break;
  }
}

if (!envLoadedFrom) {
  dotenv.config(); // fallback standard lookup
}

export const appConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  apiPrefix: process.env.API_PREFIX || '/api',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  envLoadedFrom,
  useMockDb: process.env.USE_MOCK_DB === 'true',
  jwt: {
    secret: process.env.JWT_SECRET || 'campustrace_development_jwt_secret_key_32chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  db: {
    // Authentication mode: 'azure-identity' (Microsoft Entra ID token) or 'sql-password'
    authMode: process.env.DB_AUTH_MODE || (process.env.DB_USER ? 'sql-password' : 'azure-identity'),
    // DO NOT default to 'localhost' for Azure SQL
    server: process.env.DB_SERVER || '',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    name: process.env.DB_NAME || 'CampusTraceDB',
    // Optional for azure-identity; required for sql-password
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    // Optional Entra ID tenant & client overrides
    tenantId: process.env.AZURE_TENANT_ID || '',
    clientId: process.env.AZURE_CLIENT_ID || '',
    encrypt: process.env.DB_ENCRYPT !== 'false', // Default true for Azure SQL
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' // Default false
  },
  storage: {
    account: process.env.AZURE_STORAGE_ACCOUNT || '',
    container: process.env.AZURE_STORAGE_CONTAINER_NAME || process.env.AZURE_STORAGE_CONTAINER || 'item-photos',
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || ''
  },
  matchingWeights: {
    category: 0.25,
    description: 0.25,
    brand: 0.20,
    color: 0.10,
    location: 0.10,
    dateTime: 0.10,
    threshold: 50 // Minimum score to suggest a match
  }
};