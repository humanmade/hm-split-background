# Release Process

Releases are handled automatically via GitHub Actions when a new GitHub Release is created.

## Steps

1. Merge all changes into `main` and confirm the build passes locally:
   ```bash
   npm ci && npm run build
   ```

2. Update [CHANGELOG.md](CHANGELOG.md) with the new version entry.

3. On GitHub, go to **Releases → Draft a new release**.

4. Create a new tag following the `vX.Y.Z` format (e.g. `v1.1.0`).

5. Add release notes and click **Publish release**.

The [`release.yml`](.github/workflows/release.yml) workflow will then automatically:
- Replace the `__VERSION__` placeholder in `hm-split-background.php` with the tag version
- Run `npm ci && npm run build` to compile JS assets
- Commit the versioned plugin file and built assets back to the tag
- Create a `.zip` archive (excluding `src/`, `node_modules/`, dev files)
- Attach the `.zip` to the GitHub Release

## Installing via Composer

Point your project's `composer.json` at a specific tag:

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/humanmade/hm-split-background"
        }
    ],
    "require": {
        "humanmade/hm-split-background": "^1.0.0"
    }
}
```
