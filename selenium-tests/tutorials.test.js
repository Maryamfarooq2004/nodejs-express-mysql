const { By } = require("selenium-webdriver");
const { createDriver } = require("./driver");

async function runTutorialsTest() {
  const baseUrl = process.env.BASE_URL || "http://localhost:8081";
  const driver = await createDriver();

  try {
    await driver.get(`${baseUrl}/tutorials`);

    const bodyText = await driver.findElement(By.css("body")).getText();

    if (!bodyText.includes("Tutorials endpoint loaded successfully.")) {
      throw new Error(`Unexpected tutorials content: ${bodyText}`);
    }

    console.log("Tutorials Selenium test passed.");
  } catch (error) {
    throw new Error(`Tutorials Selenium test failed: ${error.message}`);
  } finally {
    await driver.quit().catch(() => {});
  }
}

module.exports = runTutorialsTest;