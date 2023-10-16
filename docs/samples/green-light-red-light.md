---
title: Green light red light
image: ./docs/images/generated/sample_green_light_red_light.png
description: Playing the classic 'green ligt, red light' using the radio
---

![Green light red light MicroCode program](../images/generated/sample_green_light_red_light.png){:class="sample"}

This is the classic 'green light, red light' game where players to try to reach the leader without being caught moving
while the 'light is red'. This is a game played with multiple micro:bit. The leader presses on the logo to enter leader mode, and press button A or B to switch between green and red mode. The current game mode is transmitted via radio
so that every player micro:bit knows when it has to start checking for movement.

-   [Open in MicroCode](/microcode/#H4sIAKCjLGUAAxWM2w6CIBiAHynb9AF+CddAjprlpWMLqYxNWIyePrr+DuTuBmkjp8ToMbsZuWybib2Bnp44GfBS3daEMnLbC5RPW6rjriJhJPTDAxlc1cGLaSQJ2aZl59JVXW0grFz2tNVYX1pQx4Uuhl/L+/PdLVB0EPbvdIKSuXAMP5a2TTmIAAAA)

## ![page 1](../images/generated/icon_M1.png){:class="icon"} page 1

![green light red light page 1 program](../images/generated/sample_green_light_red_light_page_1.png){:class="sample"}

This is the green light player mode page.

![when logo press, switch to page 2](../images/generated/sample_green_light_red_light_page_1_rule_1.png){:class="rule"}

-   Put game in leader mode (page 2) when pressing the logo.

![when radio receive 2, switch to page 3](../images/generated/sample_green_light_red_light_page_1_rule_2.png){:class="rule"}

-   Put game in 'red light' mode (page 3) when received radio value `2`

![when page start, show run animation](../images/generated/sample_green_light_red_light_page_1_rule_3.png){:class="rule"}
![when page start, play hello sond](../images/generated/sample_green_light_red_light_page_1_rule_4.png){:class="rule"}

-   when the page starts, play sound and show running person animation

## ![page 2](../images/generated/icon_M2.png){:class="icon"} page 2

![green light red light page 2 program](../images/generated/sample_green_light_red_light_page_2.png){:class="sample"}

This is the leader mode page.

## ![page 3](../images/generated/icon_M2.png){:class="icon"} page 3

![green light red light page 3 program](../images/generated/sample_green_light_red_light_page_3.png){:class="sample"}

This is the player red light page. The player looses if moving in this phase.

![when shake detected, show game over animation](../images/generated/sample_green_light_red_light_page_3_rule_1.png){:class="rule"}
![when shake detected, play unhappy sound](../images/generated/sample_green_light_red_light_page_3_rule_2.png){:class="rule"}

-   when shake is detected, show game over animation and play unhappy sound

![when radio 1 received, switch to page 1](../images/generated/sample_green_light_red_light_page_3_rule_3.png){:class="rule"}

-   go back to `green light` mode, when radio value 1 is received
