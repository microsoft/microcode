---
image: ./docs/images/generated/sample_railroad_crossing.png
---

# ![railroad crossing](../images/generated/icon_railroad_crossing.png){:class="icon-sample"} Railroad crossing

![Railroad crossing MicroCode program](../images/generated/sample_railroad_crossing.png){:class="sample"}

This program controls a railroad crossing. This sample is using [Jacdac](https://aka.ms/jacdac) modules to extend the micro:bit with programmable LEDs, servo and other sensors/actuators.

The ![servo set angle tile](../images/generated/icon_A21_.png){:class="icon"} `servo` uses a [servo motor](https://microsoft.github.io/jacdac-docs/services/servo/) move to move an physical arm. The ![servo set angle tile](../images/generated/icon_A21_.png){:class="icon"} `servo` arm orientation is mapped to the wall clock hours: `0` (or `12`) is on rotated 90 degree from the resting position to the left, `6` is rotated 90 degree right from the rest position.
There is also a secret animation mode when you press the micro:bit logo button.

![when press button A, do move servo to 1 o'clock](../images/generated/sample_railroad_crossing_page_1_rule_1.png){:class="rule"}

-   **when** ![press](../images/generated/icon_S2.png){:class="icon"} press ![button A](../images/generated/icon_F3.png){:class="icon"} button A, **do** ![servo set angle](../images/generated/icon_A21_.png){:class="icon"} servo set arm to 1 o'clock.

![when press button B, do move servo to 5 o'clock](../images/generated/sample_railroad_crossing_page_1_rule_3.png){:class="rule"}

-   **when** ![press](../images/generated/icon_S2.png){:class="icon"} press ![button B](../images/generated/icon_F4.png){:class="icon"} button B, **do** ![servo set angle](../images/generated/icon_A21_.png){:class="icon"} servo set arm to 5 o'clock.

The ![LED](../images/generated/icon_A8.png){:class="icon"} `LED` uses a [programmable LED ring](https://microsoft.github.io/jacdac-docs/services/led/) module to display blue and red colors.

![when press button A, turn LEDs to red](../images/generated/sample_railroad_crossing_page_1_rule_2.png){:class="rule"}

-   **when** ![press](../images/generated/icon_S2.png){:class="icon"} press ![button A](../images/generated/icon_F3.png){:class="icon"} button A, **do** ![LED](../images/generated/icon_A8.png){:class="icon"} LED set all color to ![red](../images/generated/icon_A20_1.png){:class="icon"} red, black and repeat.

![when press button B, turn LEDs to blue](../images/generated/sample_railroad_crossing_page_1_rule_4.png){:class="rule"}

-   **when** ![press](../images/generated/icon_S2.png){:class="icon"} press ![button B](../images/generated/icon_F4.png){:class="icon"} button B, **do** ![LED](../images/generated/icon_A8.png){:class="icon"} LED set all color to ![blue](../images/generated/icon_A20_3.png){:class="icon"} blue, black and repeat.

![when press button B, show LED rainbow animation and repeat](../images/generated/sample_railroad_crossing_page_1_rule_5.png){:class="rule"}

-   **when** ![press](../images/generated/icon_S2.png){:class="icon"} press ![logo](../images/generated/icon_F7.png){:class="icon"} button B, **do** ![LED](../images/generated/icon_A8.png){:class="icon"} LED show rainbow animation.

<video class="sample" poster="../videos/jacdac-led.png" src="../videos/jacdac-led.mp4" controls="true"></video>
