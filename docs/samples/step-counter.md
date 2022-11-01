---
title: Step Counter
image: ./docs/images/generated/sample_step_counter.png
description: Count your steps!
---

![counter program](../images/generated/sample_step_counter.png){:class="sample"}

This program counts your steps by measuring the shake events (heavy steps!).

-  [Open in MicroCode](/microcode/#H4sIAKE9YWMAA32PSQ+CMBCF/xLi2qMQgm0oBFsWubFIKIKaAGH59Q4FPXp6+SZv3pu5j6RPa/SMTL/G5fuIq7NwqhYUr0pBG+FNVISsFy7Dh2AkmuMZkq9Cskl5lqdqUcSqJ+d88dm01DQsgPlNhKHSQB+HngRy9y4jmaUTTfLDGKgu2V5YGakBHf93RlwpDXjljZwb+9j0m8Q8LXvbTZaz4fdL7m+QdYFf5pu3LVqz2Zz19UqPTtQoJFMcoA6XL5GVuLP13eAwgj6oFq8wMAEAAA==)

![when shake detected, increment variable X](../images/generated/sample_step_counter_page_1_rule_1.png){:class="rule"}

-   **when** ![accelerometer](../images/generated/icon_S3.png){:class="icon"} ![shake](../images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![set variable X](../images/generated/icon_A9A.png){:class="icon"} set variable `X` to ![get variable X](../images/generated/icon_M20A.png){:class="icon"} variable `X` plus ![value 1](../images/generated/icon_M6.png){:class="icon"} `value 1`

![when variable X changed, show variable X](../images/generated/sample_step_counter_page_1_rule_2.png){:class="rule"}

-   **when** ![variable X changed, show variable X  alue](../images/generated/icon_S9A.png){:class="icon"} variable X changed, **do** show variable `X` value.
