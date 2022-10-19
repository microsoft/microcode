---
image: ./docs/images/generated/sample_smiley_buttons.png
---

# Localizing MicroCode

The editor will automatically switch to the user language if supported or if the `?lang=<isocode>` is used in the URL.
You can also point directly to a localized by doing `/<icodecode>` like `/fr-fr`.

## Getting started

The localization is handled through [Crowdin](https://crowdin.com). You will need to get a translator account to get started.

-   **translate [tooltips string](https://crowdin.com/translate/makecode/12056)**

Once your translations are added, someone will have to approve if you are a proofreader, go ahead and approve them. Then send us a comment on the crowdin message board to refresh the build.

## Adding tooltips in source code

Make sure to run script to refresh ts files if you modify `locales/tooltips.json`.

```bash
node scripts/locs.js
```
