# Microsoft MicroCode

Microsoft MicroCode is a [MakeCode Arcade](https://arcade.makecode.com/) application that allows the creation, modification, and execution of simple reactive programs for microcontroller-based target devices such as the [BBC micro:bit](https://microbit.org) and [Jacdac brains](https://microsoft.github.io/jacdac-docs/start/brains/). MicroCode has a tile-based language and editor, inspired by [Kodu Game Lab](https://www.kodugamelab.com/), for creating programs using just the 4-way direction pad and A and B buttons supported by [Arcade-compatible devices](https://arcade.makecode.com/hardware/). The language is parameterized by a set of [Jacdac services](https://microsoft.github.io/jacdac-docs/services/) that represent the set of hardware features of the target device (the device to be programmed). The programs are compiled into the bytecode of the Jacdac virtual machine and persisted in the flash memory of the target device.

## Running MicroCode

There are three ways to run MicroCode:

-   [web app](https:://microsoft.github.io/microcode) with micro:bit simulator (which you can bring up from the web app by clicking XYZ)
-   web app with micro:bit V2 hardware connected over Web USB
-   hex file deployed to micro:bit V2, Arcade Shield (for editing program), and optionally connected [Jacdac](https://aka.ms/jacdac) modules

See below for more information about the MicroCode web app, micro:bit simulator, and how to deploy MicroCode to the micro:bit V2.

Regardless of which way you run MicroCode, you will probably want to know a little bit about the MicroCode [icon-based language](./language.md), which
owes much to [Kodu Game Lab](https://www.kodugamelab.com).

### MicroCode Web app

The easiest way to get started with MicroCode is through the [web app](https:://microsoft.github.io/microcode). We recommend using the keyboard rather than the onscreen d-pad and buttons. The mapping is

-   Arrow keys for D-pad
-   Space bar for A button
-   Enter for B button (ESC and backspace not yet mapped to B)

### micro:bit V2 simulator

### micro:bit V2 hardware and MicroCode hex file

The first thing you will want to do is to copy the [MicroCode hex file]() to your micro:bit V2 over USB (the micro:bit V1 is not supported). This hex file has the complete MicroCode app, but also can receive MicroCode compiled programs you create in the web app (when connected via Web USB). This allows

## Developing

The easiest way to get started is to open this repository in a GitHub Codespace and everything will be ready for you.

We recommend using [Visual Studio Code](https://code.visualstudio.com/) as it provides excellent support
for MakeCode editing, Git, and Codespaces.

### Codespaces setup

-   click on `Code` drop down and select `Create Codespace on main`
-   you can do your editing from VS Code online or click on `Codespaces` in lower left and select `Open in VS Code` to use the desktop version (must be installed on your machine)
-   press "Ctrl + `" to open a terminal and you're ready to go!

In the future, click again on `Code` to find previously created Codespaces.

### Local Install (skip in Codespaces)

-   install [Node.js](https://nodejs.org/en/)
-   install the MakeCode command line tools (`mkc` for short)

```bash
npm install -g -u makecode
```

-   clone this repo

```bash
git clone https://github.com/microsoft/microcode
```

-   setup MakeCode project structure (one time only)

```bash
cd microcode
mkc init
```

### Build

Note that you can open terminals directly from VS Code by pressing "Ctrl + `".

-   start a compilation server that will automatically compile and reload
    a compile web version of the editor

```bash
mkc serve
```

-   open to web editor at http://127.0.0.1:7001
-   build a micro:bit Hex file and deploy

```bash
mkc build -d
```

### With Jacdac devtools

To load the local editor in a Jacdac devtools page,

https://microsoft.github.io/jacdac-docs/clients/javascript/devtools?jacscript=1&simulators=microbitmicrocode#http://127.0.0.1:7001

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

## Build setup for C++ runtime dev

-   clone https://github.com/microsoft/pxt-arcade repo at the same level as `microcode`
-   run:

```bash
npm install -g pxt-cli
cd pxt-arcade
yarn install
mkdir projects
cd projects
mkdir microcode
cd microcode
export PXT_ASMDEBUG=1
export PXT_COMPILE_SWITCHES=size
export PXT_FORCE_LOCAL=yes
export PXT_NODOCKER=yes
export PXT_RUNTIME_DEV=yes
```

-   you may use `npm` instead of `yarn`
-   you may skip `PXT_NODOCKER` if you don't have locally installed `arm-none-eabi-gcc`
-   in `projects/microcode` create `pxt.json` file with the following contents:

```json
{
    "additionalFilePath": "../../../microcode",
    "dependencies": {
        "game---light": "file:../../libs/game---light",
        "hw---n3": "file:../../libs/hw---n3",
        "device": "file:../../libs/device",
        "codal-jacdac-pxt": "file:../../../microcode/codal-jacdac-pxt"
    }
}
```

-   run `pxt` - it will compile an deploy
-   run `code built/codal/libraries/codal-*`
-   checkout `main` or `master` in all `codal-*` repos and in `jacdac-c`

Make sure not to delete `projects/microcode/built` since it contains your sources.
If possible, you can move `built/codal/libraries` folder somewhere else, and symlink it inside `built/codal`
to avoid accidentally deleting it.

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
