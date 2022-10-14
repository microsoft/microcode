---
image: ./docs/images/generated/sample_smiley_buttons.png
---

# Localizing MicroCode

The editor will automatically switch to the user language if supported or if the `?lang=<isocode>` is used in the URL.

-   for example, [French](../?lang=fr)

## Getting started

The localization is handled through [Crowdin](https://crowdin.com). You will need to get a translator account to get started.

-   **translate [tooltips string](https://crowdin.com/translate/makecode/12056)**

Note that there is a delay between approving translations in crowdin and having them available in the web site.

## Adding tooltips in source code

Make sure to run script to refresh ts files if you modify `locales/tooltips.json`.

```bash
node scripts/locs.js
```
