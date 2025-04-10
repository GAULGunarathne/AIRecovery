import { chromium, Page } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';
import testDataJson from './test.data.json';
import * as templateData from './script_template.json';

type TestDataType = {
  [key: string]: string;
  first_name: string;
  last_name: string;
  dob: string;
  street: string;
  postal_code: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  country: string;
  password: string;
  adusername: string;
  adpassword: string;
};

const testData = testDataJson as TestDataType;

dotenv.config();
console.log("FSIGNUP URL:", process.env.FSIGNUP);

function normalizeFieldName(fieldName: string): string {
  return fieldName.toLowerCase().replace(/\s+/g, '_');
}

async function main() {
  const browser = await chromium.launch({ headless: true
  // executablePath: 'C:\\Users\\UvinGunarathna\\AppData\\Local\\ms-playwright\\chromium_headless_shell-1161\\chrome-win\\headless_shell.exe'
  });
  const page: Page = await browser.newPage();

  try {
    const url = process.env.FSIGNUP;

    if (!url) {
      throw new Error('FSIGNUP environment variable is not set.');
    }

    console.log(`Navigating to: ${url}`);
    await page.goto(url);

    const inputs = await page.$$('input, select');
    console.log(`Found ${inputs.length} input/select elements.`);

    let generatedCode: string = '';
    generatedCode += templateData.imports + '\n';
    generatedCode += templateData.testHeader + '\n';
    generatedCode += templateData.browserLaunch + '\n';
    generatedCode += templateData.gotoUrl.replace('{{url}}', url) + '\n\n';
    generatedCode += templateData.interactionsStart + '\n';

    // Loop through all input/select elements
    for (const input of inputs) {
      const tagName = await input.evaluate((el) => el.tagName.toLowerCase());
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      const label = await page.$(`label[for="${id}"]`);

      // Determine the field name based on available attributes
      let fieldName: string = '';
      if (id) {
        fieldName = normalizeFieldName(id);
      } else if (name) {
        fieldName = normalizeFieldName(name);
      } else if (placeholder) {
        fieldName = normalizeFieldName(placeholder);
      } else if (label) {
        fieldName = normalizeFieldName(await label.innerText());
      }

      if (!fieldName) {
        continue;
      }
      const fieldValue = testData[fieldName] || '';

      let selector: string = '';
      if (id) {
        selector = `#${id}`;
      } else if (name) {
        selector = `input[name="${name}"], select[name="${name}"]`;
      } else if (placeholder) {
        selector = `input[placeholder="${placeholder}"]`;
      } else if (label) {
        selector = `input[id="${await label.getAttribute('for')}"]`;
      }

      // Generate code based on element type
      if (tagName === 'input') {
        generatedCode += templateData.fillInput.replace('{{selector}}', selector).replace('{{value}}', fieldValue) + '\n';
      } else if (tagName === 'select') {
        generatedCode += templateData.selectOption.replace('{{selector}}', selector).replace('{{value}}', fieldValue) + '\n';
      }
    }

    generatedCode += '\n' + templateData.submitButton + '\n\n';
    generatedCode += templateData.catchBlock + '\n';
    generatedCode += templateData.testFooter + '\n';

    // Save the generated script to a file
    const generatedScriptPath = path.join(__dirname, './tests/automated_script.spec.ts');
    await fs.writeFile(generatedScriptPath, generatedCode);
    console.log('Automated Script Generated > automated_script.spec.ts');

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
}

main();