---
title: Language
image: ./docs/images/generated/sample_smiley_buttons.png
description: Documentation of the MicroCode programming language.
---

The MicroCode language is defined in terms of **pages**, where a page has a list of **rules**,
and each rule consists of a **When** section and a **Do** section, each with a list of programming
**tiles**.

MicroCode supports events, conditions on the events, sequencing,
loops, variables, and simple arithmetic (addition, for now) over constants and variables.
See [samples](./samples) for a list of annotated examples.

The picture below shows a 1-page program with four rules.

![Smiley Button MicroCode program](./images/generated/sample_smiley_buttons.png){:class="screenshot"}

The first two rules run when A is pressed.

![when button A pressed, show image smiley](./images/generated/sample_smiley_buttons_page_1_rule_1.png){:class="rule"}

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![button A](./images/generated/icon_F3.png){:class="icon"} button A, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} show image smiley.

![when button A pressed, play happy sound](./images/generated/sample_smiley_buttons_page_1_rule_2.png){:class="rule"}

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![button A](./images/generated/icon_F3.png){:class="icon"} button A, **do** ![speaker](./images/generated/icon_A2.png){:class="icon"} play sound emoji ![emoji happy](./images/generated/icon_M19happy.png){:class="icon"} happy.

The other rules are similar but trigger for button B.

## Pages {#pages}

Execution of the MicroCode program starts on ![page 1](./images/generated/icon_M1.png){:class="icon"} page 1. All the rules on that page are active.
Rules on another page only become active when the program switches to that page
(via an explicit ![switch page](./images/generated/icon_A1.png){:class="icon"} switch-page command, discussed later).

![Hot potato sample](./images/generated/sample_hot_potato.png){:class="screenshot"}

## WHEN section {#when}

The left-hand side of a rule, the `When` section, starts with an
**event** tile from the following dialog, which appears when you select the leftmost empty tile of a rule:

![event tiles in when section](./images/whenDialog.jpg){:class="screenshot"}

-   ![press image](./images/generated/icon_S2.png){:class="icon"} `press` of button, micro:bit icon, or pin
-   ![release image](./images/generated/icon_S2B.png){:class="icon"} `release` of button, micro:bit icon, or pin
-   ![move image](./images/generated/icon_S3.png){:class="icon"} `move` of accelerometer, in various ways
-   ![hear image](./images/generated/icon_S8.png){:class="icon"} `hear` a sound, either loud or soft
-   ![radio receive image](./images/generated/icon_S7.png){:class="icon"} `radio receive` of a number
-   ![start page image](./images/generated/icon_S1.png){:class="icon"} `start page` only runs when the page is started (or switched to), with an optional delay
-   ![timer image](./images/generated/icon_S4.png){:class="icon"} `timer` of a time
-   ![variable X image](./images/generated/icon_S9A.png){:class="icon"} ![variable Y image](./images/generated/icon_S9B.png){:class="icon"} ![variable Z image](./images/generated/icon_S9C.png){:class="icon"} `variable (X,Y,Z) changed` to a number

If the `when` section is left empty,
the rule will run once when the page is started.

### Event parameters and conditions

An event tile can be followed by none, one or more parameter tiles which determines the conditions under which execution will proceed from the **When** section to the **Do** section, Every event has a default parameter, which is used when no parameter is specified. The defaults are:

-   ![press](./images/generated/icon_S2.png){:class="icon"} `press`, defaults to `button A` ![press image](./images/generated/icon_F3.png){:class="icon"};
    other options include `button B` ![press image](./images/generated/icon_F4.png){:class="icon"},
    `micro:bit logo` ![press image](./images/generated/icon_F7.png){:class="icon"},
    `pin 0` ![press image](./images/generated/icon_F0.png){:class="icon"},
    `pin 1` ![press image](./images/generated/icon_F1.png){:class="icon"}, `pin 2` ![press image](./images/generated/icon_F2.png){:class="icon"}
-   ![release](./images/generated/icon_S2B.png){:class="icon"} `release`, defaults and options are the same as for `press`

