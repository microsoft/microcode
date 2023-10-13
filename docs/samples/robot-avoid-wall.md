---
title: Detect light level
image: ./docs/images/generated/sample_robot_avoid_wall.png
description: A robot that avoids walls
---

![robot avoid wall program](../images/generated/sample_robot_avoid_wall.png){:class="sample"}

-   [Open in MicroCode](/microcode/#eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNkEiXSwiTSI6WyJNOCJdfSx7IlMiOlsiUzEiXSwiQSI6WyJDQVIiXSwiTSI6WyJDQVIxIl19LHsiUyI6WyJTMTMiXSwiQSI6WyJDQVIiXSwiRiI6WyJGOSJdLCJNIjpbIkNBUjMiLCJDQVIxIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfSwidmVyc2lvbiI6InYyLjQuNDMifQ)

The program starts by setting the radio group displayed by the [robot micro:bit](../robot.md). This is the same group that the microcode program will use to communicate with the robot. In this example, we use 3 dots but this is probably different for your robot.

![when page starts, set radio group of robot](../images/generated/sample_robot_avoid_wall_page_1_rule_1.png){:class="rule"}

-   **when** ![page start](../images/generated/icon_S1.png){:class="icon"} page starts, **do** ![set radio group](../images/images_A6A.png) set radio group to **put your robot radio number!**

The next rule runs on start and orders the robot to move forward. The robot will keep moving forward until another commands is received.

![when page starts, robot move forward](../images/generated/sample_robot_avoid_wall_page_1_rule_2.png){:class="rule"}

The robot constantly repots the distance measured by
the ultrasonic sonar. When the distance changes, the robot sends a message to the microcode program.
The 2 dots roughly mean 10cm + 2 x 5cm = 20cm (more or less).

![when wall near, robot turn then forward](../images/generated/sample_robot_avoid_wall_page_1_rule_3.png){:class="rule"}