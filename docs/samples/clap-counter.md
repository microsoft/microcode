---
title: Clap Counter
image: ./docs/images/generated/sample_clap_counter.png
description: Count your claps!
---

![counter program](../images/generated/sample_clap_counter.png){:class="sample"}

This program counts how many times you clap using the microphone.

-   [Open in MicroCode](/microcode/#H4sIAKCjLGUAA/NKywwOyPCK8PU2SnKt8i9xDHR1AmJHAO6A3EEYAAAA)

![when shake detected, increment variable X](../images/generated/sample_clap_counter_page_1_rule_1.png){:class="rule"}

-   **when** ![microphone](../images/generated/icon_S8.png){:class="icon"} microphone detects ![loud](../images/generated/icon_F15.png){:class="icon"} loud sound, **do** ![set variable X](../images/generated/icon_A9A.png){:class="icon"} set variable `X` to ![get variable X](../images/generated/icon_M20A.png){:class="icon"} variable `X` plus ![value 1](../images/generated/icon_M6.png){:class="icon"} `value 1`

![when variable X changed, show variable X](../images/generated/sample_clap_counter_page_1_rule_2.png){:class="rule"}

-   **when** ![variable X changed, show variable X  alue](../images/generated/icon_S9A.png){:class="icon"} variable X changed, **do** show variable `X` value.
