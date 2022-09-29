# Samples

These are some of the annotated MicroCode
samples.

## ![Flashing Heart icon](./images/generated/icon_sample_flashing_heart.png){:class="icon-sample"} Flashing Heart

![Flashing Heart MicroCode program](./images/generated/sample_flashing_heart.png){:class="sample"}

The goal of this program is to show a cute heart animation.

We use a single rule with a timer. The timer starts a screen animation
with two images. Since this happens in a loop, it creates a cool heart animation.

### improvement ideas

* add more animation frames to create a better beating heart

## ![Smiley Buttons icon](./images/generated/icon_sample_smiley_buttons.png){:class="icon-sample"} Smiley Buttons

![Smiley Buttons MicroCode program](./images/generated/sample_smiley_buttons.png){:class="sample"}

The goal of this program is to show a smiley
when pressing A, and a frowney when
pressing B.

We use 2 rule to handle each buttons. The first rule
handle a button A pressed and prints a smiley the screen. Similarly, the second rule filters on button B
and prints a frowney.

### improvement ideas

* add sound emoji for each buttons to make it more lively

## ![Rock Paper Scissors icon](./images/generated/icon_sample_rock_paper_scissors.png){:class="icon-sample"} Rock Paper Scissors

![Rock Paper Scissors MicroCode program](./images/generated/sample_rock_paper_scissors.png){:class="sample"}

The classic game of rock paper scissors
where the micro:bit display a different
symbol when shaken.

The program starts with a rule that uses
the accelerometer sensor; which by default 
detects shake events. The 3-face dice is cast
and the result is stored in variable A.

The next 3 rules match the value passed in variable A
and display a different symbol for each value, 1, 2 or 3.

### improvement ideas

* add sound emoji whenever shake happens
* clear the screen before showing the new symbol


## ![Chuck a duck icon](./images/generated/icon_sample_chuck_a_duck.png){:class="icon-sample"} Chuck a duck

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

### improvement ideas

* add sound emoji when the duck arrives
* use different radio messages for different images

## ![Hot potato icon](./images/generated/icon_hot_potato.png){:class="icon-sample"} Hot potato

![Hot potato MicroCode program](./images/generated/sample_hot_potato.png){:class="sample"}

Pass the hot potato around and make
sure it does not beep while you have it 
in your hands!

### improvement ideas

* add sound emoji when timer expires
* add a better expired potato animation

## ![Pet hamster icon](./images/generated/icon_sample_pet_hamster.png){:class="icon-sample"} Pet Hamster

![Pet Hamster MicroCode program](./images/generated/sample_pet_hamster.png){:class="sample"}

Keep your micro:pet happy by petting
its head (Logo) and don't shake it, it does not like that.

### improvement ideas

* use more rules to manipulate the mood of your pet


## ![Clap lights icon](./images/generated/icon_sample_clap_lights.png){:class="icon-sample"} Clap Lights

![Clap lights MicroCode program](./images/generated/sample_clap_lights.png){:class="sample"}

Allows to turn on and off the LEDs of the screen. When a loud sound is detected
switch between page 1 and page 2 where the page start by turning on or off the LEDs.

### improvement ideas

* add sounds to notify your user that the command was received