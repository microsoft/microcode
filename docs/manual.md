---
title: User Guide
image: ./docs/images/generated/sample_smiley_buttons.png
description: User guide for the MicroCode editor
---

{% include youtube.html id="g53_aEVH8oA" %}

Physical computing for young learners with the [micro:bit V2](https://microbit.org) (*no tablet/laptop/desktop required*):

-   [arcade shields](#arcade-shields) for the micro:bit V2 enable "on the go" programming with familiar game console controls
-   kid-friendly, icon-based, structured code editor and [programming language](./language)
-   lots of [sample programs](./samples) to get started
-   save your favorite programs in [three program slots](#program-slots)
-   accessories (LEDs, servos, ...) supported via [Jacdac](https://aka.ms/jacdac)
-   [translated](#localization) in 20+ languages

## Getting started

Regardless of whether you are using the Arcade shield or web app, you first need to download the (localized) MicroCode hex file to your micro:bit V2.  There are two ways to do this:
1. visit the [web app](https://aka.ms/microcode) and follow directions to connect your micro:bit and [automatically download over WebUSB](#download)
2. visit the [localization](#localization) section to *download* the MicroCode hex file to your computer and copy to your micro:bit V2 (plugged into your computer via USB).

## Arcade shields {#arcade-shield}

Three Arcade shields for the micro:bit V2 are available on the market today, as shown below. After downloading the MicroCode hex file to your micro:bit V2, whenever you plug the micro:bit into the Arcade Shield, MicroCode should start running. Your MicroCode program is always live and runnable. Once you remove the micro:bit from the shield, the program will persist and continue to run (assuming the micro:bit is still powered, of course).


<table>
<tr valign="top">
<td width="33%" >

[Kittenbot's newbit Arcade shield](https://www.kittenbot.cc/products/newbit-arcade-shield)

</td><td width="33%" >

[ELECFREAK's micro:bit Arcade shield](https://shop.elecfreaks.com/products/micro-bit-retro-programming-arcade)

</td>
<td width="33%" >

[ICShopping's Game:bit Arcade shield](https://www.icshop.com.tw/products/368112100118)

</td></tr>
<tr>
<td>

[![Kittenbot's newbit Arcade shield](./assets/newbit-shield.png)](https://www.kittenbot.cc/products/newbit-arcade-shield)

</td><td>

[![ELECFREAK's micro:bit Retro Arcade shield](./assets/elecfreaks-shield.png)](https://shop.elecfreaks.com/products/micro-bit-retro-programming-arcade)

</td><td>

[![ICShopping's Game:bit](./assets/gamebit-shield.png)](https://www.icshop.com.tw/products/368112100118)

</td></tr>
<tr valign="top">
<td>

Small screen. No battery or battery pack included. 3.7V JST power jack on back. One [Jacdac](https://aka.ms/jacdac) port. 

</td>

<td>

Assembly required. Small screen. AAA Battery pack on back. One [Jacdac](https://aka.ms/jacdac) port. 

</td>
<td>

No assembly required. Large screen and 3d-printed enclosure with LiPo battery inside. Two [Jacdac](https://aka.ms/jacdac) ports. Email at [oa@icshop.com.tw](mailto:oa@icshop.com.tw) to get a quote (the web site only allows ordering/delivery in Taiwan). 


</td>
</tr>


</table>


## [Web editor](https://aka.ms/m9) {#web}

<video class="sample" poster="./videos/smiley-buttons.png" src="./videos/smiley-buttons.mp4" controls="true"></video>

The MicroCode web editor is at [aka.ms/microcode](https://aka.ms/microcode). 
We recommend using the keyboard navigation:

-   `Left`, `Right`, `Up`, `Down` moves the cursor
    -   the `Left` and `Right` keys will wrap around in the editor on the **same** page
    -   the `Up` key on top of the screen will act as `back`. It will go back the pages until page 1 is in focus, then pressing up will go back to the start screen.
    -   the `Down` key will wrap around the pages
-   `Enter` or `Space` for `A` button
-   `Backspace` for `B` button
-   `]` or `Page Up` to go to the next page, `[` or `Page Down` to go to the previous page
-   Copy the URL to share your program.

### Automatic download to micro:bit V2 {#download}

When the editor does not detect any micro:bit, it will automatically prompt you with instructions
on how to connect. Once your micro:bit V2 is paired, the web editor will be able to download your
MicroCode program to your micro:bit. This happens on every edit, so your program
is always up-to-date (and running)!

> If your micro:bit disconnects, you will see a micro:bit icon show up on the upper left corner of the editor. Click on that button to reconnect again.

### Localization {#localization}

MicroCode is community translated through Crowdin. Please read on [localization](./localization) to get started.

-   [Basque](../eu.html) ([download](../assets/hex/microcode-eu.hex))
-   [Catalan](../ca.html) ([download](../assets/hex/microcode-ca.hex))
-   [Chinese (Simplified)](../zh-CN.html) ([download](../assets/hex/microcode-zh-cn.hex))
-   [Chinese (Traditional))](../zh-HK.html) ([download](../assets/hex/microcode-zh-hk.hex))
-   [Croatian](../hr.html) ([download](../assets/hex/microcode-hr.hex))
-   [Dutch](../nl.html) ([download](../assets/hex/microcode-nl.hex))
-   [English](../) ([download](../assets/hex/microcode-en.hex))
-   [German](../de.html) ([download](../assets/hex/microcode-de.hex))
-   [Filipino](../fil.html) ([download](../assets/hex/microcode-fil.hex))
-   [French](../fr.html) ([download](../assets/hex/microcode-fr.hex))
-   [French (Canada)](../fr-CA.html) ([download](../assets/hex/microcode-fr-ca.hex))
-   [Italian](../it.html) ([download](../assets/hex/microcode-it.hex))
-   [Japanese](../ja.html) ([download](../assets/hex/microcode-ja.hex))
-   [Korean](../ko.html) ([download](../assets/hex/microcode-ko.hex))
-   [Polish](../pl.html) ([download](../assets/hex/microcode-pl.hex))
-   [Portuguese (Brazil)](../pt-BR.html) ([download](../assets/hex/microcode-pt-br.hex))
-   [Russian](../ru.html) ([download](../assets/hex/microcode-ru.hex))
-   [Spanish](../es-ES.html) ([download](../assets/hex/microcode-es-es.hex))
-   [Spanish (Mexico)](../es-MX.html) ([download](../assets/hex/microcode-es-mx.hex))
-   [Turkish](../tr.html) ([download](../assets/hex/microcode-tr.hex))
-   [Welsh](../cy.html) ([download](../assets/hex/microcode-cy.hex))

### Accessibility

We want to make the editor as accessible as possible; please send us suggestions to improve its accessibility.

#### Keyboard navigation

MicroCode can be accessed with the keyboard:

-   Arrow keys to move cursor
-   `Enter` or `Space` for `A` button
-   `Backspace` for `B` button
-   Keep moving the cursor `Up` to go back a screen, if `Backspace` is not available;
    for example, if you are using a 5-input switch panel.
-   Keep moving `Right` or `Left` to wrap around the user interface; for example,
    if you are using a 2-input switch panel.

#### Gamepads

MicroCode supports game console controllers compatible with [Web Gamepad](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad).

#### Screen reader

The editor integrates with existing screen readers, like NVDA.

#### Tooltip read aloud

By clicking on the `tooltip reader` button at the bottom of the editor, the tooltips will be read aloud. This may be useful for students who are still learning to read.

## Program slots ![disk icon 1](./images/generated/icon_disk1.png) ![disk icon 2](./images/generated/icon_disk2.png) ![disk icon 3](./images/generated/icon_disk3.png) {#program-slots}

MicroCode provides three slots for saving user programs for later load/restore. From the editor, click on the disk icon
![disk icon](./images/generated/icon_disk.png)
in the upper left to select which slot to save the current program to. From the home screen, select the disk icon to load a program from one of the three save slots.

## Accessories

MicroCode supports Jacdac modules to extend the micro:bit device with LEDs, servos, motors, ...
In this video, we launch an LED animation when a clap is detected.

<video class="sample" poster="./videos/jacdac-led.png" src="./videos/jacdac-led.mp4" controls="true"></video>

## Community pages and videos

-   [KittenBot MicroCode introduction](https://mp.weixin.qq.com/s/yBQMU2IAbeHgr-ok05THTA)

{% include youtube.html id="mbF-HU9IZ-A" %}

## Acknowledgments

-   Microsoft Garage for kick starting this project during the 2022 Microsoft Hackathon.
-   [@loretod101](https://twitter.com/loretod101) on advising on accessibility features, including switch access support.
-   [@BillSeiver](https://twitter.com/BillSiever) on feedback for tiles, including the `page start` tile
-   [@eliseli\_](https://twitter.com/eliseli_) for the Spanish translation

## Contributing

-   Post your suggestions or questions at [https://forum.makecode.com/c/60](https://forum.makecode.com/c/60).

This project is open source and welcomes contributions and suggestions at https://github.com/microsoft/microcode.
Read the [developer instructions](./develop.md).
