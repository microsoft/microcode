# Microsoft MicroCode

Microsoft MicroCode is a [MakeCode Arcade](https://arcade.makecode.com/) application that allows the creation, modification, and execution of simple reactive programs for microcontroller-based target devices such as the [BBC micro:bit](https://microbit.org) and [Jacdac brains](https://microsoft.github.io/jacdac-docs/start/brains/). MicroCode has a tile-based language and editor, inspired by [Kodu Game Lab](https://www.kodugamelab.com/), for creating programs using just the 4-way direction pad and A and B buttons supported by [Arcade-compatible devices](https://arcade.makecode.com/hardware/).  The language is parameterized by a set of [Jacdac services](https://microsoft.github.io/jacdac-docs/services/) that represent the set of hardware features of the target device (the device to be programmed). The programs are compiled into the bytecode of the Jacdac virtual machine and persisted in the flash memory of the target device.

## Developing

* `npm install -g makecode`
* in this repo, run `mkc init`
* run `mkc serve`
* head to http://127.0.0.1:7001 for simulator
* run `mkc build -d` to compile and deploy to device

To bump and refresh the github pages javascript,

    sh ./bump.sh
    sh ./release.sh

then commit the generated files.

To load the local editor in a Jacdac devtools page,

https://microsoft.github.io/jacdac-docs/clients/javascript/devtools?jacscript=1#http://127.0.0.1:7001

## Editor

## Tile-based Language

Following Kodu, the MicroCode language is defined in terms of pages, where a page has a list of rules,
and each rule consists of a **When** section and a **Do** section, each with a list of programming
**tiles**.  The **When** section begins with a **sensor** tile, followed optionally by one or more 
**filters** on the sensor.  The **Do** section begins with an **actuator**, followed optional by one 
or **modifiers** to the actuator.

### Sensors

A sensor tile can refer to a hardware feature as simple as a button with two states (up, down), 
a thermometer represented by a floating point (or fixed point) value, or an accelerometer with a set 
of possible events.  A sensor could also refer to a GPIO pin, a timer, microphone, radio, or other means 
for the program to receive notification of a state change or an event. It is also possible for a sensor to refer to 
an internal program variable, modified by some other part of the user's program (self-notification). Most
sensors are modelled either by a discrete variable or a continuous variable.

### Filters

Filters follow a sensor and specify conditions under which program execution can proceed to the **Do** section.  
If no filters are present, each sensor tile has a default filter that determines whether or not execution 
proceeds. For example, if the sensor tile refers to a button, with no following filter, the default filter
may be that a 'pressed' event for the button was just received.  If, on the other hand, a filter following
the sensor tile for a button specifies the 'down' event, that will take precedence.

Filters may be parameterized based on the kind of sensor (discrete or continuous)

### Actuators

### Modifiers

## Parameterization via Jacdac Services

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
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
