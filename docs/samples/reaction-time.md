---
time: Reaction time
image: ./docs/images/generated/sample_reaction_time.png
description: How fast do you react?
---

![reaction time](../images/generated/icon_reaction_time.png){:class="icon-sample"}

![Reaction time MicroCode program](../images/generated/sample_reaction_time.png){:class="sample"}

This is a 2 player game that tests your reaction time. In this game, both player wait for a signal (screen image, sound)
to press the button. The fastest player that presses the button **after** wins the round. You loose if you press before.

This program uses 4 pages:

-   page 1: countdown,
-   page 2: wait for player to press button
-   page 3: player left won
-   page 4: player right won

## ![page 1](../images/generated/icon_M1.png){:class="icon"} page 1

![Reaction time page 1 MicroCode program](../images/generated/sample_reaction_time_page_1.png){:class="sample"}

This is the page where players see a "loader animation"
and wait for the signal.

![loader animation rule](../images/generated/sample_reaction_time_page_1_rule_1.png){:class="rule"}

After 5s + 5 random seconds, we switch to page 2.

![timer to play rule](../images/generated/sample_reaction_time_page_1_rule_2.png){:class="rule"}

If any player presses A early, we transition to page 4 since
player B won.

![false start rule for A rule](../images/generated/sample_reaction_time_page_1_rule_3.png){:class="rule"}

Same for the button B

![false start rule for B rule](../images/generated/sample_reaction_time_page_1_rule_4.png){:class="rule"}

## ![page 2](../images/generated/icon_M2.png){:class="icon"} page 2

![Reaction time page 2 MicroCode program](../images/generated/sample_reaction_time_page_2.png){:class="sample"}

This is the active game page where players have to react as fast as possible.

Players receive the signal as LEDs on and a sound.

![when started, turn on all LEDs](../images/generated/sample_reaction_time_page_2_rule_1.png){:class="rule"}

![when started, play hello](../images/generated/sample_reaction_time_page_2_rule_2.png){:class="rule"}

Then we add rules to switch pages on button press, but unlike page 1, pressing means you win!

![when press A, switch to page 3](../images/generated/sample_reaction_time_page_2_rule_3.png){:class="rule"}

![when press B, switch to page 4](../images/generated/sample_reaction_time_page_2_rule_4.png){:class="rule"}

## ![page 3](../images/generated/icon_M3.png){:class="icon"} page 3

Player A victory page.

![page 3 player A victory](../images/generated/sample_reaction_time_page_3.png){:class="sample"}

The page shows an animation showing left arrows.

![when started, show arrow animation and repeat](../images/generated/sample_reaction_time_page_3_rule_1.png){:class="rule"}

And the game restart after 5 seconds.

![when timer 5s, switch to page 1](../images/generated/sample_reaction_time_page_3_rule_1.png){:class="rule"}

## ![page 4](../images/generated/icon_M4.png){:class="icon"} page 4

Player B victory page, similar to page 3.

![page 4 player B victory](../images/generated/sample_reaction_time_page_4.png){:class="sample"}

## improvement ideas

-   Use touch pin 0 or 1 instead of button A, B as inputs.

## See Also

-   [MakeCode project](https://makecode.microbit.org/projects/reaction-time)
