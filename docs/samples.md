# Samples

These are some of the annotated MicroCode
samples.

## Single player

### ![new program](./images/generated/icon_new_program.png){:class="icon-sample"} First program

![First MicroCode program](./images/generated/sample_first_program.png){:class="sample"}

When you select **new program** and keep pressing **A**
in the editor after selecting the new program sample.

The program has one rule that paints a smiley when button A (on the micro:bit) is pressed.

![when button A press, show smiley rule](./images/generated/sample_first_program_page_1_rule_1.png){:class="rule"}

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![button A](./images/generated/icon_F3.png){:class="icon"} button A, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with smiley.

#### improvement ideas

- keep adding images to create an animation
- checkout the [smiley buttons](#smiley-buttons) sample to see how to handle button B.

## ![Flashing Heart icon](./images/generated/icon_sample_flashing_heart.png){:class="icon-sample"} Flashing Heart

![Flashing Heart MicroCode program](./images/generated/sample_flashing_heart.png){:class="sample"}

The goal of this program is to show a cute heart animation.

We use a single rule with a ![timer](./images/generated/icon_S4.png){:class="icon"} timer. The timer starts a ![screen](./images/generated/icon_A5.png){:class="icon"} screen animation
with two images. Each time the timer triggers again, it repaints both images which create the heart animation.

![flashing heart rule 1](./images/generated/sample_flashing_heart_page_1_rule_1.png){:class="rule"}

-  **when** ![timer](./images/generated/icon_S4.png){:class="icon"} timer triggers, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with heart.

#### improvement ideas

-   add more animation frames to create a better beating heart
-   make your own animation

### ![Smiley Buttons icon](./images/generated/icon_sample_smiley_buttons.png){:class="icon-sample"} Smiley Buttons {#smiley-buttons}

![Smiley Buttons MicroCode program](./images/generated/sample_smiley_buttons.png){:class="sample"}

The goal of this program is to show a smiley
when pressing A, and a frowney when
pressing B.

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![button A](./images/generated/icon_F3.png){:class="icon"} button A, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with smiley.
-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![button B](./images/generated/icon_F4.png){:class="icon"} button B, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with frowney.

#### improvement ideas

-   add sound emoji for each buttons to make it more lively

### ![Pet hamster icon](./images/generated/icon_sample_pet_hamster.png){:class="icon-sample"} Pet Hamster

![Pet Hamster MicroCode program](./images/generated/sample_pet_hamster.png){:class="sample"}

Keep your micro:pet happy by petting
its head (Logo) and don't shake it, it does not like that.

- **when** page started, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with neutral mood

Touching the micro:bit logo makes it happy.

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![logo](./images/generated/icon_F7.png){:class="icon"} micro:bit logo, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with happy animation.
-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![logo](./images/generated/icon_F7.png){:class="icon"} micro:bit logo, **do** ![speaker](./images/generated/icon_A2.png){:class="icon"} play sound emoji ![emoji giggle](./images/generated/icon_M19giggle.png){:class="icon"} giggle.

Shaking makes it unhappy.

-   **when** ![accelerometer](./images/generated/icon_S3.png){:class="icon"} ![shake](./images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with unhappy animation.
-   **when** ![accelerometer](./images/generated/icon_S3.png){:class="icon"} ![shake](./images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![speaker](./images/generated/icon_A2.png){:class="icon"} play sound emoji ![emoji sad](./images/generated/icon_M19sad.png){:class="icon"} sad.


#### improvement ideas

-   use more rules to manipulate the mood of your pet

### ![Rock Paper Scissors icon](./images/generated/icon_sample_rock_paper_scissors.png){:class="icon-sample"} Rock Paper Scissors

![Rock Paper Scissors MicroCode program](./images/generated/sample_rock_paper_scissors.png){:class="sample"}

The classic game of rock paper scissors
where the micro:bit display a different
symbol when shaken.

The program starts with a rule that uses
the accelerometer sensor; which by default
detects shake events. The 3-face dice is cast
and the result is stored in variable `X`.

The next 3 rules match the value passed in variable `X`
and display a different symbol for each value, 1, 2 or 3.

#### improvement ideas

-   add sound emoji whenever shake happens
-   clear the screen before showing the new symbol

### ![Hot potato icon](./images/generated/icon_hot_potato.png){:class="icon-sample"} Hot potato

![Hot potato MicroCode program](./images/generated/sample_hot_potato.png){:class="sample"}

Pass the hot potato around and make
sure it does not beep while you have it
in your hands!

#### improvement ideas

-   add sound emoji when timer expires
-   add a better expired potato animation

### ![Clap lights icon](./images/generated/icon_sample_clap_lights.png){:class="icon-sample"} Clap Lights

![Clap lights MicroCode program](./images/generated/sample_clap_lights.png){:class="sample"}

Allows to turn on and off the LEDs of the screen. When a loud sound is detected
switch between page 1 and page 2 where the page start by turning on or off the LEDs.

#### improvement ideas

-   add sounds to notify your user that the command was received

## Multi player

These sample use the radio and will only work if you have multiple micro:bit talking to each other!

### ![Chuck a duck icon](./images/generated/icon_sample_chuck_a_duck.png){:class="icon-sample"} Chuck a duck

![Chuck a duck MicroCode program](./images/generated/sample_chuck_a_duck.png){:class="sample"}

This is a radio program so you'll need 2 micro:bits running to get it to work.

The program "sends" a duck using the radio
by pressing A.

In code, the accelerometer sensor is used
in two rules to clear the screen (duck is gone)
and send a number using the radio.

The third rule uses the radio filter to render
the duck on the screen. This rule executes
when a radio message is received.

#### improvement ideas

-   add sound emoji when the duck arrives
-   use different radio messages for different images

### ![Firefly icon](./images/generated/icon_sample_firefly.png){:class="icon-sample"} Firefly

![firefly MicroCode program](./images/generated/sample_firefly.png){:class="sample"}

Fireflies in the wild synchronize their glowing although there is no leader to give the tempo.
Go to [http://ncase.me/fireflies/](http://ncase.me/fireflies/) and read about the fireflies synchronization phenomenon.

Just like fireflies in the wild, you can create program that synchronize blinking
between any number of micro:bit! The firefly program uses two pages, page 1 will run when the light is off
and page 2 will handle a glow.

In ![page 1](./images/generated/icon_M1.png){:class="icon"} page 1, we add a rule that clears the screen and keeps a dot ![screen](./images/generated/icon_A5.png){:class="icon"} when the page starts.

The clock of the firefly will be held in ![get variable X](./images/generated/icon_M20A.png){:class="icon"} variable `X`. It starts at ![value 1](./images/generated/icon_M6.png){:class="icon"} 1 and once it reaches 8, the firefly will glow. The next two rules are about moving the clock forward. The ![timer](./images/generated/icon_S4.png){:class="icon"} `repeat timer` rule moves the clock every ![quarter of a second](./images/generated/icon_F13.png){:class="icon"} quarter of a second; the ![radio receive](./images/generated/icon_S7.png){:class="icon"} `radio receive` moves the clock by 1 whenever a neighboring firefly sent a message.

The next rule, ![variable X changed](./images/generated/icon_S9A.png){:class="icon"} **when** variable `X` changed to 8, transitions to ![page 2](./images/generated/icon_M2.png){:class="icon"} page 2 when the clock reaches `8`.
Since it is possible that we miss the number `8` because the firefly received many radio updates at once,
we add one last rule, a `repeat timer every 3s` that transitions to page 2.

On ![page 2](./images/generated/icon_M2.png) page 2, the variable `X` is ![set variable X](./images/generated/icon_A9A.png){:class="icon"} set to ![value 1](./images/generated/icon_M6.png){:class="icon"} 1, a radio message is sent to other firefly so that they can nudge their clock (![radio send](./images/generated/icon_A6.png){:class="icon"}), all the LEDs are turned and a sound is played.
After half a second, we transition back to page 1 to restart the non-glow phase.

#### improvement ideas

-   use a radio group to avoid interference with other users
-   remix this technique with other programs to create new synchronized experiences!

## Accessories

The samples in this section using [Jacdac](https://aka.ms/jacdac) modules to extend the micro:bit with programmable LEDs, servo and other sensors/actuators.

### ![railroad crossing](./images/generated/icon_railroad_crossing.png){:class="icon-sample"} Railroad crossing {#railroad_crossing}

![Railroad crossing MicroCode program](./images/generated/sample_railroad_crossing.png){:class="sample"}

This program controls a railroad crossing.

The ![servo set angle tile](./images/generated/icon_A21_.png){:class="icon"} `servo` uses a [servo motor](https://microsoft.github.io/jacdac-docs/services/servo/) move to move an physical arm. The ![servo set angle tile](./images/generated/icon_A21_.png){:class="icon"} `servo` arm orientation is mapped to the wall clock hours: `0` (or `12`) is on rotated 90 degree from the resting position to the left, `6` is rotated 90 degree right from the rest position.

The ![LED](./images/generated/icon_A8.png){:class="icon"} `LED` uses a [programmable LED ring](https://microsoft.github.io/jacdac-docs/services/led/) module to display blue and red colors.