The dialog below shows the parameters associated with the button press/release events.

![parameters for press/release event](./images/eventParameterDialog.jpg){:class="screenshot"}

-   ![accelerometer](./images/generated/icon_S3.png){:class="icon"} `move`, defaults to ![shake](./images/generated/icon_F17_shake.png){:class="icon"} `shake`; other options include ![tilt up](./images/generated/icon_F17_tilt_up.png){:class="icon"} `tilt up`, ![tilt down](./images/generated/icon_F17_tilt_down.png){:class="icon"} `tilt down`, ![tilt left](./images/generated/icon_F17_tilt_left.png){:class="icon"} `tilt left` and ![tilt right](./images/generated/icon_F17_tilt_right.png){:class="icon"} `tilt right`
-   ![hear image](./images/generated/icon_S8.png){:class="icon"} `hear`, defaults to ![loud](./images/generated/icon_F15.png){:class="icon"}`loud`
-   ![radio receive](./images/generated/icon_S7.png){:class="icon"} `radio receive`, defaults to `any`
-   ![timer](./images/generated/icon_S4.png){:class="icon"} `timer`, defaults to `1/4 second`
-   ![variable X image](./images/generated/icon_S9A.png){:class="icon"} `variable (X,Y,Z) changed`, defaults to `any` (any value change triggers it)

### Conditions on event values

When an event carries a numeric value (in the case of receiving a radio message or a variable being updated), if that value is equal to the number of dots that follows, in total, then execution will proceed to the DO section. Here are the five available (dot) values:

-   `1 dot` ![one dot](./images/generated/icon_F8.png){:class="icon"}
-   `2 dots`: ![two dots](./images/generated/icon_F9.png){:class="icon"}
-   `3 dots`: ![three dots](./images/generated/icon_F10.png){:class="icon"}
-   `4 dots`: ![four dots](./images/generated/icon_F11.png){:class="icon"}
-   `5 dots`: ![five dots](./images/generated/icon_F12.png){:class="icon"}

The `timer` is parameterized with various times that can also be sequenced and summed:

-   `1/4 second`: ![1/4 second](./images/generated/icon_F13.png){:class="icon"}
-   `1 second`: ![1 second](./images/generated/icon_F14.png){:class="icon"}
-   `5 seconds`: ![5 seconds](./images/generated/icon_F19.png){:class="icon"}
-   `? seconds`: ![0 to 1 second, chosen randomly](./images/generated/icon_F18.png){:class="icon"} - 0 to 1 second, chosen randomly

In the case of the timer, the sum specifies the amount of time to start the timer with.

![command tiles in do section](./images/doDialog.jpg){:class="screenshot"}

## DO section {#do}

The right-hand side of a rule, the **Do** section, starts with a
**command** tile from the following list:

-   ![screen](./images/generated/icon_A5.png){:class="icon"} `show image` shows an animation sequence on the LED screen.
-   ![show number](./images/generated/icon_A10.png){:class="icon"} `show number` shows a numeric value between 0 and 99
-   ![speaker](./images/generated/icon_A2.png){:class="icon"} `sound emoji` plays a sequence of emojis
-   ![play notes](./images/generated/icon_A4.png){:class="icon"} `play notes` plays a sequence of notes (from the C major scale)
-   ![radio send](./images/generated/icon_A6.png){:class="icon"} `radio send` sends a given number over the radio
-   ![radio set group](./images/generated/icon_A6A.png){:class="icon"} `radio set group` takes a number and ensures that radio messages from a different group number are ignored (the default radio group is 1, which means all micro:bits see all messages)
-   ![switch page](./images/generated/icon_A1.png){:class="icon"} `switch page` transfers execution control to a given page
-   ![set variable X](./images/generated/icon_A9A.png){:class="icon"} `set variable` puts a number into a variable (`X`, `Y`, `Z`); defaults to 0 if no value specified

A command can be followed by various parameter tiles, depending on the type
of command. As with events, every command has a default parameter, for the
case where no parameter tile is given:

