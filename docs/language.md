![Smiley Button MicroCode program](./images/rule.jpg)

# MicroCode Language

The MicroCode language is defined in terms of pages, where a page has a list of rules,
and each rule consists of a **When** section and a **Do** section, each with a list of programming
**tiles**. The picture above shows a 1-page program with two rules:

-   the first rule shows a happy face on the micro:bit screen when the A button is pressed
-   the second rule shows a sad face when the B button is pressed.

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

The left-hand side of a rule, the **When** section, starts with an
event tile from the following list:

-   **press** of a button, micro:bit icon, or pin
-   **release** of button, micro:bit icon, or pin
-   **move** of accelerometer, in various ways
-   **hear** a sound, either loud or soft
-   **radio receive** of a number
-   **repeat timer** of a time
-   **variable (A,B,C) changed** to a number

An event tile can be followed by none, one or more parameter tiles which determines whether or not execution will proceed from the **When** section to the **Do** section, Every event has a default parameter, which is used when no parameter is specified. The defaults are:

-   **press**, defaults to `button A`
-   **release**, defaults to `button A`
-   **move**, defaults to `shake`
-   **hear**, defaults to `loud`
-   **radio receive**, defaults to `any`
-   **repeat timer**, defaults to `1/4 second`
-   **variable (A,B,C) changed**, defaults to `any`

The events that are parameterized by a numeric (the last three) can take more than one parameters. The meaning of this sequence
of numbers is their sum. This allows values great than 5 to be constructed.

## Do section

The right-hand side of a rule, the **Do** section, starts with an
action tile from the following list:

-   **screen** shows an animation sequence on the LED screen.
-   **sound emoji** plays a given emoji
-   **random number** generates a random integer between 1 and given upper bound (inclusive)
-   **radio send** sends a given number over the radio
-   **switch page** transfers execution control to a given page

An action tile can be followed by various parameter tiles, depending on type
of action tile. As with events, every actions has a default parameter, for the
case where no parameter file is added by the user:

-   **screen** shows a `happy face` by default
-   **sound emoji** plays `giggle` by default
-   **random number** generates a random integer between `1` and `5` (inclusive) by default
-   **radio send** sends the number `1` by default
-   **switch page** switches to page `1` by default

Sequences of numeric parameters are summed, as before, allowing the construction of values greater than `5`.

## Variables

For certain actions that produce values, like the random number generator, the value can be written into variable `A`, `B`, `C`.
