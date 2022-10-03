# Samples

[![new program](./images/generated/icon_new_program.png){:class="icon-sample"}](#first-program) [![Flashing Heart icon](./images/generated/icon_sample_flashing_heart.png){:class="icon-sample"}](#flashing-heart) [![Smiley Buttons icon](./images/generated/icon_sample_smiley_buttons.png){:class="icon-sample"}](#smiley-buttons) [![Pet hamster icon](./images/generated/icon_sample_pet_hamster.png){:class="icon-sample"}](#pet-hamster) [![Rock Paper Scissors icon](./images/generated/icon_sample_rock_paper_scissors.png){:class="icon-sample"}](#rock-paper-scissors) [![Hot potato icon](./images/generated/icon_hot_potato.png){:class="icon-sample"}](#hot-potato) [![Clap lights icon](./images/generated/icon_sample_clap_lights.png){:class="icon-sample"}](#clap-lights) [![Chuck a duck icon](./images/generated/icon_sample_chuck_a_duck.png){:class="icon-sample"}](#chuck-a-duck) [![Firefly icon](./images/generated/icon_sample_firefly.png){:class="icon-sample"}](#firefly) [![railroad crossing](./images/generated/icon_railroad_crossing.png){:class="icon-sample"}](#railroad-crossing)
## Single player

### ![new program](./images/generated/icon_new_program.png){:class="icon-sample"} First program {#first-program}

![First MicroCode program](./images/generated/sample_first_program.png){:class="sample"}

When you select **new program** and keep pressing **A**
in the editor after selecting the new program sample.

The program has one rule that paints a smiley when button A (on the micro:bit) is pressed.

![when button A press, show smiley rule](./images/generated/sample_first_program_page_1_rule_1.png){:class="rule"}

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![button A](./images/generated/icon_F3.png){:class="icon"} button A, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with smiley.

#### improvement ideas

-   keep adding images to create an animation
-   checkout the [smiley buttons](#smiley-buttons) sample to see how to handle button B.

## ![Flashing Heart icon](./images/generated/icon_sample_flashing_heart.png){:class="icon-sample"} Flashing Heart {#flashing-heart}

![Flashing Heart MicroCode program](./images/generated/sample_flashing_heart.png){:class="sample"}

The goal of this program is to show a cute heart animation.

We use a single rule with a ![timer](./images/generated/icon_S4.png){:class="icon"} timer. The timer starts a ![screen](./images/generated/icon_A5.png){:class="icon"} screen animation
with two images. Each time the timer triggers again, it repaints both images which create the heart animation.

![flashing heart rule 1](./images/generated/sample_flashing_heart_page_1_rule_1.png){:class="rule"}

-   **when** ![timer](./images/generated/icon_S4.png){:class="icon"} timer triggers, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with heart.

#### improvement ideas

-   add more animation frames to create a better beating heart
-   make your own animation

### ![Smiley Buttons icon](./images/generated/icon_sample_smiley_buttons.png){:class="icon-sample"} Smiley Buttons {#smiley-buttons}

![Smiley Buttons MicroCode program](./images/generated/sample_smiley_buttons.png){:class="sample"}

The goal of this program is to show a smiley
when pressing A, and a frowney when
pressing B.

![when button A pressed, paint screen with smiley](./images/generated/sample_smiley_buttons_page_1_rule_1.png){:class="rule"}

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![button A](./images/generated/icon_F3.png){:class="icon"} button A, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with smiley.

![when button B pressed, paint screen with frowney](./images/generated/sample_smiley_buttons_page_1_rule_2.png){:class="rule"}

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![button B](./images/generated/icon_F4.png){:class="icon"} button B, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with frowney.

#### improvement ideas

-   add sound emoji for each buttons to make it more lively

### ![Pet hamster icon](./images/generated/icon_sample_pet_hamster.png){:class="icon-sample"} Pet Hamster {#pet-hamster}

![Pet Hamster MicroCode program](./images/generated/sample_pet_hamster.png){:class="sample"}

Keep your micro:pet happy by petting
its head (Logo) and don't shake it, it does not like that.

![when page started, paint screen neutral](./images/generated/sample_pet_hamster_page_1_rule_1.png){:class="rule"}

-   **when** page started, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with neutral mood

Touching the micro:bit logo makes it happy.

![when touch logo, print happy on screen](./images/generated/sample_pet_hamster_page_1_rule_2.png){:class="rule"}

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![logo](./images/generated/icon_F7.png){:class="icon"} micro:bit logo, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with happy animation.

![when touch logo, play giggle sound](./images/generated/sample_pet_hamster_page_1_rule_3.png){:class="rule"}

-   **when** ![press](./images/generated/icon_S2.png){:class="icon"} press ![logo](./images/generated/icon_F7.png){:class="icon"} micro:bit logo, **do** ![speaker](./images/generated/icon_A2.png){:class="icon"} play sound emoji ![emoji giggle](./images/generated/icon_M19giggle.png){:class="icon"} giggle.

Shaking makes it unhappy.

![when touch logo, print frowney on screen](./images/generated/sample_pet_hamster_page_1_rule_4.png){:class="rule"}

-   **when** ![accelerometer](./images/generated/icon_S3.png){:class="icon"} ![shake](./images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with unhappy animation.

![when touch logo, play sad sound](./images/generated/sample_pet_hamster_page_1_rule_5.png){:class="rule"}

-   **when** ![accelerometer](./images/generated/icon_S3.png){:class="icon"} ![shake](./images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![speaker](./images/generated/icon_A2.png){:class="icon"} play sound emoji ![emoji sad](./images/generated/icon_M19sad.png){:class="icon"} sad.

#### improvement ideas

-   use more rules to manipulate the mood of your pet

### ![Rock Paper Scissors icon](./images/generated/icon_sample_rock_paper_scissors.png){:class="icon-sample"} Rock Paper Scissors {#rock-paper-scissors}

![Rock Paper Scissors MicroCode program](./images/generated/sample_rock_paper_scissors.png){:class="sample"}

The classic game of rock paper scissors
where the micro:bit display a different
symbol when shaken.

The program starts with a rule that uses
a shake event and 3-face dice is cast. The result is stored in variable `X`.

![when shake, set variable X to random number up to 3](./images/generated/sample_rock_paper_scissors_page_1_rule_1.png){:class="rule"}

-   **when** ![accelerometer](./images/generated/icon_S3.png){:class="icon"} ![shake](./images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![set variable X](./images/generated/icon_A9A.png){:class="icon"} set variable X to ![dice](./images/generated/icon_M22.png){:class="icon"} random number between 1 and ![value 3](./images/generated/icon_M8.png){:class="icon"} 3.

The next 3 rules match the value passed in variable `X`
and display a different symbol for each value, 1, 2 or 3.

![when variable X changed to 1, paint rock](./images/generated/sample_rock_paper_scissors_page_1_rule_2.png){:class="rule"}

-   **when** ![variable X changed](./images/generated/icon_S9A.png){:class="icon"} variable `X` changes to ![value 1](./images/generated/icon_M6.png){:class="icon"} 1, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with paper.

![when variable X changed to 2, paint paper](./images/generated/sample_rock_paper_scissors_page_1_rule_3.png){:class="rule"}

-   **when** ![variable X changed](./images/generated/icon_S9A.png){:class="icon"} variable `X` changes to ![value 2](./images/generated/icon_M7.png){:class="icon"} 2, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with rock.

![when variable X changed to 3, paint scissors](./images/generated/sample_rock_paper_scissors_page_1_rule_4.png){:class="rule"}

-   **when** ![variable X changed](./images/generated/icon_S9A.png){:class="icon"} variable `X` changes to ![value 3](./images/generated/icon_M8.png){:class="icon"} 3, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with scissors.

#### improvement ideas

-   add sound emoji whenever shake happens
-   clear the screen before showing the new symbol

### ![Hot potato icon](./images/generated/icon_hot_potato.png){:class="icon-sample"} Hot potato {#hot-potato}

![Hot potato MicroCode program](./images/generated/sample_hot_potato.png){:class="sample"}

Pass the hot potato around and make
sure it does not beep while you have it
in your hands!

#### ![page 1](./images/generated/icon_M1.png){:class="icon"} page 1

![hot potato page 1](./images/generated/sample_hot_potato_page_1.png){:class="sample"}

The first page of the program is a random timer of 5 to 6 seconds.
Once the timer triggers, the first rule ![switch page](./images/generated/icon_A1.png){:class="icon"} switches to ![page 2](./images/generated/icon_M2.png){:class="icon"} page 2.

![when timer 5 seconds plus 1 random second, do switch to page 2](./images/generated/sample_hot_potato_page_1_rule_1.png){:class="rule"}

- **when** ![timer](./images/generated/icon_S4.png){:class="icon"} time
of ![5 seconds](./images/generated/icon_F19.png){:class="icon"} 5s
and ![1 random second](./images/generated/icon_F18.png){:class="icon"} 1
random second, **do**  ![switch page](./images/generated/icon_A1.png){:class="icon"} switches to ![page 2](./images/generated/icon_M2.png){:class="icon"} page 2.


#### ![page 2](./images/generated/icon_M2.png) page 2

![hot potato page 2](./images/generated/sample_hot_potato_page_2.png){:class="sample"}

On this page, we should a skull image and play a sad sound on start.
If the **when** section is empty, the rule runs once at the page start only.

![when page starts, do paint a skull](./images/generated/sample_hot_potato_page_2_rule_1.png){:class="rule"}

- **when** page starts, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with skull.

![when page starts, do play sad sound](./images/generated/sample_hot_potato_page_2_rule_2.png){:class="rule"}

- **when** page starts, **do** ![speaker](./images/generated/icon_A2.png){:class="icon"} play sound emoji ![emoji sad](./images/generated/icon_M19sad.png){:class="icon"} sad.

#### improvement ideas

-   add sound emoji when timer expires
-   add a better expired potato animation

### ![Clap lights icon](./images/generated/icon_sample_clap_lights.png){:class="icon-sample"} Clap Lights {#clap-lights}

![Clap lights MicroCode program](./images/generated/sample_clap_lights.png){:class="sample"}

Allows to turn on and off the LEDs of the screen.

#### ![page 1](./images/generated/icon_M1.png){:class="icon"} page 1

![clap lights page 1](./images/generated/sample_clap_lights_page_1.png){:class="sample"}

When the page starts, turn on all LEDs.
When a loud sound is detected switch between to page 2

![when page starts, do paint all leds](./images/generated/sample_clap_lights_page_1_rule_1.png){:class="rule"}

- **when** page starts, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} paint screen with all leds.

![when loud sond, do switch to page 2](./images/generated/sample_clap_lights_page_1_rule_2.png){:class="rule"}

- **when** ![microphone](./images/generated/icon_S8.png){:class="icon"} microphone detects ![loud](./images/generated/icon_F15.png){:class="icon"} loud sound, **do** ![switch page](./images/generated/icon_A1.png){:class="icon"} switch page to ![page 2](./images/generated/icon_M2.png) page 2.

#### ![page 2](./images/generated/icon_M2.png){:class="icon"}  page 2

![clap lights page 2](./images/generated/sample_clap_lights_page_2.png){:class="sample"}

Similar to page 1 but in this case, we turn off all the LEDs.

![when page starts, do turn off all LEDs](./images/generated/sample_clap_lights_page_2_rule_1.png){:class="rule"}

- **when** page starts, **do** ![screen](./images/generated/icon_A5.png){:class="icon"} turn off all LEDs

![when loud sond, do switch to page 2](./images/generated/sample_clap_lights_page_2_rule_2.png){:class="rule"}

- **when** ![microphone](./images/generated/icon_S8.png){:class="icon"} microphone detects ![loud](./images/generated/icon_F15.png){:class="icon"} loud sound, **do** ![switch page](./images/generated/icon_A1.png){:class="icon"} switch page to ![page 2](./images/generated/icon_M1.png) page 1.

#### improvement ideas

-   add sounds to notify your user that the command was received

## Multi player

These sample use the radio and will only work if you have multiple micro:bit talking to each other!

### ![Chuck a duck icon](./images/generated/icon_sample_chuck_a_duck.png){:class="icon-sample"} Chuck a duck {#chuck-a-duck}

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

### ![Firefly icon](./images/generated/icon_sample_firefly.png){:class="icon-sample"} Firefly {#firefly}

![firefly MicroCode program](./images/generated/sample_firefly.png){:class="sample"}

Fireflies in the wild synchronize their glowing although there is no leader to give the tempo.
Go to [http://ncase.me/fireflies/](http://ncase.me/fireflies/) and read about the fireflies synchronization phenomenon.

Just like fireflies in the wild, you can create program that synchronize blinking
between any number of micro:bit! The firefly program uses two pages, page 1 will run when the light is off
and page 2 will handle a glow.

### page 1

![firefly page 1](./images/generated/sample_firefly_page_1.png){:class="sample"}

In ![page 1](./images/generated/icon_M1.png){:class="icon"} page 1, we add a rule that clears the screen and keeps a dot ![screen](./images/generated/icon_A5.png){:class="icon"} when the page starts.

![firefly page 1 rule 1](./images/generated/sample_firefly_page_1_rule_1.png){:class="rule"}

The clock of the firefly will be held in ![get variable X](./images/generated/icon_M20A.png){:class="icon"} variable `X`. It starts at ![value 1](./images/generated/icon_M6.png){:class="icon"} 1 and once it reaches 8, the firefly will glow. The next two rules are about moving the clock forward. The ![timer](./images/generated/icon_S4.png){:class="icon"} `repeat timer` rule moves the clock every ![quarter of a second](./images/generated/icon_F13.png){:class="icon"} quarter of a second; the ![radio receive](./images/generated/icon_S7.png){:class="icon"} `radio receive` moves the clock by 1 whenever a neighboring firefly sent a message.

The next rule, ![variable X changed](./images/generated/icon_S9A.png){:class="icon"} **when** variable `X` changed to 8, transitions to ![page 2](./images/generated/icon_M2.png){:class="icon"} page 2 when the clock reaches `8`.
Since it is possible that we miss the number `8` because the firefly received many radio updates at once,
we add one last rule, a `repeat timer every 3s` that transitions to page 2.

#### page 2

![firefly page 1](./images/generated/sample_firefly_page_1.png){:class="sample"}

On ![page 2](./images/generated/icon_M2.png) page 2, the variable `X` is ![set variable X](./images/generated/icon_A9A.png){:class="icon"} set to ![value 1](./images/generated/icon_M6.png){:class="icon"} 1, a radio message is sent to other firefly so that they can nudge their clock (![radio send](./images/generated/icon_A6.png){:class="icon"}), all the LEDs are turned and a sound is played.
After half a second, we transition back to page 1 to restart the non-glow phase.

#### improvement ideas

-   use a radio group to avoid interference with other users
-   remix this technique with other programs to create new synchronized experiences!

## Accessories

The samples in this section using [Jacdac](https://aka.ms/jacdac) modules to extend the micro:bit with programmable LEDs, servo and other sensors/actuators.

### ![railroad crossing](./images/generated/icon_railroad_crossing.png){:class="icon-sample"} Railroad crossing {#railroad-crossing}

![Railroad crossing MicroCode program](./images/generated/sample_railroad_crossing.png){:class="sample"}

This program controls a railroad crossing.

The ![servo set angle tile](./images/generated/icon_A21_.png){:class="icon"} `servo` uses a [servo motor](https://microsoft.github.io/jacdac-docs/services/servo/) move to move an physical arm. The ![servo set angle tile](./images/generated/icon_A21_.png){:class="icon"} `servo` arm orientation is mapped to the wall clock hours: `0` (or `12`) is on rotated 90 degree from the resting position to the left, `6` is rotated 90 degree right from the rest position.

The ![LED](./images/generated/icon_A8.png){:class="icon"} `LED` uses a [programmable LED ring](https://microsoft.github.io/jacdac-docs/services/led/) module to display blue and red colors.
