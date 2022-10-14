---
image: ./docs/images/generated/sample_battery_charger_prank.png
---

# ![Battery charge icon](../images/generated/icon_sample_battery_charger_prank.png){:class="icon-sample"} Battery charger prank

![Battery charger prank MicroCode program](../images/generated/sample_battery_charger_prank.png){:class="sample"}

Tell your friend to keep shaking the micro:bit to
recharge the battery... Silly prank.

## ![page 1](../images/generated/icon_M1.png){:class="icon"} page 1

![clap lights page 1](../images/generated/sample_battery_charger_prank_page_1.png){:class="sample"}

Page 1 shows a "battery low" animation
and waits for a `shake` event to switch to page 2.

## ![page 2](../images/generated/icon_M2.png){:class="icon"} page 2

![clap lights page 1](../images/generated/sample_battery_charger_prank_page_2.png){:class="sample"}

Page 2 shows a "battery chargin" animation
and switches back to page 1 after 5 seconds.

Since the user is supposed to keep shaking
the micro:bit, it will keep returning to page 2.
