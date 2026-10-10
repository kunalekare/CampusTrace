/**
 * CampusTrace Environment Configuration Checker
 */
const fs = require('fs');
const path = require('path');

console.log('ðŸ” [CampusTrace] Performing Environment & Artifact Validation...\n');

const checks = [
  { name: 'Node.js runtime >= 18', check: () => parseInt(process.versions.node.split('.')[0], 10) >= 18 },
  { name: 'Root .env.example exists', check: () => fs.existsSync(path.join(__dirname, '../.env.example')) },
  { name: 'Frontend package.json exists', check: () => fs.existsSync(path.join(__dirname, '../frontend/package.json')) },
  { name: 'Frontend environment templates exist', check: () => fs.existsSync(path.join(__dirname, '../frontend/.env.development')) },
  { name: 'Backend package.json exists', check: () => fs.existsSync(path.join(__dirname, '../backend/package.json')) },
  { name: 'Azure SQL DDL scripts exist', check: () => fs.existsSync(path.join(__dirname, '../database/schema.sql')) },
  { name: 'Azure Functions host.json exists', check: () => fs.existsSync(path.join(__dirname, '../functions/host.json')) },
  { name: 'GitHub CI/CD workflows exist', check: () => fs.existsSync(path.join(__dirname, '../.github/workflows/backend-deploy.yml')) }
];

let failed = 0;
checks.forEach(({ name, check }) => {
  try {
    if (check()) {
      console.log(`  âœ… ${name}`);
    } else {
      console.log(`  âŒ ${name} (FAILED)`);
      failed++;
    }
  } catch (err) {
    console.log(`  âŒ ${name} (ERROR: ${err.message})`);
    failed++;
  }
});

console.log('\n--- Validation Result ---');
if (failed === 0) {
  console.log('âœ¨ All CampusTrace configuration checks passed!');
  process.exit(0);
} else {
  console.log(`âš ï¸ ${failed} check(s) failed. Please review missing files.`);
  process.exit(1);
}