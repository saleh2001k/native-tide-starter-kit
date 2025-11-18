#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

const CURRENT_DIR = process.cwd();

// Convert app name to slug format (lowercase, no spaces, no special chars)
function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^-+|-+$/g, '') || 'myapp';
}

// Convert app name to bundle identifier format
function toBundleId(slug) {
  return `com.anonymous.${slug}`;
}

// Check if file is binary
function isBinaryFile(filePath) {
  const binaryExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.pdf', '.zip', '.tar', '.gz'];
  const ext = path.extname(filePath).toLowerCase();
  return binaryExtensions.includes(ext);
}

// Replace placeholders in file content
function replacePlaceholders(content, appName, appSlug, bundleId) {
  return content
    .replace(/native-tide/g, appName)
    .replace(/nativetide/g, appSlug)
    .replace(/com\.anonymous\.nativetide/g, bundleId);
}

// Copy template files and replace placeholders
async function copyTemplateFiles(targetDir, appName, appSlug, bundleId, templateDir) {
  const filesToCreate = await fs.readdir(templateDir);

  for (const file of filesToCreate) {
    const origFilePath = path.join(templateDir, file);
    const targetFilePath = path.join(targetDir, file);

    const stats = await fs.stat(origFilePath);

    if (stats.isFile()) {
      // Handle binary files (images, etc.)
      if (isBinaryFile(origFilePath)) {
        await fs.copy(origFilePath, targetFilePath);
      } else {
        let contents = await fs.readFile(origFilePath, 'utf8');
        
        // Replace placeholders in file content
        contents = replacePlaceholders(contents, appName, appSlug, bundleId);
        
        await fs.writeFile(targetFilePath, contents, 'utf8');
      }
    } else if (stats.isDirectory()) {
      await fs.ensureDir(targetFilePath);
      await copyDirectory(origFilePath, targetFilePath, appName, appSlug, bundleId);
    }
  }
}

// Recursively copy directory
async function copyDirectory(srcDir, targetDir, appName, appSlug, bundleId) {
  const files = await fs.readdir(srcDir);

  for (const file of files) {
    const srcFilePath = path.join(srcDir, file);
    const targetFilePath = path.join(targetDir, file);

    const stats = await fs.stat(srcFilePath);

    if (stats.isFile()) {
      // Handle binary files (images, etc.)
      if (isBinaryFile(srcFilePath)) {
        await fs.copy(srcFilePath, targetFilePath);
      } else {
        let contents = await fs.readFile(srcFilePath, 'utf8');
        
        // Replace placeholders in file content
        contents = replacePlaceholders(contents, appName, appSlug, bundleId);
        
        await fs.writeFile(targetFilePath, contents, 'utf8');
      }
    } else if (stats.isDirectory()) {
      await fs.ensureDir(targetFilePath);
      await copyDirectory(srcFilePath, targetFilePath, appName, appSlug, bundleId);
    }
  }
}

// Main function
async function main() {
  console.log(chalk.cyan('\n🚀 Native Tide Starter Kit\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'What is your app name?',
      default: 'my-app',
      validate: (input) => {
        if (!input || input.trim().length === 0) {
          return 'App name cannot be empty';
        }
        if (!/^[a-zA-Z0-9\s-]+$/.test(input)) {
          return 'App name can only contain letters, numbers, spaces, and hyphens';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'stylingSolution',
      message: 'Which styling solution would you like to use?',
      choices: [
        { name: 'Unistyles', value: 'unistyles' },
        { name: 'NativeWind', value: 'nativewind' },
      ],
      default: 'unistyles',
    },
    {
      type: 'input',
      name: 'projectDir',
      message: 'Where should we create your project?',
      default: (answers) => toSlug(answers.appName),
      validate: (input) => {
        if (!input || input.trim().length === 0) {
          return 'Project directory cannot be empty';
        }
        const targetPath = path.join(CURRENT_DIR, input);
        if (fs.existsSync(targetPath)) {
          return 'Directory already exists. Please choose a different name.';
        }
        return true;
      },
    },
  ]);

  const appName = answers.appName.trim();
  const appSlug = toSlug(appName);
  const bundleId = toBundleId(appSlug);
  const projectDir = path.join(CURRENT_DIR, answers.projectDir.trim());
  const stylingSolution = answers.stylingSolution;
  const templateDir = path.join(__dirname, '..', stylingSolution === 'nativewind' ? 'template-nativewind' : 'template');
  const sharedTemplateDir = path.join(__dirname, '..', 'template-shared');

  console.log(chalk.gray(`\nApp Name: ${appName}`));
  console.log(chalk.gray(`App Slug: ${appSlug}`));
  console.log(chalk.gray(`Bundle ID: ${bundleId}`));
  console.log(chalk.gray(`Styling Solution: ${stylingSolution === 'nativewind' ? 'NativeWind' : 'Unistyles'}`));
  console.log(chalk.gray(`Project Directory: ${projectDir}\n`));

  const spinner = ora('Creating your project...').start();

  try {
    // Verify template directory exists
    if (!(await fs.pathExists(templateDir))) {
      throw new Error(`Template directory not found: ${templateDir}`);
    }

    // Verify shared template directory exists
    if (!(await fs.pathExists(sharedTemplateDir))) {
      throw new Error(`Shared template directory not found: ${sharedTemplateDir}`);
    }

    // Create project directory
    await fs.ensureDir(projectDir);

    // Copy shared template files first (assets, scripts, etc.)
    await copyTemplateFiles(projectDir, appName, appSlug, bundleId, sharedTemplateDir);

    // Copy template-specific files (will merge with shared files)
    await copyTemplateFiles(projectDir, appName, appSlug, bundleId, templateDir);

    spinner.succeed('Project created successfully!');

    console.log(chalk.green('\n✅ Your Native Tide project is ready!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.white(`  cd ${answers.projectDir.trim()}`));
    console.log(chalk.white('  yarn install'));
    console.log(chalk.white('  yarn start\n'));
  } catch (error) {
    spinner.fail('Failed to create project');
    console.error(chalk.red('\nError:'), error.message);
    process.exit(1);
  }
}

// Run the CLI
main().catch((error) => {
  console.error(chalk.red('\nUnexpected error:'), error);
  process.exit(1);
});

