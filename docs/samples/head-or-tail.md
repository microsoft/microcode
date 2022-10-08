---
image: ./docs/images/generated/sample_head_or_tail.png
---

# ![Head or tail icon](../images/generated/icon_sample_head_or_tail.png){:class="icon-sample"} Head or tail

![Head or tail MicroCode program](../images/generated/sample_head_or_tail.png){:class="sample"}

Flip a virtual coin and show head or tail when the micro:bit is shaken.

The program starts with a rule that uses
a shake event and 2-face dice is cast. The result is stored in variable `X`.

![when shake, set variable X to random number up to 2](../images/generated/sample_head_or_tail_page_1_rule_1.png){:class="rule"}

-   **when** ![accelerometer](../images/generated/icon_S3.png){:class="icon"} ![shake](../images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![set variable X](../images/generated/icon_A9A.png){:class="icon"} set variable X to ![dice](../images/generated/icon_M22.png){:class="icon"} random number between 1 and ![value 3](../images/generated/icon_M8.png){:class="icon"} 3.

The next 2 rules match the value passed in variable `X`
and display a different symbol for each value, 1 or 2.

![when variable X changed to 1, show head](../images/generated/sample_head_or_tail_page_1_rule_2.png){:class="rule"}

-   **when** ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} variable `X` changes to ![value 1](../images/generated/icon_M6.png){:class="icon"} 1, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show head image.

![when variable X changed to 2, show tail](../images/generated/sample_head_or_tail_page_1_rule_3.png){:class="rule"}

-   **when** ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} variable `X` changes to ![value 2](../images/generated/icon_M7.png){:class="icon"} 2, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show tail image.

## improvement ideas

-   add sound emoji whenever shake happens
-   clear the screen before showing the new symbol


## Video

<video class="sample" poster="../videos/head-or-tail.png" src="../videos/head-or-tail.mp4" controls="true"></video>
