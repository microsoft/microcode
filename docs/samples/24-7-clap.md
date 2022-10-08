---
image: ./docs/images/generated/sample_24_7_clap.png
---

# 24 7 clap

![24 7 clap MicroCode program](../images/generated/sample_24_7_clap.png){:class="sample"}

Clap as many times as you can in 7 seconds, but no more than 24 times... that's the game and it will make you crazy.

-  [Open in MicroCode](/#H4sIANizQWMAA6VTTU/DMAz9S+sYoB126LqopCytqqbrthvdmMiWlUmd6Mevx04aQQoFCQ6W4/TZfn5xn5ug2p2nxdZfnenxck+lKyJ5BU87z8CXIm2JWCeViBN6lzXBnIlgv/SCEHJyehrVUfYic79+o9KZLh8A3ygcZ4nCzTWO3MY6NnnjX/AOlaMScIoD58R5XLg1W5BKGXfRMDaG8YWKymAhRixgEKsweDbeYGnb5xF53/L2dbypQ3uOhhEiMA5Bl0NSf9IttnXr1YkSCvNBPc94u+4XXmnvHXr1mNB1hr1Vv5v7Ol2vRyXsQoL34Ln6Llmt9SdqlphT1Zvr3iHjsnjK9kXup6LLH8gjlf2OtEI9/6JTZOsOff7Fv91k0PdH7jCblZO+qv1RO6T2Dc+4Y9rw3jupXRjG4l2HN9gj0zxunE4X/f8dVh/z0WIrd0V4yccTEYlgzMSkXR5dcYhns3foezqfyAMAAA==)

The game has 3 pages: page 1 is for clapping, page 2 is victory and score, page 3 is game over.

## ![page 1](../images/generated/icon_M1.png){:class="icon"} page 1

![24 7 clap page 1](../images/generated/sample_24_7_clap_page_1.png){:class="sample"}

### Setup

The first 3 rules setup the game environment.

- play a sound to tell the user clapping started

![when start, play sound hello](../images/generated/sample_24_7_clap_page_1_rule_1.png){:class="rule"}

- set variable `X` to 1, variable `X` will hold the clap count

![when start, set variable X to 1](../images/generated/sample_24_7_clap_page_1_rule_2.png){:class="rule"}

- start a clap animation on the screen

![when start, show clap images and repeat](../images/generated/sample_24_7_clap_page_1_rule_3.png){:class="rule"}

### Clapping

The 4th rule increments the variable `X` when a clap is detected.

![when sound loud, set variable X to variable X + 1](../images/generated/sample_24_7_clap_page_1_rule_4.png){:class="rule"}

### Transitions

The last two rules handle transitioning to winning or loosing state.