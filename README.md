# HM Split Background


https://github.com/user-attachments/assets/f4a40412-44a1-46f3-9072-0b92152a88d0


Adds a **Split Background** panel to the `core/group` block in the WordPress block editor. It lets editors apply a hard-edge vertical gradient (two solid colours with a precise cutoff) without touching CSS or fighting the native gradient picker.

The feature writes to the standard `style.color.gradient` attribute, so it's fully compatible with existing gradient tooling and produces no extra markup.

## How it works

The panel appears in the **Styles** tab of any Group block. Enable the toggle, pick two colours from the theme palette, and drag the range control to set the split position (0–100%).

Disabling the toggle clears the gradient.

## Installation

### Via Composer (recommended)

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/humanmade/hm-split-background"
        }
    ],
    "require": {
        "humanmade/hm-split-background": "dev-release"
    }
}
```

### Manual

Download the `release` branch and drop it into `wp-content/plugins/`.

## Development

```bash
npm install
npm run start   # watch mode
npm run build   # production build
```

## Release

```bash
npm run release
```

This checks out the `release` branch, hard-resets it to `main`, runs a production build, force-commits the compiled `build/` directory, and pushes. Composer installs point at the `release` branch so they always get compiled assets.

## Requirements

- WordPress 6.5+
- PHP 8.0+
