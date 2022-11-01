---
title: Counter
image: ./docs/images/generated/sample_counter.png
description: Count how many times button A is pressed
---

![counter program](../images/generated/sample_counter.png){:class="sample"}

This program counts how many times you press ![button A](../images/generated/icon_F3.png){:class="icon"} `button A`.

-   [Open in MicroCode](/microcode/#H4sIAMG4UGMAA4WPywqDMBBFfyl90OKii7YEO8EoNvGBS19lNFpBQe3XNxoX3XV1OTD3cqaY2Zg1VpvYYQNVdwZ1RU8NOmFLrrPH4AMYixF9AadoZjcvoCs/cWWbzyx37szVGynUZOaU4sIusrwU08+OuoEiPdR0ZV/S0TBZWUoYffGvY1ykcXG5VO8kmvpUOyy9MtxZzkP3FrfDYMUx6fWfYnErDrtt2/xnbs0NtInKWrdL90f0kO05HolTvbD0L5cvGfuL7ygBAAA=)

![when press button A, increment variable X](../images/generated/sample_counter_page_1_rule_1.png){:class="rule"}

-   **when** ![press](../images/generated/icon_S2.png){:class="icon"} press ![button A](../images/generated/icon_F3.png){:class="icon"} button A, **do** ![set variable X](../images/generated/icon_A9A.png){:class="icon"} set variable `X` to ![get variable X](../images/generated/icon_M20A.png){:class="icon"} variable `X` plus ![value 1](../images/generated/icon_M6.png){:class="icon"} `value 1`

![when variable X changed, show variable X value](../images/generated/sample_counter_page_1_rule_2.png){:class="rule"}

-   **when** ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} variable X changed, **do** show variable `X` value.

## Video

<video class="sample" poster="../videos/counter.png" src="../videos/counter.mp4" controls="true"></video>

## Improvements

-   Turn this counter into a [step counter](./step-counter) by using the shake tile.
