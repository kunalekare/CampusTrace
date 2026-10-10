/**
 * CampusTrace Unified Test Suite Runner
 */
const { execSync } = require('child_process');
const path = require('path');

console.log('ðŸš€ [CampusTrace] Launching Automated Test Suites...\n');

const testSuites = [
  { name: 'Backend Services & Matching Engine', dir: path.join(__dirname, '../backend'), cmd: 'npm test' }
];

let failures = 0;
testSuites.forEach(({ name, dir, cmd }) => {
  console.log(`â–¶ Executing suite: ${name}...`);
  try {
    execSync(cmd, { cwd: dir, stdio: 'inherit' });
    console.log(`âœ… ${name} passed successfully!\n`);
  } catch (err) {
    console.error(`âŒ ${name} encountered test failures.\n`);
    failures++;
  }
});

if (failures > 0) {
  console.error(`ðŸ’¥ Completed with ${failures} failing test suite(s).`);
  process.exit(1);
} else {
  console.log('ðŸŽ‰ All CampusTrace test suites passed with 100% success rate.');
  process.exit(0);
}