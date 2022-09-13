# Microsoft MicroCode

Microsoft MicroCode is a [MakeCode Arcade](https://arcade.makecode.com/) application that allows the creation, modification, and execution of simple reactive programs for microcontroller-based target devices such as the [BBC micro:bit](https://microbit.org) and [Jacdac brains](https://microsoft.github.io/jacdac-docs/start/brains/). MicroCode has a tile-based language and editor, inspired by [Kodu Game Lab](https://www.kodugamelab.com/), for creating programs using just the 4-way direction pad and A and B buttons supported by [Arcade-compatible devices](https://arcade.makecode.com/hardware/). The language is parameterized by a set of [Jacdac services](https://microsoft.github.io/jacdac-docs/services/) that represent the set of hardware features of the target device (the device to be programmed). The programs are compiled into the bytecode of the Jacdac virtual machine and persisted in the flash memory of the target device.

## Developing

### Install

-   install [Node.js](https://nodejs.org/en/)
-   `npm install -g makecode`
-   clone this repo

### Build

-   in this repo, run `mkc init` (one time only)
-   run `mkc serve`
-   head to http://127.0.0.1:7001 for simulator
-   run `mkc build -d` to compile and deploy to device

### With Jacdac devtools

To load the local editor in a Jacdac devtools page,

https://microsoft.github.io/jacdac-docs/clients/javascript/devtools?jacscript=1#http://127.0.0.1:7001

### Creating artwork

If you want to create/edit new sprites, you should import this web site into https://arcade.makecode.com, using the following directions:

-   create 16 x 16 sprite in assets.ts (contains all the artwork for MicroCode)
-   copy the code from the JavaScript view of https://arcade.makecode.com
-   paste code into assets.ts into VS Code
-   make sure it works locally
-   git commit and push

You might also be able to commit and push directly from the web site, but we find that this isn't very reliable.

### Updating GitHub pages

To bump and refresh the github pages javascript,

    sh ./bump.sh
    sh ./release.sh

then commit the generated files.

## Overview of implementation

### Local files

This little app packs a lot into a small footprint: graphics, UI, editor, compiler, and runtime. [Read more](./codereview.md)...

### Dependencies

This app is built with [MakeCode Arcade](https://arcade.makecode.com/beta), specifically targeting the NRF52833 MCU of the micro:bit V2 (for now). There are a number of repos containing the C++ of the underlying CODAL runtime:

-   https://github.com/microsoft/codal-jacdac: an add-on to CODAL that provides Jacdac runtime, virtual machine, and services representing micro:bit features
-   https://github.com/microsoft/pxt-arcade: the MakeCode Arcade editor, with support for NFR52833, the MCU of the micro:bit V2, which depends on
    -   https://github.com/mmoskal/codal-nrf52833-dk: micro:bit device drivers
    -   https://github.com/lancaster-university/codal-nrf52: CODAL runtime for NRF52 class MCUs
    -   https://github.com/lancaster-university/codal-core: CODAL runtime

## Micro:bit features

We are working to expose most of the micro:bit's main features in MicroCode:

-   **LED screen**
    -   design and display icons and animations
    -   plot the value of a sensor
-   **User input**
    -   buttons A and B
    -   capacative touch on micro:bit logo, pins 0, 1 and 2
-   **Accelerometer**
    -   respond to accelerometer events
    -   access to X, Y, Z values
-   **Sensors**
    -   temperature
    -   light level
    -   compass
-   **Music**
    -   play tones via the speaker
-   **Radio**
    -   set group
    -   send and receive messages
-   **Data**
    -   record data to flash
    -   display data

## Jacdac

MicroCode integrates with [Jacdac](https://aka.ms.jacdac) in several ways

-   the MicroCode program is compiled to the bytecode of the Jacdac virtual machine (JDVM), which can be run on the same micro:bit or exported to other micro:bits
-   the MicroCode editor recognizes a small set of Jacdac modules, when connected, providing programming tiles for those modules

## Language

The MicroCode language owes much to [Kodu Game Lab](https://www.kodugamelab.com). [Read more](./language.md)...

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
