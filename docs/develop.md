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

To load the local editor in a Jacdac devtools page, click on the **sim** link at the bottom
of the local server on http://127.0.0.1:7001. Or,

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

To bump and refresh the github pages javascript and pre-built .hex file, run this script

```bash
sh ./bump.sh
```

A GitHub Action will trigger and update the web site within a few minutes.

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
