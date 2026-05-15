const runHomepageTest = require("./homepage.test");
const runTutorialsTest = require("./tutorials.test");

async function main() {
  const tests = [runHomepageTest, runTutorialsTest];

  for (const test of tests) {
    await test();
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});