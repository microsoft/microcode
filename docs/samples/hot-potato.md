---
image: ./docs/images/generated/sample_hot_potato.png
---

# ![Hot potato icon](../images/generated/icon_hot_potato.png){:class="icon-sample"} Hot potato

![Hot potato MicroCode program](../images/generated/sample_hot_potato.png){:class="sample"}

Pass the hot potato around and make
sure it does not beep while you have it
in your hands!

## ![page 1](../images/generated/icon_M1.png){:class="icon"} page 1

![hot potato page 1](../images/generated/sample_hot_potato_page_1.png){:class="sample"}

The first page of the program is a random timer of 5 to 6 seconds.
Once the timer triggers, the first rule ![switch page](../images/generated/icon_A1.png){:class="icon"} switches to ![page 2](../images/generated/icon_M2.png){:class="icon"} page 2.

![when timer 5 seconds plus 1 random second, do switch to page 2](../images/generated/sample_hot_potato_page_1_rule_1.png){:class="rule"}

-   **when** ![timer](../images/generated/icon_S4.png){:class="icon"} time
    of ![5 seconds](../images/generated/icon_F19.png){:class="icon"} 5s
    and ![1 random second](../images/generated/icon_F18.png){:class="icon"} 1
    random second, **do** ![switch page](../images/generated/icon_A1.png){:class="icon"} switches to ![page 2](../images/generated/icon_M2.png){:class="icon"} page 2.

## ![page 2](../images/generated/icon_M2.png){:class="icon"} page 2

![hot potato page 2](../images/generated/sample_hot_potato_page_2.png){:class="sample"}

On this page, we should a skull image and play a sad sound on start.
If the **when** section is empty, the rule runs once at the page start only.

![when page starts, do paint a skull](../images/generated/sample_hot_potato_page_2_rule_1.png){:class="rule"}

-   **when** ![page start](../images/generated/icon_S1.png){:class="icon"} page start, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show image skull.

![when page starts, do play sad sound](../images/generated/sample_hot_potato_page_2_rule_2.png){:class="rule"}

-   **when** ![page start](../images/generated/icon_S1.png){:class="icon"} page start, **do** ![speaker](../images/generated/icon_A2.png){:class="icon"} play sound emoji ![emoji sad](../images/generated/icon_M19sad.png){:class="icon"} sad.

## improvement ideas

-   add sound emoji when timer expires
-   add a better expired potato animation
