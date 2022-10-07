---
image: ./docs/images/generated/sample_chuck_a_duck.png
---

# ![Chuck a duck icon](../images/generated/icon_sample_chuck_a_duck.png){:class="icon-sample"} Chuck a duck {#chuck-a-duck}

![Chuck a duck MicroCode program](../images/generated/sample_chuck_a_duck.png){:class="sample"}

This is a radio program so you'll need 2 micro:bits running to get it to work. The program "sends" a duck using the radio
by shacking the micro:bit.

In code, the accelerometer sensor is used
in two rules to clear the screen (duck is gone)
and send a number using the radio.

![when shake, do clear screen](../images/generated/sample_chuck_a_duck_page_1_rule_1.png){:class="rule"}

-   **when** ![accelerometer](../images/generated/icon_S3.png){:class="icon"} ![shake](../images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} clear screen.

![when shake, do radio send 1](../images/generated/sample_chuck_a_duck_page_1_rule_2.png){:class="rule"}

-   **when** ![accelerometer](../images/generated/icon_S3.png){:class="icon"} ![shake](../images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![radio send](../images/generated/icon_A6.png){:class="icon"} radio send ![value 1](../images/generated/icon_M6.png){:class="icon"} 1.

The third rule uses the radio filter to render
the duck on the screen. This rule executes
when a radio message is received.

![when radio receive 1, do show duck](../images/generated/sample_chuck_a_duck_page_1_rule_3.png){:class="rule"}

-   **when** ![radio receive](../images/generated/icon_S7.png){:class="icon"} radio receive ![value 1](../images/generated/icon_M6.png){:class="icon"} 1, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} paint duck on screen.

![when radio receive 1, play hello sound](../images/generated/sample_chuck_a_duck_page_1_rule_4.png){:class="rule"}

-   **when** ![radio receive](../images/generated/icon_S7.png){:class="icon"} radio receive ![value 1](../images/generated/icon_M6.png){:class="icon"} 1, **do** ![speaker](../images/generated/icon_A2.png){:class="icon"} play sound emoji ![emoji giggle](../images/generated/icon_M19hello.png){:class="icon"} hello.

## Avoiding clashes with groups

If you try this activity with many micro:bits in the same room, they will all start
to trigger the activity. You can avoid groups interference by

-   have student use a different radio value than ![value 1](../images/generated/icon_M6.png){:class="icon"} 1
-   add a rule that runs on the start of the page and sets a different radio group (default is 1)
    using ![radio set group](../images/generated/icon_A6A.png){:class="icon"} `radio set group`.
    The message only reach other micro:bit in the same group.

## improvement ideas

-   add sound emoji when the duck arrives
-   use different radio messages for different images
