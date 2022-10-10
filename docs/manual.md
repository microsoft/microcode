---
image: ./docs/images/generated/sample_smiley_buttons.png
---

# [Microsoft MicroCode](https://aka.ms/m9) for micro:bit (beta)

Physical computing for young coders on the [micro:bit V2](https://microbit.org).

> MicroCode is still in **beta** development and might change in the future.

-   Kid-friendly icon-based, live, structured code editor and [programming language](./language)

<video class="sample" poster="./videos/smiley-buttons.png" src="./videos/smiley-buttons.mp4" controls="true"></video>

-   Live, the code is downloaded to the micro:bit on every edit
-   Cursor based navigation with keyboard (switch access compatible), mouse, touch, screen reader support
-   Accessories (LEDs, servos, ...) supported via [Jacdac](https://aka.ms/jacdac)

## [Web editor](https://aka.ms/m9) {#web}

The MicroCode web editor is at [aka.ms/m9](https://aka.ms/m9). We recommend using the keyboard navigation.

-   Arrow keys for D-pad
-   `Enter` or `Space` for `A` button
-   `Backspace` for `B` button
-   `]` or `Page Up` to go to the next page, `[` or `Page Down` to go to the previous page
-   Copy the URL to share your program.

[![MicroCode web app](./images/website2.jpg){:class="screenshot"}](https://aka.ms/m9)

### Automatic download to micro:bit V2

Click on the micro:bit button at the lower right of the web app (see above) and follow the on-screen instructions to configure your micro:bit V2 and pair it with the editor.
Once your micro:bit V2 is paired, the web editor will be able to download your
MicroCode program to your micro:bit. This happens on every edit, so your program
is always up-to-date (and running)!

If you micro:bit disconnect, you will see a micro:bit icon show up on the upper left corner of the editor. Click on that button to reconnect again

### Accessibility

We want to make the editor as accessible as possible; please send us suggestions to improve its accessibility.

#### Keyboard navigation

MicroCode can be accessed with the keyboard:

-   Arrow keys to move cursor
-   `Enter` or `Space` for `A` button
-   `Backspace` for `B` button
-   Keep moving the cursor `Up` to go back a screen, if `Backspace` is not available;
    for example, if you are using a 5-input switch panel.
-   Keep moving `Right` or `Left` to wrap around the user interface; for example, if you are using a 2-input switch panel.

#### Gamepads

MicroCode supports commercial gamepads compatible with [Web Gamepad](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad).

#### Screen reader

The editor integrates with existing screen readers, like NVDA.

#### Tooltip read aloud

By clicking on the `tooltip reader` button at the bottom of the editor, the tooltips will be read aloud. This may be useful for students who are still learning to read.

## [Sample programs](./samples)

The MicroCode app has a set of [samples](./samples) built-in. Select the samples button on the MicroCode home page (see below) to reveal
the gallery of samples.

[![new program](./images/generated/icon_new_program.png){:class="icon-sample"}](./samples/first-program) [![Flashing Heart icon](./images/generated/icon_sample_flashing_heart.png){:class="icon-sample"}](./samples/flashing-heart) [![Smiley Buttons icon](./images/generated/icon_sample_smiley_buttons.png){:class="icon-sample"}](./samples/smiley-buttons) [![Pet hamster icon](./images/generated/icon_sample_pet_hamster.png){:class="icon-sample"}](./samples/pet-hamster) [![Head or tails icon](./images/generated/icon_sample_head_or_tail.png){:class="icon-sample"}](./samples/head-or-tail) [![Rock Paper Scissors icon](./images/generated/icon_sample_rock_paper_scissors.png){:class="icon-sample"}](./samples/rock-paper-scissors) [![Hot potato icon](./images/generated/icon_hot_potato.png){:class="icon-sample"}](./samples/hot-potato) [![Clap lights icon](./images/generated/icon_sample_clap_lights.png){:class="icon-sample"}](./samples/clap-lights) [![reaction time](./images/generated/icon_reaction_time.png){:class="icon-sample"}](./samples/reaction-time)
[![Chuck a duck icon](./images/generated/icon_sample_chuck_a_duck.png){:class="icon-sample"}](./samples/chuck-a-duck) [![Firefly icon](./images/generated/icon_sample_firefly.png){:class="icon-sample"}](./samples/firefly) [![railroad crossing](./images/generated/icon_railroad_crossing.png){:class="icon-sample"}](./samples/railroad-crossing)

![MicroCode sample programs](./images/microCodeVideo.gif){:class="screenshot"}

## micro:bit V2 and Arcade Shield

> This functionality is experimental.

Click on the version number in the web app to download the MicroCode hex file to your micro:bit V2. When you plug the micro:bit into the Arcade Shield, MicroCode should start running. Your MicroCode program is always live and runnable. Once you remove the micro:bit from the shield, the program will persist and continue to run.

### [micro:bit V2](https://microbit.org) + [Arcade Shield](https://www.kittenbot.cc/products/newbit-arcade-shield)

![Arcade Shield and micro:bit V2](./images/meow1.jpg){:class="fluid"}

{% include youtube.html id="ymP7x8GXgz4" %}

{% include youtube.html id="LWjJL9qegmM" %}

## Acknoledgments

-   [@loretod101](https://twitter.com/loretod101) on advising on accessibility features, including switch access support.
-   [@BillSeiver](https://twitter.com/BillSiever) on feedback for tiles, including the `page start` tile
-   Microsoft Garage for kick starting this project during the 2022 Microsoft Hackathon.

## Contributing

-   Post your suggestions or questions at https://forum.makecode.com

This project is open source and welcomes contributions and suggestions at https://github.com/microsoft/microcode.
Read the [developer instructions](./develop.md).
