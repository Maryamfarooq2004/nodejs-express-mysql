const { By } = require("selenium-webdriver");
const { createDriver } = require("./driver");

async function runHomepageTest() {
  const baseUrl = process.env.BASE_URL || "http://localhost:8081";
  const driver = await createDriver();

  try {
    await driver.get(baseUrl);

    const bodyText = await driver.findElement(By.css("body")).getText();

    if (!bodyText.includes("Welcome to bezkoder application.")) {
      throw new Error(`Unexpected homepage content: ${bodyText}`);
    }

    console.log("Homepage Selenium test passed.");
  } catch (error) {
    throw new Error(`Homepage Selenium test failed: ${error.message}`);
  } finally {
    await driver.quit().catch(() => {});
  }
}

module.exports = runHomepageTest;