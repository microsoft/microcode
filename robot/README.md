# MicroCode robot MakeCode extension

This extension is a robot driver designed to run on a micro:bit v1 or v2 on a rover robot;
and controlled by a MicroCode program running on the arcade shield.

## Usage with MakeCode

-   Add this extension to your project by adding url `https://github.io/microsoft/microcode/robot`
-   Add the block to select the robot model you will be using. **This should be done before using any other blocks**.

```blocks
microcode.elecfreaksCuteBot.start()
```

-   Use the blocks to control the robot.

```blocks
input.onButtonPressed(Button.A, () => {
    microcode.motorRun(50, 50)
})
input.onButtonPressed(Button.B, () => {
    microcode.motorStop()
})
```

## Usage with MicroCode

Download this firmware onto the micro:bit that stays on the robot. Then use MicroCode to send commands
to the robot.

-   [Documentation](https://microsoft.github.io/microcode/docs/robot)

```

```
