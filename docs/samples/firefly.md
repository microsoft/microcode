# ![Firefly icon](../images/generated/icon_sample_firefly.png){:class="icon-sample"} Firefly {#firefly}

![firefly MicroCode program](../images/generated/sample_firefly.png){:class="sample"}

Fireflies in the wild synchronize their glowing although there is no leader to give the tempo.
Go to [http://ncase.me/fireflies/](http://ncase.me/fireflies/) and read about the fireflies synchronization phenomenon.

Just like fireflies in the wild, you can create program that synchronize blinking
between any number of micro:bit! The firefly program uses two pages, page 1 will run when the light is off
and page 2 will handle a glow. **You will need 3 micro:bit to make the synchronization work!**

## ![page 1](../images/generated/icon_M1.png){:class="icon"} page 1

![firefly page 1](../images/generated/sample_firefly_page_1.png){:class="sample"}

In ![page 1](../images/generated/icon_M1.png){:class="icon"} page 1, we add a rule that clears the screen and keeps a dot ![screen](../images/generated/icon_A5.png){:class="icon"} when the page starts.

![firefly page 1 rule 1](../images/generated/sample_firefly_page_1_rule_1.png){:class="rule"}

The clock of the firefly will be held in ![get variable X](../images/generated/icon_M20A.png){:class="icon"} variable `X`. It starts at ![value 1](../images/generated/icon_M6.png){:class="icon"} 1 and once it reaches 8, the firefly will glow.

The ![radio receive](../images/generated/icon_S7.png){:class="icon"} `radio receive` moves the clock by 1 whenever a neighboring firefly sent a message.

![when radio receive, do increment X by 1](../images/generated/sample_firefly_page_1_rule_2.png){:class="rule"}

The ![timer](../images/generated/icon_S4.png){:class="icon"} `timer` rule moves the clock every ![quarter of a second](../images/generated/icon_F13.png){:class="icon"} quarter of a second;

![when timer quarter of second, do increment X by 1](../images/generated/sample_firefly_page_1_rule_3.png){:class="rule"}

The next rule, ![variable X changed](../images/generated/icon_S9A.png){:class="icon"} **when** variable `X` changed to 8, transitions to ![page 2](../images/generated/icon_M2.png){:class="icon"} page 2 when the clock reaches `8`.

![when variable X changed to 8, switch to page 2](../images/generated/sample_firefly_page_1_rule_4.png){:class="rule"}

Since it is possible that we miss the number `8` because the firefly received many radio updates at once,
we add one last rule, a `timer every 3s` that transitions to page 2.

![when timer 3s, do switch to page 2](../images/generated/sample_firefly_page_1_rule_5.png){:class="rule"}

## ![page 2](../images/generated/icon_M2.png){:class="icon"} page 2

![firefly page 1](../images/generated/sample_firefly_page_2.png){:class="sample"}

A radio message is sent to other firefly so that they can nudge their clock (![radio send](../images/generated/icon_A6.png){:class="icon"}).

![when page started, send radio message](../images/generated/sample_firefly_page_2_rule_1.png){:class="rule"}

The variable `X` is ![set variable X](../images/generated/icon_A9A.png){:class="icon"} set to ![value 1](../images/generated/icon_M6.png){:class="icon"} 1.

![when page started, set variable X to 1](../images/generated/sample_firefly_page_2_rule_2.png){:class="rule"}

All the LEDs are turned on.

![when page started, do turn all LEDs on](../images/generated/sample_firefly_page_2_rule_3.png){:class="rule"}

A sound is played.

![when page started, do play hello](../images/generated/sample_firefly_page_2_rule_4.png){:class="rule"}

After half a second, we transition back to page 1 to restart the non-glow phase.

![when timer half a second, do switch to page 1](../images/generated/sample_firefly_page_2_rule_5.png){:class="rule"}

## improvement ideas

-   use a radio group to avoid interference with other users
-   remix this technique with other programs to create new synchronized experiences!

