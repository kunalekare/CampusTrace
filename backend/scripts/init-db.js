import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from 'mssql';
import { appConfig } from '../src/config/appConfig.js';
import { getAzureSqlToken, classifyDbError } from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databaseDir = path.resolve(__dirname, '../../database');

console.log('='.repeat(72));
console.log('  CampusTrace - Azure SQL Database Schema Initializer & Seeder');
console.log('='.repeat(72));
console.log(`Target Server:   ${appConfig.db.server}`);
console.log(`Target Database: ${appConfig.db.name}`);
console.log(`Auth Mode:       ${appConfig.db.authMode}`);
console.log(`SQL Scripts Dir: ${databaseDir}`);
console.log('-'.repeat(72));

async function run() {
  console.log('🔑 Step 1: Acquiring Microsoft Entra ID Token...');
  let tokenResponse;
  try {
    tokenResponse = await getAzureSqlToken();
    console.log('✅ Token acquired successfully.');
  } catch (err) {
    const classified = classifyDbError(err, 'azure-identity');
    console.error(`❌ Token Error: ${classified.message}`);
    console.error(`👉 Action: ${classified.action}`);
    process.exit(1);
  }

  const sqlConfig = {
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
    connectionTimeout: 30000,
    requestTimeout: 60000
  };

  console.log(`🔄 Step 2: Connecting to ${appConfig.db.name}...`);
  let pool;
  try {
    pool = await sql.connect(sqlConfig);
    console.log(`✅ Connected successfully to Azure SQL Database!\n`);
  } catch (err) {
    const classified = classifyDbError(err, 'azure-identity');
    console.error(`❌ Connection Error [${classified.type}]: ${classified.message}`);
    console.error(`👉 Action: ${classified.action}`);
    process.exit(1);
  }

  const scriptFiles = [
    { name: 'schema.sql', description: 'Core Relational Schema & Tables' },
    { name: 'constraints.sql', description: 'Check Constraints & Business Rules' },
    { name: 'indexes.sql', description: 'Performance & Search Indexes' },
    { name: 'seed.sql', description: 'Demo Users & Synthetic Test Reports' },
    { name: 'views.sql', description: 'Relational Analytics Views' }
  ];

  for (const item of scriptFiles) {
    const filePath = path.join(databaseDir, item.name);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Script file not found: ${filePath}, skipping.`);
      continue;
    }

    console.log(`📦 Executing ${item.name} (${item.description})...`);
    const content = fs.readFileSync(filePath, 'utf8');

    // Split batches on GO lines if present
    const batches = content
      .split(/^\s*GO\s*$/gim)
      .map(b => b.trim())
      .filter(b => b.length > 0);

    for (let i = 0; i < batches.length; i++) {
      const batchSql = batches[i];
      try {
        await pool.request().batch(batchSql);
      } catch (batchErr) {
        console.error(`   ❌ Error in ${item.name} (batch ${i + 1}/${batches.length}): ${batchErr.message}`);
      }
    }
    console.log(`   ✓ Completed ${item.name}`);
  }

  console.log('\n' + '-'.repeat(72));
  console.log('📊 Verifying Initialized Database Objects:');
  console.log('-'.repeat(72));

  // Verify Tables and Count
  const tablesResult = await pool.request().query(`
    SELECT 
      t.TABLE_NAME,
      p.rows AS [RowCount]
    FROM INFORMATION_SCHEMA.TABLES t
    LEFT JOIN sys.tables st ON st.name = t.TABLE_NAME
    LEFT JOIN (
      SELECT object_id, SUM(rows) as rows 
      FROM sys.partitions 
      WHERE index_id IN (0, 1) 
      GROUP BY object_id
    ) p ON p.object_id = st.object_id
    WHERE t.TABLE_TYPE = 'BASE TABLE'
    ORDER BY t.TABLE_NAME;
  `);

  console.log('Tables & Record Counts:');
  tablesResult.recordset.forEach(row => {
    console.log(`  ✓ ${row.TABLE_NAME.padEnd(20)} : ${row.RowCount ?? 0} rows`);
  });

  // Verify Views
  const viewsResult = await pool.request().query(`
    SELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS ORDER BY TABLE_NAME;
  `);
  if (viewsResult.recordset.length > 0) {
    console.log('\nViews:');
    viewsResult.recordset.forEach(row => {
      console.log(`  ✓ ${row.TABLE_NAME}`);
    });
  }

  await pool.close();
  console.log('\n' + '='.repeat(72));
  console.log('🎉 Database initialization & seeding completed SUCCESSFULLY!');
  console.log('   Your CampusTrace Azure SQL Database is fully ready for use.');
  console.log('='.repeat(72));
  process.exit(0);
}

run();
