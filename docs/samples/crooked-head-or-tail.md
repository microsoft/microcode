---
title: Crooked Head or tail
image: ./docs/images/generated/sample_crooked_head_or_tail.png
---

![Crooked Head or tail MicroCode program](../images/generated/sample_crooked_head_or_tail.png){:class="sample"}

-   [Open in MicroCode](/microcode/#H4sIAFu4UmMAA5WRzWrDMBCEX0lO3BYfenATkUqxJFopiZtb81fWVYzBAct9+q4kG9JDAzksq0Uz88Husefd/pzV28X6zKrmidkclL1gZ0MX2FtY/QgodQdvmj1uev6iVjTMJs5SVAyKGZdqxg8n7f71CeAHr0PWjn0Tp0rZfm7eLbNJVryivg86M+aPPqmDbxF9HymzpEV/YBhDk+WcOmF85U5cvw3t4pw3dzIebjBi5hx7yA8cX/cynMB9Xe9D6q8xa8j9wwp/S8zwOz6tBxZg9vSSlSVp8Z7aZx2nyXCHeMeojRpWb+2+ls1ukoICPhGQkqKijtXk+RchEkTREAIAAA==)

This is a crooked variation of the [head or tail](./head-or-tail) sample where tail has 66% chances
of happening. We acheive this by generating
random numbers between 1 and 3 and assigning tail to 2 and 3.

-   1 -> head
-   2 -> tail
-   3 -> tail

The program starts with a rule that uses
a shake event and **3-face** dice is cast. The result is stored in variable `X`.

![when shake, set variable X to random number up to 3](../images/generated/sample_crooked_head_or_tail_page_1_rule_1.png){:class="rule"}

-   **when** ![accelerometer](../images/generated/icon_S3.png){:class="icon"} shake, **do** ![set variable X](../images/generated/icon_A9A.png){:class="icon"} set variable X to ![dice](../images/generated/icon_M22.png){:class="icon"} random number between 1 and ![value 3](../images/generated/icon_M8.png){:class="icon"} 3.

The next 3 rules match the value passed in variable `X`
and display a different symbol for each value, 1, 2 or 3.

![when variable X changed to 1, show head](../images/generated/sample_crooked_head_or_tail_page_1_rule_3.png){:class="rule"}

-   **when** ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} variable `X` changes to ![value 1](../images/generated/icon_M6.png){:class="icon"} 1, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show head image.

![when variable X changed to 2, show head](../images/generated/sample_crooked_head_or_tail_page_1_rule_4.png){:class="rule"}
![when variable X changed to 2, show tail](../images/generated/sample_crooked_head_or_tail_page_1_rule_5.png){:class="rule"}

-   **when** ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} variable `X` changes to ![value 2](../images/generated/icon_M7.png){:class="icon"} 2 or ![value 3](../images/generated/icon_M8.png){:class="icon"} 3, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show tail image.
