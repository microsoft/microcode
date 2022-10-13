---
image: ./docs/images/generated/sample_smiley_buttons.png
---

# Localizing MicroCode

The editor will automatically switch to the user language if supported or if the `?lang=<isocode>` is used in the URL.

-   [French](../?lang=fr)

The localization files should be in sub-folder of [locales](https://github.com/microsoft/microcode/tree/main/locales) using the language iso code, eg `locales/fr/tooltips.json`.

-   [ ] `locales/tooltips.json` contains the tooltips displayed on the micro:bit screen

## Adding a new language

-   [ ] copy `tooltips.json` into a new folder who name matches your language iso code (lower case)
-   [ ] translate the strings in the JSON
-   [ ] submit a pull request

## Adding tooltips in source code

Make sure to run script to refresh ts files if you modify `locales/tooltips.json`.

```bash
node scripts/locs.js
```
