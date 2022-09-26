![Smiley Button MicroCode program](./images/rule.jpg)

# MicroCode Language

The MicroCode language is defined in terms of pages, where a page has a list of rules,
and each rule consists of a **When** section and a **Do** section, each with a list of programming
**tiles**.

The picture above shows a 1-page program with two rules:

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

The left-hand side of a rule, the **When** section refers to an
event from following list:

-   **press** of a button, micro:bit icon, or pin
-   **release** of button, micro:bit icon, or pin
-   **move** of accelometer, in various ways
-   **hear** a sound, either loud or soft
-   **radio receive** of a number
-   **repeat timer** of a time
-   **variable (A,B,C) changed** to a number

Each event can be followed by none, one or more parameters, which determines whether or not execution will proceed from the **When** section to the **Do** section, Every event has a default parameter, which is used when no parameter is specified. The defaults are:

-   **press**, defaults to `button A`
-   **release**, defaults to `button A`
-   **move**, defaults to `shake`
-   **hear**, defaults to `loud`
-   **radio receive**, defaults to `equals 1`
-   **repeat timer**, defaults to `1/4 second'
-   **variable (A,B,C) changed**, defaults to `equals 1`

The events that are parameterized by a numeric (the last three) can take more than one parameters. The meaning of this sequence
of numbers is their sum. This allows values great than 5 to be constructed.

## Do section

TBD
