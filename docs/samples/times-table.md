---
title: Times Table
image: ./docs/images/generated/sample_times_table.png
description: Practice times table math with this program
---

![times table program](../images/generated/sample_times_table.png){:class="sample"}

This is a variation of the [counter sample](./counter.md) where we increment by a random number
instead of just 1. This is a fun program to pratice times table.

The variable `Y` is used to hold the random multiplier and the variable `X`
is used for the counter. Every time the user presses `A`, we add `X + Y` and store it in `X`.

-   [Open in MicroCode](/microcode/#H4sIAKCjLGUAA/NKywwOSDdM9E1yT82rCCwvSi/x8vU2KnWt8i9xrczNcQx0dQJiRwAc3apXKAAAAA==)

![when shake, store random number in Y](../images/generated/sample_times_table_page_1_rule_1.png){:class="rule"}

-   **when** ![accelerometer](../images/generated/icon_S3.png){:class="icon"} ![shake](../images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![set variable X](../images/generated/icon_A9A.png){:class="icon"} set variable X to ![dice](../images/generated/icon_M22.png){:class="icon"} random number between 1 and ![value 5](../images/generated/icon_M10.png){:class="icon"} ![value 5](../images/generated/icon_M10.png){:class="icon"} 10 .

![when variable Y is changed, set X as Y to reset the counter](../images/generated/sample_times_table_page_1_rule_2.png){:class="rule"}

-   **when** ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} variable X changed, **do** ![set variable X](../images/generated/icon_A9A.png){:class="icon"} set variable `X` to [get variable Y](../images/generated/icon_M20B.png){:class="icon"} variable `Y`

![when press button A, increment variable X](../images/generated/sample_times_table_page_1_rule_3.png){:class="rule"}

-   **when** ![press](../images/generated/icon_S2.png){:class="icon"} press ![button A](../images/generated/icon_F3.png){:class="icon"} button A, **do** ![set variable X](../images/generated/icon_A9A.png){:class="icon"} set variable `X` to ![get variable X](../images/generated/icon_M20A.png){:class="icon"} variable `X` plus ![get variable Y](../images/generated/icon_M20B.png){:class="icon"} variable `Y`

![when press button A, increment variable X](../images/generated/sample_times_table_page_1_rule_4.png){:class="rule"}

-   **when** ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} variable X changed, **do** show variable `X` value.
