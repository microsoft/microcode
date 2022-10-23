---
title: Rock Paper Scissors
image: ./docs/images/generated/sample_rock_paper_scissors.png
---

![Rock Paper Scissors icon](../images/generated/icon_sample_rock_paper_scissors.png){:class="icon-sample"}

![Rock Paper Scissors MicroCode program](../images/generated/sample_rock_paper_scissors.png){:class="sample"}

The classic game of rock paper scissors
where the micro:bit display a different
symbol when shaken.

The program starts with a rule that uses
a shake event and 3-face dice is cast. The result is stored in variable `X`.

![when shake, set variable X to random number up to 3](../images/generated/sample_rock_paper_scissors_page_1_rule_1.png){:class="rule"}

-   **when** ![accelerometer](../images/generated/icon_S3.png){:class="icon"} ![shake](../images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![set variable X](../images/generated/icon_A9A.png){:class="icon"} set variable X to ![dice](../images/generated/icon_M22.png){:class="icon"} random number between 1 and ![value 3](../images/generated/icon_M8.png){:class="icon"} 3.

![when shake, play sound hello](../images/generated/sample_rock_paper_scissors_page_1_rule_2.png){:class="rule"}

-   **when** ![accelerometer](../images/generated/icon_S3.png){:class="icon"} ![shake](../images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![speaker](../images/generated/icon_A2.png){:class="icon"}play sound ![emoji slide](../images/generated/icon_M19slide.png){:class="icon"} hello.

The next 3 rules match the value passed in variable `X`
and display a different symbol for each value, 1, 2 or 3.

![when variable X changed to 1, paint rock](../images/generated/sample_rock_paper_scissors_page_1_rule_3.png){:class="rule"}

-   **when** ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} variable `X` changes to ![value 1](../images/generated/icon_M6.png){:class="icon"} 1, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show image paper.

![when variable X changed to 2, paint paper](../images/generated/sample_rock_paper_scissors_page_1_rule_4.png){:class="rule"}

-   **when** ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} variable `X` changes to ![value 2](../images/generated/icon_M7.png){:class="icon"} 2, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show image rock.

![when variable X changed to 3, paint scissors](../images/generated/sample_rock_paper_scissors_page_1_rule_5.png){:class="rule"}

-   **when** ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} variable `X` changes to ![value 3](../images/generated/icon_M8.png){:class="icon"} 3, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show image scissors.

## improvement ideas

-   increase the range of the dice and add more images!

## Video

<video class="sample" poster="../videos/head-or-tail.png" src="../videos/rock-paper-scissors.mp4" controls="true"></video>
