# MicroCode Language

The MicroCode language is defined in terms of **pages**, where a page has a list of **rules**,
and each rule consists of a **When** section and a **Do** section, each with a list of programming
**tiles**.

MicroCode supports events, conditions on the events, sequencing,
loops, and variables.

The picture below shows a 1-page program with two rules.

![Smiley Button MicroCode program](./images/rule.jpg){:class="screenshot"}

The first rule shows a happy face on the micro:bit screen when the button A is pressed.

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![button A](./images/generated/icon_F3.png){:class="icon"} button A, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with smiley.

The second rule shows a sad face when the button B is pressed.

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![button B](./images/generated/icon_F4.png){:class="icon"} button B, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with frowney.

## Pages {#pages}

Execution of the MicroCode program starts on ![page 1](./images/generated/icon_M1.png){:class="icon"} page 1. All the rules on that page are active.
Rules on another page only become active when the program switches to that page
(via an explicit ![switch page](./images/generated/icon_A1.png){:class="icon"} switch-page action, discussed later).

![Hot potato sample](./images/generated/sample_hot_potato.png){:class="screenshot"}

## Rules and conflicts {#rules}

The rules on a page fire in parallel, so if you want to have two different actions take place
on the press of A button, you would have two rules with the same When section (A button is pressed),
but different actions. If the actions of the two rules use the same resource (for example, both actions
show something on the micro:bit screen), then the last rule in order from top to bottom wins. That is,
the order of the rules only matters when different rules act on the same resource.

## WHEN section {#when}

The left-hand side of a rule, the `When` section, starts with an
**event** tile from the following dialog, which appears when you select the leftmost empty tile of a rule:

![event tiles in when section](./images/whenDialog.jpg){:class="screenshot"}

-   ![press image](./images/generated/icon_S2.png){:class="icon"} `press` of button, micro:bit icon, or pin
-   ![release image](./images/generated/icon_S2B.png){:class="icon"} `release` of button, micro:bit icon, or pin
-   ![move image](./images/generated/icon_S3.png){:class="icon"} `move` of accelerometer, in various ways
-   ![hear image](./images/generated/icon_S8.png){:class="icon"} `hear` a sound, either loud or soft
-   ![radio receive image](./images/generated/icon_S7.png){:class="icon"} `radio receive` of a number
-   ![repeat timer image](./images/generated/icon_S4.png){:class="icon"} `repeat timer` of a time
-   ![variable A image](./images/generated/icon_S9A.png){:class="icon"} ![variable B image](./images/generated/icon_S9B.png){:class="icon"} ![variable C image](./images/generated/icon_S9C.png){:class="icon"} `variable (A,B,C) changed` to a number

If the `when` section is left section,
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
-   ![timer](./images/generated/icon_S4.png){:class="icon"} `repeat timer`, defaults to `1/4 second`
-   ![variable A image](./images/generated/icon_S9A.png){:class="icon"} `variable (A,B,C) changed`, defaults to `any` (any value change triggers it)

### Conditions on event values

When an event carries a numberic value (in the case of receiving a radio message or a variable being updated), if that value is equal to the sum of coins, then execution will proceed to the DO section. Here are the five available coins:

-   `1` ![coin of value 1](./images/generated/icon_F8.png){:class="icon"}
-   `2`: ![coin of value 2](./images/generated/icon_F9.png){:class="icon"}
-   `3`: ![coin of value 3](./images/generated/icon_F10.png){:class="icon"}
-   `5`: ![coin of value 5](./images/generated/icon_F11.png){:class="icon"}
-   `10`: ![coin of value 10](./images/generated/icon_F12.png){:class="icon"}

The repeat timer is parameterized with various times that can also be sequenced and summed:

-   `1/4 second`: ![1/4 second](./images/generated/icon_F13.png){:class="icon"}
-   `1 second`: ![1 second](./images/generated/icon_F14.png){:class="icon"}
-   `5 seconds`: ![5 seconds](./images/generated/icon_F19.png){:class="icon"}
-   `? seconds`: ![0 to 1 second, chosen randomly](./images/generated/icon_F18.png){:class="icon"} - 0 to 1 second, chosen randomly

In the case of the timer, the sum specifies the amount of time to start the timer with.

## DO section {#do}

The right-hand side of a rule, the **Do** section, starts with an
**command** tile from the following list:

-   ![screen](./images/generated/icon_A5.png){:class="icon"} `screen` shows an animation sequence on the LED screen.
-   ![speaker](./images/generated/icon_A2.png){:class="icon"} `sound emoji` plays a given emoji
-   ![radio send](./images/generated/icon_A6.png){:class="icon"} `radio send` sends a given number over the radio
-   ![switch page](./images/generated/icon_A1.png){:class="icon"} `switch page` transfers execution control to a given page
-   ![in variable A](./images/generated/icon_M20A.png){:class="icon"} `set variable` puts a number into a variable (A, B, C)

A command can be followed by various parameter tiles, depending on the type
of command. As with events, every command has a default parameter, for the
case where no parameter tile is given:

-   ![screen](./images/generated/icon_A5.png){:class="icon"} `screen` shows a `happy face` by default
-   ![speaker](./images/generated/icon_A2.png){:class="icon"} `sound emoji` plays ![emoji giggle](./images/generated/icon_M19giggle.png){:class="icon"} `giggle` by default
-   ![radio send](./images/generated/icon_A6.png){:class="icon"} `radio send` sends the number `1` by default
-   ![switch page](./images/generated/icon_A1.png){:class="icon"} `switch page` switches to page `1` by default
-   ![in variable A](./images/generated/icon_M20A.png){:class="icon"} `set variable` puts a number into a variable (A, B, C)

Sequences of numeric parameters are summed, as before, allowing the construction of values greater than `5`.

![command tiles in do section](./images/doDialog.jpg){:class="screenshot"}

### Constructing numbers

For commands that expect a numeric value (![radio send](./images/generated/icon_A6.png){:class="icon"} `radio send`, ![in variable A](./images/generated/icon_M20A.png){:class="icon"} `set variable`), a variety of tiles are available

-   the **constant values** ![value 1](./images/generated/icon_M6.png){:class="icon"} 1, 2, 3, 5, and 10 (maybe we'll add 0 soon)
-   the **values of variables** ![out of variable A](./images/generated/icon_S9A.png){:class="icon"} A, B, and C
-   a ![dice](./images/generated/icon_M22.png){:class="icon"} **random number generator** yields a random integer between `1` and `5` (inclusive) by default

## Jacdac Modules {#jacdac}

MicroCode will detect [Jacdac](https://aka.ms/jacdac) module and automatically display tiles for some of them.

### WHEN modules

-   ![magnet detector](./images/generated/icon_S10.png){:class="icon"} `magnet detector` detects the presence of a magnet,

### DO modules

-   ![LED](./images/generated/icon_A8.png){:class="icon"} `LED` set a color animation on a programmable LED strip
-   ![servo set angle tile](./images/generated/icon_A21_.png){:class="icon"} `servo` controls the orientation of a servo motor arm. The ![servo set angle tile](./images/generated/icon_A21_.png){:class="icon"} `servo` arm orientation is mapped to the wall clock hours: `0` (or `12`) is on rotated 90 degree from the resting position to the left, `6` is rotated 90 degree right from the rest position.
