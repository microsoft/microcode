---
image: ./docs/images/generated/sample_24_7_clap.png
---

# 24 7 clap

![24 7 clap MicroCode program](../images/generated/sample_24_7_clap.png){:class="sample"}

Clap as many times as you can in 7 seconds, but no more than 24 times... that's the game and it will make you crazy.

-   [Open in MicroCode](/microcode/#H4sIAO69QWMAA6VSUU/CMBD+SxtEzR5hNLOTbpnrGPjmQGKhTBKQbfx6r9c2sdNpog+X67Xf3X339V66uFkfgvopWhzo7nhH5USk8gyeGs/An0RxJWKZNyLL6W3ZxVMm4s08jBPIqejea9PyVVZRe6HSD+b3gO8Qx1mOuKnGkZtMxzZv9Avep9I7AQ45cE78h9mkZTPSoPGJMhVbU/GRisZiIVZYwCgsYtTZeoul1z6PNPyWd6TjVZu4c3SMEKHiBHTZ5u0n3TJXt16dNKcwH9QLrXfrfuFV9P6hV48JXWfYO/XN3OdgufROsAu5ugfP8V2yVutPcJaMU+zNde+EcVk/l5u6igph8gfySOP+I22Unn/RKXV1hz7/4n9dldD3R+4wm5NTvOH+4A7hvqmz2jFt6j7c4y4MY9WdwVvsjvV5eD0NkcejQB4R45iH3uFndN0uzN4o/NjoM/bhrRGbw6Jbj+Slgjdar7r5jr2zMA4+AOK+a9kMBAAA)

The game has 3 pages: page 1 is for clapping, page 2 is victory and score, page 3 is game over.

## ![page 1](../images/generated/icon_M1.png){:class="icon"} page 1

![24 7 clap page 1](../images/generated/sample_24_7_clap_page_1.png){:class="sample"}

### Setup

The first 3 rules setup the game environment.

-   play a sound to tell the user clapping started

![when start, play sound hello](../images/generated/sample_24_7_clap_page_1_rule_1.png){:class="rule"}

-   set variable `X` to 1, variable `X` will hold the clap count

![when start, set variable X to 1](../images/generated/sample_24_7_clap_page_1_rule_2.png){:class="rule"}

-   start a clap animation on the screen

![when start, show clap images and repeat](../images/generated/sample_24_7_clap_page_1_rule_3.png){:class="rule"}

### Clapping

The 4th rule increments the variable `X` when a clap is detected.

![when sound loud, set variable X to variable X + 1](../images/generated/sample_24_7_clap_page_1_rule_4.png){:class="rule"}

### Transitions

The last two rules handle transitioning to winning or loosing state.

-   after 7 seconds, switch to page 2 and show score

![when timer 7s, switch to page 2](../images/generated/sample_24_7_clap_page_1_rule_5.png){:class="rule"}

-   when the counter hits 25, the player clapped too many time and switch to page 3 for game over

![when variable X changed to 25, switch to page 3](../images/generated/sample_24_7_clap_page_1_rule_6.png){:class="rule"}

## ![page 2](../images/generated/icon_M2.png){:class="icon"} page 2

![24 7 clap page 2](../images/generated/sample_24_7_clap_page_2.png){:class="sample"}

The 7 second expired and the player clapped 24 or less times,
show score and switch back to page 1 after 10 seconds.

## ![page 3](../images/generated/icon_M2.png){:class="icon"} page 3

![24 7 clap page 3](../images/generated/sample_24_7_clap_page_3.png){:class="sample"}

The player clapped too many times, show game over animation and switch back to page 1.
