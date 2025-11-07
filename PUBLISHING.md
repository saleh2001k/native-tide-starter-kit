# Publishing Guide

## Initial Setup

### 1. Login to npm

First, make sure you're logged in to npm:

```bash
npm login
```

You'll need:
- Your npm username
- Your password
- Your email address
- A one-time password (if you have 2FA enabled)

### 2. Verify you're logged in

```bash
npm whoami
```

### 3. Check if the package name is available

The package name `native-tide-starter-kit` should be available, but you can verify:

```bash
npm view native-tide-starter-kit
```

If it returns a 404, the name is available.

## Publishing Your Package

### First Time Publishing

1. **Make sure all changes are committed and pushed:**
   ```bash
   git status
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. **Update the template (if you made changes to the source repo):**
   ```bash
   node scripts/copy-template.js
   ```

3. **Publish to npm:**
   ```bash
   npm publish
   ```

This will publish version 1.0.0 to npm.

## Updating the Package

**Important:** npm packages don't automatically update when you push to GitHub. You need to publish a new version to npm for users to get updates.

### Workflow for Updates

1. **Make changes to your code**
2. **Update the template (if needed):**
   ```bash
   node scripts/copy-template.js
   ```
3. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
4. **Bump version and publish:**

   For a **patch** version (1.0.0 → 1.0.1) - bug fixes:
   ```bash
   npm run publish:patch
   ```

   For a **minor** version (1.0.0 → 1.1.0) - new features:
   ```bash
   npm run publish:minor
   ```

   For a **major** version (1.0.0 → 2.0.0) - breaking changes:
   ```bash
   npm run publish:major
   ```

   Or manually:
   ```bash
   npm version patch  # or minor, or major
   git push
   git push --tags
   npm publish
   ```

## Versioning

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backwards compatible manner
- **PATCH** version when you make backwards compatible bug fixes

## Package Linking

The package.json now includes:
- `repository`: Links to your GitHub repo
- `homepage`: Points to the README
- `bugs`: Links to GitHub issues

This means:
- Users can see the source code on npm
- The npm package page will link to your GitHub repo
- Users can install directly from GitHub if needed: `npm install saleh2001k/native-tide-starter-kit`

## Testing Before Publishing

You can test the package locally before publishing:

```bash
# Link the package locally
npm link

# In another directory, test it
cd /path/to/test
npm link native-tide-starter-kit
native-tide-starter-kit
```

## Unpublishing (if needed)

If you need to unpublish (only within 72 hours of publishing):

```bash
npm unpublish native-tide-starter-kit@<version>
```

Or to unpublish the entire package (only if no one has installed it):

```bash
npm unpublish native-tide-starter-kit --force
```

## Notes

- The `prepublishOnly` script automatically updates the template before publishing
- Always test locally before publishing
- Make sure to update the README if you add new features
- Consider adding a CHANGELOG.md to track version changes

