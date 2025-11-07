const fs = require('fs-extra');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', '..', 'native-tide');
const TEMPLATE_DIR = path.join(__dirname, '..', 'template');

// Directories and files to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  'ios',
  'android',
  '.expo',
  'build',
  'dist',
  'coverage',
  '.git',
  'yarn.lock',
  'package-lock.json',
  '.DS_Store',
  '*.log',
];

// Files to copy
const FILES_TO_COPY = [
  'package.json',
  'app.json',
  'tsconfig.json',
  'babel.config.js',
  'metro.config.js',
  'eslint.config.js',
  'commitlint.config.js',
  'index.ts',
  'README.md',
  '.gitignore',
  'expo-env.d.ts',
];

// Directories to copy
const DIRS_TO_COPY = [
  'src',
  'assets',
  'scripts',
];

async function shouldExclude(filePath) {
  const relativePath = path.relative(SOURCE_DIR, filePath);
  const parts = relativePath.split(path.sep);
  
  for (const pattern of EXCLUDE_PATTERNS) {
    if (parts.some(part => part === pattern || part.startsWith(pattern))) {
      return true;
    }
  }
  
  return false;
}

async function copyFile(src, dest) {
  await fs.ensureDir(path.dirname(dest));
  await fs.copy(src, dest);
}

async function copyDirectory(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    // Skip dotfiles that start with . (except .gitignore which we want)
    if (entry.name.startsWith('.') && entry.name !== '.gitignore') {
      continue;
    }
    
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (await shouldExclude(srcPath)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  console.log('Copying template files...');
  
  // Clean template directory
  await fs.emptyDir(TEMPLATE_DIR);
  
  // Copy individual files
  for (const file of FILES_TO_COPY) {
    const srcPath = path.join(SOURCE_DIR, file);
    const destPath = path.join(TEMPLATE_DIR, file);
    
    if (await fs.pathExists(srcPath)) {
      await copyFile(srcPath, destPath);
      console.log(`Copied: ${file}`);
    }
  }
  
  // Copy directories
  for (const dir of DIRS_TO_COPY) {
    const srcPath = path.join(SOURCE_DIR, dir);
    const destPath = path.join(TEMPLATE_DIR, dir);
    
    if (await fs.pathExists(srcPath)) {
      await copyDirectory(srcPath, destPath);
      console.log(`Copied directory: ${dir}`);
    }
  }
  
  console.log('Template files copied successfully!');
}

main().catch(console.error);

