# ![Clap lights icon](../images/generated/icon_sample_clap_lights.png){:class="icon-sample"} Clap Lights {#clap-lights}

![Clap lights MicroCode program](../images/generated/sample_clap_lights.png){:class="sample"}

Allows to turn on and off the LEDs of the screen.

## ![page 1](../images/generated/icon_M1.png){:class="icon"} page 1

![clap lights page 1](../images/generated/sample_clap_lights_page_1.png){:class="sample"}

When the page starts, turn on all LEDs.
When a loud sound is detected switch between to page 2

![when page starts, do paint all leds](../images/generated/sample_clap_lights_page_1_rule_1.png){:class="rule"}

-   **when** ![page start](../images/generated/icon_S1.png){:class="icon"} page start, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} paint screen with all leds.

![when loud sond, do switch to page 2](../images/generated/sample_clap_lights_page_1_rule_2.png){:class="rule"}

-   **when** ![microphone](../images/generated/icon_S8.png){:class="icon"} microphone detects ![loud](../images/generated/icon_F15.png){:class="icon"} loud sound, **do** ![switch page](../images/generated/icon_A1.png){:class="icon"} switch page to ![page 2](../images/generated/icon_M2.png) page 2.

## ![page 2](../images/generated/icon_M2.png){:class="icon"} page 2

![clap lights page 2](../images/generated/sample_clap_lights_page_2.png){:class="sample"}

Similar to page 1 but in this case, we turn off all the LEDs.

![when page starts, do turn off all LEDs](../images/generated/sample_clap_lights_page_2_rule_1.png){:class="rule"}

-   **when** ![page start](../images/generated/icon_S1.png){:class="icon"} page start, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} turn off all LEDs

![when loud sond, do switch to page 2](../images/generated/sample_clap_lights_page_2_rule_2.png){:class="rule"}

-   **when** ![microphone](../images/generated/icon_S8.png){:class="icon"} microphone detects ![loud](../images/generated/icon_F15.png){:class="icon"} loud sound, **do** ![switch page](../images/generated/icon_A1.png){:class="icon"} switch page to ![page 2](../images/generated/icon_M1.png) page 1.

## improvement ideas

-   add sounds to notify your user that the command was received
