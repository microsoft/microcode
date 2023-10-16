## Supported robots

MicroCode supports the following [robots](./robot.md) (please file a [GitHub issues](https://github.com/microsoft/microcode/issues?q=is%3Aissue+is%3Aopen+label%3Arobot) if your robot is not listed).
See [how to contribute](#contributing) for more information.

### Elecfreaks Cutebot

![Photograph of the Cutebot](./images/cutebot.jpeg){:class="sample"}

-   [Home](https://www.elecfreaks.com/micro-bit-smart-cutebot.html)
-   [Download](https://microsoft.github.io/microcode/assets/microcode-robot-elecfreaks-cutebot.hex)

### Yahboom Tiny:bit

![Photograph of the Tiny:bit](./images/tinybit.jpeg){:class="sample"}

-   [Home](http://www.yahboom.net/study/Tiny:bit)
-   [Download](https://microsoft.github.io/microcode/assets/microcode-robot-yahboom-tinybit.hex)

### Elecfreaks Cutebot PRO

![Photograph of the Cutebot PRO](./images/cutebotpro.jpeg){:class="sample"}

-   [Home](https://shop.elecfreaks.com/products/elecfreaks-smart-cutebot-pro-v2-programming-robot-car-for-micro-bit)
-   [Download](https://microsoft.github.io/microcode/assets/microcode-robot-elecfreaks-cutebotpro.hex)

### KittenBot MiniLFR

![Photo of the MiniLFR robot](./images/minilfr.png){:class="sample"}

-   [Home](https://www.kittenbot.cc/products/minilfr)
-   [Download](https://microsoft.github.io/microcode/assets/microcode-robot-kittenbot-minilfr.hex)

### DFRobot Maqueen V2+

![Photograph of the Maqueen](./images/maqueen.jpeg){:class="sample"}

-   [Home](https://wiki.dfrobot.com/micro_Maqueen_for_micro_bit_SKU_ROB0148-EN)
-   [Download](https://microsoft.github.io/microcode/assets/microcode-robot-dfrobot-maqueen.hex)

### DFRobot Maqueen Plus V2

-   [Home](https://www.dfrobot.com/product-2026.html)
-   [Download](https://microsoft.github.io/microcode/assets/microcode-robot-dfrobot-maqueen-plus-v2.hex)

### KeyStudio KS0426 Mini Smart Robot

-   [Home](https://wiki.keyestudio.com/KS0426_Keyestudio_Micro%EF%BC%9Abit_Mini_Smart_Robot_Car_Kit_V2)
-   [Download](https://microsoft.github.io/microcode/assets/microcode-robot-keystudio-minismartrobot.hex)

### Contributing {#contributing}

To add a new robot to the list, prepare a pull request with:

-   a new class extending `Robot` and configuring the hardware (see other robots)
-   a global field instance instantiating the robot (see other robots)
-   a URL in the jsdocs of the class pointing to the robot homepage
-   add `main{company}{productname}.ts` file that starts the robot
-   add `pxt-{company}{productname}.ts` file that overrides the test files to load `main{company}{productname}.ts`
-   add image under `docs/static/images`

Make sure to test and tune the configuration options in the robot class for your particular
chassis/motor/line detectors. You may want to tweak some of the constants in the robot class to optimize the behavior of the robot.
