---
title: Flashing Heart
image: ./docs/images/generated/sample_flashing_heart.png
description: Show animations on the screen
---

![Flashing Heart icon](../images/generated/icon_sample_flashing_heart.png){:class="icon-sample"}

![Flashing Heart MicroCode program](../images/generated/sample_flashing_heart.png){:class="sample"}

The goal of this program is to show a cute heart animation.

We use a single rule with a ![timer](../images/generated/icon_S4.png){:class="icon"} timer. The timer starts a ![screen](../images/generated/icon_A5.png){:class="icon"} screen animation
with two images. Each time the timer triggers again, it repaints both images which create the heart animation.

![flashing heart rule 1](../images/generated/sample_flashing_heart_page_1_rule_1.png){:class="rule"}

-   **when** ![timer](../images/generated/icon_S4.png){:class="icon"} timer triggers, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show image heart.

![flashing heart rule 2](../images/generated/sample_flashing_heart_page_1_rule_2.png){:class="rule"}

-   **when** ![timer](../images/generated/icon_S4.png){:class="icon"} timer triggers, **do** ![speaker](../images/generated/icon_A2.png){:class="icon"}play sound ![emoji hello](../images/generated/icon_M19hello.png){:class="icon"} hello.

## improvement ideas

-   add more animation frames to create a better beating heart
-   add more sounds
-   make your own animation