-   ![screen](./images/generated/icon_A5.png){:class="icon"} `screen` shows a `happy face` by default
-   ![speaker](./images/generated/icon_A2.png){:class="icon"} `sound emoji` plays ![emoji giggle](./images/generated/icon_M19giggle.png){:class="icon"} `giggle` by default
-   ![radio send](./images/generated/icon_A6.png){:class="icon"} `radio send` sends the number `1` by default
-   ![switch page](./images/generated/icon_A1.png){:class="icon"} `switch page` switches to page `1` by default
-   ![get variable X](./images/generated/icon_M20A.png){:class="icon"} `get variable` gets the number from a variable (`X`, `Y`, `Z`); defaults to `0` if variable wasn't previously set.
    Sequences of numeric parameters are summed, as before, allowing the construction of values greater than `5 dots`.

### Asset editors

Two editors are provided to allow the creation of 5x5 LED images and simple melodies.

#### LED image editor

THe LED image editor lets you select which LEDs are on/off for a frame of an animation. You can continue to add LED images in a sequence (the editor will make a copy of the last image):

<video class="sample" poster="./videos/ledFieldEditor.png" src="./videos/ledFieldEditor.mp4" controls="true"></video>

#### Melody editor

The melody editor lets you compose a four note sequence, where each note can be C,D,E,F, or G:

<video class="sample" poster="./videos/melodyFieldEditor.png" src="./videos/melodyFieldEditor.mp4" controls="true"></video>

### Constructing numbers

For commands that expect a numeric value (![radio send](./images/generated/icon_A6.png){:class="icon"} `radio send`, ![in variable X](./images/generated/icon_M20A.png){:class="icon"} `set variable`), a variety of tiles are available

-   the **constant values** ![value 1](./images/generated/icon_M6.png){:class="icon"} 1, 2, 3, 4 and 5 dots
-   the **values of variables** ![out of variable X](./images/generated/icon_S9A.png){:class="icon"} `X`, `Y`, and `Z`
-   the **value of the radio receive event** ![value of radio receive event](./images/generated/icon_M21.png){:class="icon"}, only available if **WHEN** section has radio receive event ![radio receive event](./images/generated/icon_S7.png){:class="icon"}
-   a ![dice](./images/generated/icon_M22.png){:class="icon"} **random number generator** yields a random integer between `1` and `5` (inclusive) by default

### ![repeat](./images/generated/icon_M23.png){:class="icon"} `repeat` (loops) {#loops}

A ![repeat](./images/generated/icon_M23.png){:class="icon"} `repeat` tile
can be added to certain commands to repeat the entire **DO** section. The value tiles
after `repeat` determine the number of iterations. If no value is given, it repeats forever.

![when touch logo, print happy on screen](./images/generated/sample_pet_hamster_page_1_rule_2.png){:class="rule"}

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![logo](./images/generated/icon_F7.png){:class="icon"} micro:bit logo, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} show image happy animation and ![repeat](./images/generated/icon_M23.png){:class="icon"} repeat ![value 3](./images/generated/icon_M8.png){:class="icon"} 3 times.

## Accessories (Jacdac Modules) {#jacdac}

MicroCode will detect [Jacdac](https://aka.ms/jacdac) module and automatically display tiles for some of them.

### WHEN modules

-   ![magnet detector](./images/generated/icon_S10.png){:class="icon"} `magnet detector` detects the presence of a magnet,

### DO modules

-   ![LED](./images/generated/icon_A8.png){:class="icon"} `LED` set a color animation on a programmable LED strip
-   ![servo set angle tile](./images/generated/icon_A21_.png){:class="icon"} `servo` controls the orientation of a servo motor arm. The ![servo set angle tile](./images/generated/icon_A21_.png){:class="icon"} `servo` arm orientation is mapped to the wall clock hours: `0` (or `12`) is on rotated 90 degree from the resting position to the left, `6` is rotated 90 degree right from the rest position.
