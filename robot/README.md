# microcode robot

This project is a robot driver designed to run on a micro:bit v1 or v2 on a rover robot;
and controlled by a microcode program running on the arcade shield.

-   [Documentation](https://microsoft.github.io/microcode/robot)

## Supported Robots

-   Elecfreaks Cutebot
-   Elecfreaks Cutebot PRO
-   DFRobot Maqueen
-   DFRobot Maqueen Plus V2
-   KeyStudio KS0426 Mini Smart Robot
-   Yahboom Tiny:bit

See contributing to add more robots.

## Usage with microcode

Download this firmware onto the micro:bit that stays on the robot. Then use microcode to send commands
to the robot.

## Usage with MakeCode

-   Add this extension to your project by adding url https://github.io/microsoft/microcode/robot
-   Add the block to select the robot model you will be using. **This should be done before using any other blocks**.

## Contributing

To add a new robot to the list, prepare a pull request with:

-   a new class extending `Robot` and configuring the hardware (see other robots)
-   a global field instance instantiating the robot (see other robots)
-   a URL in the jsdocs of the class pointing to the robot homepage
-   add `main{productname}.ts` file that starts the robot
-   add `pxt-{productname}.ts` file that overrides the test files to load `main{productname}.ts`

Make sure to test and tune the configuration options in the robot class for your particular
chassis/motor/line detectors.
