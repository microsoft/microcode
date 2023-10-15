const enum RobotLineState {
    //% block="none"
    None = 0,
    //% block="left"
    Left = 0x01,
    //% block="right"
    Right = 0x02,
    //% block="both" 
    Both = Left | Right,
    //% block="none from left"
    NoneFromLeft = None | 0x04,
    //% block="none from right"
    NoneFromRight = None | 0x0a,
}

namespace microcode.robots {

    /**
     * Compact commands through radio numbers
     */
    export const enum RobotCompactCommand {
        MotorState = 0xfffff00,
        MotorRunForward = MotorState | 0x1,
        MotorRunBackward = MotorState | 0x2,
        MotorTurnLeft = MotorState | 0x3,
        MotorTurnRight = MotorState | 0x4,
        MotorStop = MotorState | 0x5,
        MotorRunForwardFast = MotorState | 0x6,
        MotorSpinLeft = MotorState | 0x7,
        MotorSpinRight = MotorState | 0x8,
        MotorLEDRed = MotorState | 0x09,
        MotorLEDGreen = MotorState | 0x0a,
        MotorLEDBlue = MotorState | 0x0b,

        /**
         * sonar detected obstable
         */
        ObstacleState = 0xfffff20,
        Obstacle1 = ObstacleState | 0x1,
        Obstacle2 = ObstacleState | 0x2,
        Obstacle3 = ObstacleState | 0x3,
        Obstacle4 = ObstacleState | 0x4,
        Obstacle5 = ObstacleState | 0x5,

        /**
         * Line sensor state change
         */
        LineState = 0xfffff30,
        Left = LineState | RobotLineState.Left,
        Right = LineState | RobotLineState.Right,
        Both = LineState | RobotLineState.Both,
        None = LineState | RobotLineState.None,
        NoneFromLeft = LineState | RobotLineState.NoneFromLeft,
        NoneFromRight = LineState | RobotLineState.NoneFromRight,
    }
}
