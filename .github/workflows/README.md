# GitHub Actions Workflows

This directory contains automated workflows for the AOS project.

## Workflows

### 1. CI (`ci.yml`)

**Triggers:** Push and Pull Requests to `next`, `main`, or `master` branches

**What it does:**
- Runs linting with ESLint
- Builds the project with Vite
- Tests on Node.js versions 18, 20, and 22
- Verifies all build artifacts are created
- Uploads build artifacts

**Status:** Runs on every commit to ensure code quality

**Note:** Cypress tests are currently disabled in CI but can be run locally with `npm test`

---

### 2. Build on Release (`build-on-release.yml`)

**Triggers:** When a new GitHub release is created or published

**What it does:**
- Checks out the release commit
- Installs dependencies and builds production assets
- Creates compressed archives (.tar.gz and .zip)
- Uploads dist files to the GitHub release:
  - `aos.js` - UMD bundle
  - `aos.css` - Styles
  - `aos.esm.js` - ES Module
  - `aos.cjs.js` - CommonJS
  - Compressed archives with all files

**Usage:**
1. Create a new release on GitHub
2. Workflow automatically builds and attaches dist files
3. Users can download pre-built files directly from the release

---

### 3. Publish to NPM (`publish-npm.yml`)

**Triggers:** When a GitHub release is published (not draft)

**What it does:**
- Builds production assets
- Publishes package to NPM registry
- Uses NPM provenance for supply chain security

**Setup Required:**
1. Create an NPM access token:
   - Go to npmjs.com → Access Tokens → Generate New Token
   - Select "Automation" type
2. Add to GitHub Secrets:
   - Repository Settings → Secrets → Actions
   - Create `NPM_TOKEN` secret with your token

**Security:**
- Uses NPM provenance (cryptographic proof of build origin)
- Requires authentication via `NPM_TOKEN`
- Only runs on published releases

---

## Setup Instructions

### For Build on Release (No setup needed)
The workflow works out of the box with GitHub's default `GITHUB_TOKEN`.

### For NPM Publishing (Requires setup)

1. **Get NPM Token:**
   ```bash
   # Or create via npmjs.com web interface
   npm login
   npm token create --read-and-write
   ```

2. **Add to GitHub:**
   - Go to: `https://github.com/michalsnik/aos/settings/secrets/actions`
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your NPM token
   - Click "Add secret"

3. **Test:**
   - Create a new release
   - Check Actions tab for workflow status
   - Verify package on npmjs.com

---

## Best Practices

### Creating a Release

```bash
# 1. Update version in package.json
npm version patch  # or minor, or major

# 2. Push with tags
git push && git push --tags

# 3. Create release on GitHub
# Go to: Releases → Draft a new release
# - Choose the tag you just created
# - Add release notes
# - Click "Publish release"

# 4. Workflows automatically:
#    - Build dist files
#    - Upload to release
#    - Publish to NPM
```

### Manual Build (for testing)

```bash
# Test the build locally before releasing
npm run build

# Verify output
ls -lh dist/

# Run tests
npm test
```

---

## Troubleshooting

### Build Fails
- Check Node.js version compatibility (requires Node 18+)
- Ensure all dependencies are in package.json
- Verify build command works locally: `npm run build`

### NPM Publish Fails
- Verify `NPM_TOKEN` secret is set correctly
- Check token hasn't expired (tokens can expire)
- Ensure you have publish rights to the `@ignitekit/aos` package
- Verify version number isn't already published
- For scoped packages, ensure your NPM token has access to the `@ignitekit` organization

### Tests (Local Only)
- Cypress tests disabled in CI workflows
- Run locally: `npm test`
- Some tests may be flaky (known issue with 22/49 passing)

---

## Workflow Badges

Add these to your README.md:

```markdown
[![CI](https://github.com/michalsnik/aos/workflows/CI/badge.svg)](https://github.com/michalsnik/aos/actions/workflows/ci.yml)
[![NPM Version](https://img.shields.io/npm/v/aos)](https://www.npmjs.com/package/aos)
[![NPM Downloads](https://img.shields.io/npm/dm/aos)](https://www.npmjs.com/package/aos)
```

---

## Migration Notes

These workflows replace the old Travis CI configuration (`.travis.yml`). The new GitHub Actions provide:

- ✅ Faster builds (integrated with GitHub)
- ✅ Better caching
- ✅ Multiple Node.js versions tested
- ✅ Automatic release builds
- ✅ NPM publishing automation
- ✅ No external service dependencies

To fully migrate:
1. Remove `.travis.yml` if present
2. Update README badges to use GitHub Actions
3. Set up `NPM_TOKEN` secret for publishing
