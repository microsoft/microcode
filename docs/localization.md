---
image: ./docs/images/generated/sample_smiley_buttons.png
---

# Localizing MicroCode

The editor will automatically switch to the user language if supported or if the `?lang=<isocode>` is used in the URL.
You can also point directly to a localized by doing `/<icodecode>` like `/fr`.

## Getting started

The localization is handled through [Crowdin](https://crowdin.com). You will need to get a translator account to get started.

-   **translate [tooltips](https://crowdin.com/translate/makecode/12056)**
-   **translate [dialogs](https://crowdin.com/translate/makecode/12142)**

Once your translations are added, someone will have to approve if you are a proofreader, go ahead and approve them. Then send us a comment on the crowdin message board to refresh the build.

## Developer zone

### Adding tooltips in source code

-   add new tooltip to `locales/tooltips.json`
-   refresh tooltips.ts

```bash
node scripts/locs.js en
```

### Updating crowdin

-   Go to https://crowdin.com/project/makecode/content/files
-   click on `Update` for `microcode/tooltips.json` and load `locales/tooltips.json`.

### Refreshing translations

-   go to https://crowdin.com/project/makecode/tools/content-delivery
-   click `Release` on the microcode distribution
-   bump repo
