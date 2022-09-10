![Happy/Sad MicroCode program](/images/happy_sad.jpg)

## Language

Following Kodu, the MicroCode language is defined in terms of pages, where a page has a list of rules,
and each rule consists of a **When** section and a **Do** section, each with a list of programming
**tiles**. The **When** section begins with a **sensor** tile, followed optionally by one or more
**filters** on the sensor. The **Do** section begins with an **actuator**, followed optional by one
or **modifiers** to the actuator.

The picture above shows a 1-page program that shows a happy face on the micro:bit screen when the A button is pressed and a sad face when the B button is pressed.

### Sensors

A sensor tile can refer to a hardware feature as simple as a button,
a thermometer represented by a floating point (or fixed point) value, or an accelerometer with a set of possible events. A sensor could also refer to a GPIO pin, a timer, microphone, radio, or other means for the program to receive notification of a state change or an event. It is also possible for a sensor to refer to an internal program variable, modified by some other part of the user's program (self-notification).

In the program above, the sensor refers to a press/touch event, without reference to the particular hardware feature (see filters below).

![available filters for press/touch event](/images/pick_microbit.jpg)

### Filters

Filters follow a sensor and specify conditions under which program execution can proceed to the **Do** section.  
If no filters are present, each sensor tile has a default filter that determines whether or not execution
proceeds. For example, if the sensor tile refers to a press event, with no following filter, the default filter will recognize any the press of any button.
If, on the other hand, a filter following the press event specifies a particular
button (such as A or B, in the program above), execution will proceed to the **Do** only when the given button is pressed.

The picker menu above shows the range of micro:bit hardware features that can generate a press event.

### Actuators

### Modifiers
