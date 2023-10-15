# Robot

Microcode supports programming a separate micro:bit robot equipped with two motors,
sonar and line sensors.

![robot line following](./images/generated/sample_robot_line_follow.png.png){:class="sample"}

## Preparing the robot micro:bit

You will need one of the following micro:bit robot and an extra micro:bit (v1 or v2) to run on the robot. (Contact us if your robot is not listed)

### Hardware requirements

The firmware is designed for popular rover robots found in the micro:bit ecosystem
(and more can be added):

-   2 motors that can be forward, backward, left, right turns. Precise detection of distance is **not** needed.
-   a line sensor that can detect black and white lines
-   a distance sensor, typically an ultrasonic sensor

The following features are found often but are optional:

-   RGB LEDs
-   Buzzer
-   Programmable LED strip

### Elecfreaks Cutebot

[![Photograph of the Cutebot](./images/cutebot.jpeg)](https://www.elecfreaks.com/micro-bit-smart-cutebot.html){:class="sample"}

-   Download [microcode-robot-elecfreakscutebot.hex](https://microsoft.github.io/microcode/assets/microcode-robot-elecfreakscutebot.hex)

### Yahboom Tiny:bit

![Photograph of the Tiny:bit](./images/tinybit.jpeg){:class="sample"}

-   Download [microcode-robot-yahboomtinybit.hex](https://microsoft.github.io/microcode/assets/microcode-robot-yahboomtinybit.hex)

### Elecfreaks Cutebot PRO

[![Photograph of the Cutebot PRO](./images/cutebotpro.jpeg)](https://shop.elecfreaks.com/products/elecfreaks-smart-cutebot-pro-v2-programming-robot-car-for-micro-bit){:class="sample"}

-   Download [microcode-robot-elecfreakscutebotpro.hex](https://microsoft.github.io/microcode/assets/microcode-robot-elecfreakscutebotpro.hex)

## DFRobot Maqueen V2+

![Photograph of the Maqueen](./images/maqueen.jpeg){:class="sample"}

-   [Download](https://microsoft.github.io/microcode/assets/microcode-robot-dfrobotmaqueen.hex)

## Others

-   [KeyStudio KS0426 Mini Smart Robot](https://microsoft.github.io/microcode/assets/microcode-robot-keystudiominismartrobot.hex)

## Configuring the radio group

The microcode editor and the robot micro:bit communicate using the radio. These are the steps to configure the robot and the microcode:

On the robot micro:bit,

-   Reset the robot micro:bit and note the radio group. The group is based on the serial number of the micro:bit and will remain the same; (unfortunately it might also conflict with another micro:bit)
-   If you need to change the group number, press button A or B to select another radio group. You will have to do this every time you reset the robot micro:bit

On the microcode side,

-   Use the ![radio set group](./images/generated/icon_A6A.png){:class="icon"} `radio set group` to configure the same group number as the robot micro:bit

![setting radio group 3 on page start](./images/generated/sample_robot_shake_page_1_rule_1.png){:class="rule"}

## Calibrating motor drift

It is not uncommon for 2 wheeled robot to slightly drift towards one side. To correct this behavior, you can configure a drift parameter on the robot.

On the robot micro:bit,

-   Press A+B to switch to the `DRIFT` configuration mode.
-   Let the robot go forward until it goes as straight as possible by pressing A and B to increase or modify the drift.
-   Once you have found the perfect drift value, make sure to write it down.

You can also create new .hex file that contains the adjusted drift:

-   open the [MakeCode for micro:bit editor](https://makecode.microbit.org/)
-   create a new project
-   add the **microcode robot extension** at https://github.com/microsoft/microcode/robot .
-   in `on start`, drag the bloc to select your robot type
-   drag the block to configure the drift value, voila!
-   drag the block to configure the radio group

## Tiles

The tiles are documented
in the [language robot section](./language#robot).

## Samples

The samples are listed on the [samples page](./samples.md#robot).

## Troubleshooting

This is a quick check list to make sure you have the best experience with the microcode robot:

-   **Charge your batteries** - everything starts to fall apart once the battery level gets low! Keep those batteries topped off!
-   **Double check the radio groups** - make sure the microcode program and the robot are on the same radio group

## Add your robot

The source of the robot firmware are at [https://github.com/microsoft/microcode/tree/main/robot](https://github.com/microsoft/microcode/tree/main/robot). We accept pull request to add new robots.
