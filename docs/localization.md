---
image: ./docs/images/generated/sample_smiley_buttons.png
---

# Localizing MicroCode

The editor will automatically switch to the user language if supported or if the `?lang=<isocode>` is used in the URL.

-   for example, [French](../?lang=fr)

The localization is handled through [Crowdin](https://crowdin.com). You will need to get a translator account to get started.

-   open [tooltips string](https://crowdin.com/translate/makecode/12056)

## Adding tooltips in source code

Make sure to run script to refresh ts files if you modify `locales/tooltips.json`.

```bash
node scripts/locs.js
```
