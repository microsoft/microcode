---
title: Robot follow line
image: ./docs/images/generated/sample_robot_line_follow.png
description: A robot that follows lines
---

![robot controlled by gestures](../images/generated/sample_robot_line_follow.png){:class="sample"}

-   [Open in MicroCode](/microcode/#H4sIAOy8M2UAA/NKywwOSM8vzQsqyPfzMUmMygpxdM9NNigPKijw8w11cgx0BWJHWwDRJhkiKAAAAA==)

The program starts by setting the radio group displayed by the [robot micro:bit](../robot.md). This is the same group that the microcode program will use to communicate with the robot. In this example, we use 3 dots but this is probably different for your robot.

![when page starts, set radio group of robot](../images/generated/sample_robot_line_follow_page_1_rule_1.png){:class="rule"}

-   **when** ![page start](../images/generated/icon_S1.png){:class="icon"} page starts, **do** ![set radio group](../images/generated/icon_A6A.png) set radio group to **put your robot radio number!**

Microcode assumes that the robot has 2 line sensors at the front of the robot (some have more). Each following rule handle one possible state of the sensor and tell the robot where to go accordingly.

![when both line detected, robot move forward](../images/generated/sample_robot_line_follow_page_1_rule_2.png){:class="rule"}

When ![both lines](../images/generated/icon_F23B.png) both lines are detected, ![motor forward](../images/generated/icon_CAR1.png) move the robot forward.

![when line detected on left sensor, robot turn left](../images/generated/sample_robot_line_follow_page_1_rule_3.png){:class="rule"}

When the ![left line](../images/generated/icon_F23L.png) left sensor detects the line, the robot is starting to lose the line trajectory and we tell the robot to ![motor turn left](../images/generated/icon_CAR3.png) turn left.

![when line detected on right sensor, robot turn right](../images/generated/sample_robot_line_follow_page_1_rule_4.png){:class="rule"}

The same logic is applied for the right sensor.

![when line lost from left, robot spin left](../images/generated/sample_robot_line_follow_page_1_rule_5.png){:class="rule"}

When the ![left lost line](../images/generated/icon_F23NL.png) left sensor also stops detecting the line, the robot completely lost the line but we know that the line was on the left. We tell the robot to ![motor spin left](../images/generated/icon_CAR7.png) spin right (harder turn) to aggressively go back to detecting the line.

![when line lost from right, robot spin right](../images/generated/sample_robot_line_follow_page_1_rule_6.png){:class="rule"}

The same logic is applied for the right sensor.

## Tips about line following

-   the line should be as wide as the distance between the 2 sensors
-   use a chalk marker to draw the line on the mat as the infrared line sensor will be able to "see it". Some markers will be invisible to the sensor
-   avoid sharp turns as the robot will have a hard time following the line. Microcode lowers the speed of the robot
    when it detects line crossing but it is sometimes not enough.
