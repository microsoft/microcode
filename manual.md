# MicroCode Manual

There are three ways to run MicroCode:

-   [web app](https://microsoft.github.io/microcode) with micro:bit simulator (which you can bring up from the web app by clicking XYZ)
-   web app with micro:bit V2 hardware connected over Web USB
-   hex file deployed to micro:bit V2, Arcade Shield (for editing program), and optionally connected [Jacdac](https://aka.ms/jacdac) modules

See below for more information about the MicroCode web app, micro:bit simulator, and how to deploy MicroCode to the micro:bit V2. Regardless of which way you run MicroCode, you will probably want to know a little bit about the MicroCode [icon-based language](./language.md).

## MicroCode Web app

The easiest way to get started with MicroCode is through the [web app](https://microsoft.github.io/microcode), shown below. We recommend using the keyboard (rather than the virtual D-pad and buttons):

-   Arrow keys for D-pad
-   Space bar for A button
-   Enter for B button (ESC and backspace not yet mapped to B)

![MicroCode web app](./images/webApp.jpg)

## micro:bit V2 simulator

From the web app, make sure that the web browser is not full screen and you will see four links at the bottom (footer) of the app:

-   **Manual** (this page)
-   **Simulator**
-   **GitHub** (this repo)
-   **Version #** (links to micro:bit hex file)

Clicking on the simulator link will open a page with the MicroCode web app on the right side and a micro:bit simulator and Jacdac dashboard on the left, as shown below.
In the MicroCode editor, whenever you click the green check mark in the upper left,
MicroCode will compile your program and start it running in the simulator

![micro:bit simulator and MicroCode web app](./images/webAppSimulators.jpg)

## micro:bit V2 hardware and MicroCode hex file

See the directions above about the four links at the bottom of the web app. Click on the version number (last of four links) to download the MicroCode hex file. Next, copy this file to your micro:bit V2 over USB (the micro:bit V1 is not supported).

This hex file has the complete MicroCode app, but also can receive MicroCode compiled programs you create in the web app (when connected via Web USB).

**TODO: how to download compiled MicroCode program to micro:bit**
