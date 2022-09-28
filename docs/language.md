
# MicroCode Language

The MicroCode language is defined in terms of **pages**, where a page has a list of **rules**,
and each rule consists of a **When** section and a **Do** section, each with a list of programming
**tiles**. The picture above shows a 1-page program with two rules:

-   the first rule shows a happy face on the micro:bit screen when the A button is pressed
-   the second rule shows a sad face when the B button is pressed.

![Smiley Button MicroCode program](./images/rule.jpg){:class="screenshot"}

## Pages

Execution of the MicroCode program starts on page 1. All the rules on that page are active.
Rules on another page only become active when the program switches to that page
(via an explicit switch-page action, discussed later).

## Rules and Conflicts

The rules on a page fire in parallel, so if you want to have two different actions take place
on the press of A button, you would have two rules with the same When section (A button is pressed),
but different actions. If the actions of the two rules use the same resource (for example, both actions
show something on the micro:bit screen), then the last rule in order from top to bottom wins. That is,
the order of the rules only matters when different rules act on the same resource.

## When section

## Events


The left-hand side of a rule, the `When` section, starts with an
event tile from the following dialog, which appears when you select the leftmost empty tile of a rule:

![event tiles in when section](./images/whenDialog.jpg){:class="screenshot"}

-   ![press image](./images/generated/icon_S2.png){:class="icon"} `press` of button, micro:bit icon, or pin
-   ![release image](./images/generated/icon_S2B.png){:class="icon"} `release` of button, micro:bit icon, or pin
-   ![move image](./images/generated/icon_S3.png){:class="icon"} `move` of accelerometer, in various ways
-   ![hear image](./images/generated/icon_S8.png){:class="icon"} `hear` a sound, either loud or soft
-   ![radio receive image](./images/generated/icon_S7.png){:class="icon"} `radio receive` of a number
-   ![repeat timer image](./images/generated/icon_S4.png){:class="icon"} `repeat timer` of a time
-   ![variable A image](./images/generated/icon_S9A.png){:class="icon"} ![variable B image](./images/generated/icon_S9B.png){:class="icon"} ![variable C image](./images/generated/icon_S9C.png){:class="icon"} `variable (A,B,C) changed` to a number

## Event parameters

An event tile can be followed by none, one or more parameter tiles which determines whether or not execution will proceed from the **When** section to the **Do** section, Every event has a default parameter, which is used when no parameter is specified. The defaults are:

-   `press`, defaults to `button A` ![press image](./images/generated/icon_F3.png){:class="icon"}; 
other options include `button B` ![press image](./images/generated/icon_F4.png){:class="icon"}, 
`micro:bit logo` ![press image](./images/generated/icon_F7.png){:class="icon"}, 
`pin 0` ![press image](./images/generated/icon_F0.png){:class="icon"}, 
`pin 1` ![press image](./images/generated/icon_F1.png){:class="icon"}, `pin 2` ![press image](./images/generated/icon_F2.png){:class="icon"}
-   `release`, defaults and options are the same as for **press**

The dialog below shows the parameters associated with the button press/release events.

![parameters for press/release event](./images/eventParameterDialog.jpg){:class="screenshot"}

-   `move`, defaults to `shake` ![press image](./images/generated/icon_F17_shake.png){:class="icon"}; other options include ...
-   **hear**, defaults to `loud`; other options include `tilt up`, `tilt down`, `tilt left` and `tilt right`
-   **radio receive**, defaults to `any`
-   **repeat timer**, defaults to `1/4 second`
-   **variable (A,B,C) changed**, defaults to `any`

The events that are parameterized by a numeric value (the last three events above) can take more than one parameters that are summed together. This allows values great than 5 to be constructed.

## Do section

### Commands

The right-hand side of a rule, the **Do** section, starts with an
command tile from the following list:

-   **screen** shows an animation sequence on the LED screen.
-   **sound emoji** plays a given emoji
-   **radio send** sends a given number over the radio
-   **switch page** transfers execution control to a given page
-   **set variable** puts a number into a variable (A, B, C)

A command can be followed by various parameter tiles, depending on the type
of command. As with events, every command has a default parameter, for the
case where no parameter tile is given:

-   **screen** shows a `happy face` by default
-   **sound emoji** plays `giggle` by default
-   **radio send** sends the number `1` by default
-   **switch page** switches to page `1` by default
-   **set variable** puts a number into a variable (A, B, C)

Sequences of numeric parameters are summed, as before, allowing the construction of values greater than `5`.

![command tiles in do section](./images/doDialog.jpg){:class="screenshot"}

## Constructing numbers

For commands that expect a numeric value (**radio send**, **set variable**), a variety of tiles are available

-   the **constant values** 1, 2, 3, 4, and 5 (maybe we'll add 0 soon)
-   the **values of variables** A, B, and C
-   a **random number generator** yields a random integer between `1` and `5` (inclusive) by default

## Coming soon

-   Create negative numbers with minus operator
