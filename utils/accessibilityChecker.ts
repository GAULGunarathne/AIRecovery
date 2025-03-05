import { TestInfo , expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

export async function runAccessibilityCheck(page, testInfo, description): Promise<void> {
    // Get axeBuilder from the fixture
    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag22aa', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Attach results to the test report
    await testInfo.attach(`${description}-accessibility-scan-results`, {
        body: JSON.stringify(axeResults, null, 2),
        contentType: 'application/json',
    });

    // Check for violations and throw an error
    if (axeResults.violations.length > 0) {
      throw new Error();
  }
}
