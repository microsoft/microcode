namespace microbin {
    // should fit into a byte
    enum Tid {
        // we need markers to indicate the end of a program, page, rule, when
        END_OF_PROG = 0,
        END_OF_PAGE,
        END_OF_RULE,
        END_OF_WHEN,
    
        SENSOR_START = 10,
        TID_SENSOR_START_PAGE = 10,
        TID_SENSOR_PRESS,
        TID_SENSOR_RELEASE,
        TID_SENSOR_ACCELEROMETER,
        TID_SENSOR_TIMER,
        TID_SENSOR_LIGHT,
        TID_SENSOR_TEMP,
        TID_SENSOR_RADIO_RECEIVE,
        TID_SENSOR_MICROPHONE,
        TID_SENSOR_CUP_X_WRITTEN,
        TID_SENSOR_CUP_Y_WRITTEN,
        TID_SENSOR_CUP_Z_WRITTEN,
        TID_SENSOR_MAGNET,
        TID_SENSOR_SLIDER,
        TID_SENSOR_ROTARY,
        TID_SENSOR_CAR_WALL,
        TID_SENSOR_LINE,

        ACTUATOR_START = 40,
        TID_ACTUATOR_SWITCH_PAGE = 40,
        TID_ACTUATOR_SPEAKER,
        TID_ACTUATOR_MICROPHONE,
        TID_ACTUATOR_MUSIC,
        TID_ACTUATOR_PAINT,
        TID_ACTUATOR_RADIO_SEND,
        TID_ACTUATOR_RADIO_SET_GROUP,
        TID_ACTUATOR_RGB_LED,
        TID_ACTUATOR_CUP_X_ASSIGN,
        TID_ACTUATOR_CUP_Y_ASSIGN,
        TID_ACTUATOR_CUP_Z_ASSIGN,
        TID_ACTUATOR_SHOW_NUMBER,
        TID_ACTUATOR_CAR,
     
        FILTER_START = 70,
        TID_FILTER_PIN_0 = 70,
        TID_FILTER_PIN_1,
        TID_FILTER_PIN_2,
        TID_FILTER_BUTTON_A,
        TID_FILTER_BUTTON_B,
        TID_FILTER_KITA_KEY_1,
        TID_FILTER_KITA_KEY_2,
        TID_FILTER_LOGO,
        TID_FILTER_COIN_1,
        TID_FILTER_COIN_2,
        TID_FILTER_COIN_3,
        TID_FILTER_COIN_4,
        TID_FILTER_COIN_5,
        TID_FILTER_TIMESPAN_SHORT,
        TID_FILTER_TIMESPAN_LONG,
        TID_FILTER_LOUD,
        TID_FILTER_QUIET,
        TID_FILTER_ACCEL,
        TID_FILTER_ACCEL_SHAKE,
        TID_FILTER_ACCEL_TILT_UP,
        TID_FILTER_ACCEL_TILT_DOWN,
        TID_FILTER_ACCEL_TILT_LEFT,
        TID_FILTER_ACCEL_TILT_RIGHT,
        TID_FILTER_TIMESPAN_RANDOM,
        TID_FILTER_TIMESPAN_VERY_LONG,
        TID_FILTER_CUP_X_READ,
        TID_FILTER_CUP_Y_READ,
        TID_FILTER_CUP_Z_READ,
        TID_FILTER_ROTARY_LEFT,
        TID_FILTER_ROTARY_RIGHT,
        TID_FILTER_TEMP_WARMER,
        TID_FILTER_TEMP_COLDER,
        TID_FILTER_LINE_LEFT,
        TID_FILTER_LINE_RIGHT,
        TID_FILTER_LINE_BOTH,
        TID_FILTER_LINE_NEITHER,
     
        MODIFIER_START = 150,
        TID_MODIFIER_PAGE_1 = 150,
        TID_MODIFIER_PAGE_2,
        TID_MODIFIER_PAGE_3,
        TID_MODIFIER_PAGE_4,
        TID_MODIFIER_PAGE_5,
        TID_MODIFIER_COIN_1,
        TID_MODIFIER_COIN_2,
        TID_MODIFIER_COIN_3,
        TID_MODIFIER_COIN_4,
        TID_MODIFIER_COIN_5,
        TID_MODIFIER_ICON_EDITOR,
        TID_MODIFIER_COLOR_RED,
        TID_MODIFIER_COLOR_DARKPURPLE,
        TID_MODIFIER_EMOJI_GIGGLE,
        TID_MODIFIER_EMOJI_HAPPY,
        TID_MODIFIER_EMOJI_HELLO,
        TID_MODIFIER_EMOJI_MYSTERIOUS,
        TID_MODIFIER_EMOJI_SAD,
        TID_MODIFIER_EMOJI_SLIDE,
        TID_MODIFIER_EMOJI_SOARING,
        TID_MODIFIER_EMOJI_SPRING,
        TID_MODIFIER_EMOJI_TWINKLE,
        TID_MODIFIER_EMOJI_YAWN,
        TID_MODIFIER_CUP_X_READ,
        TID_MODIFIER_CUP_Y_READ,
        TID_MODIFIER_CUP_Z_READ,
        TID_MODIFIER_RADIO_VALUE,
        TID_MODIFIER_RANDOM_TOSS,
        TID_MODIFIER_LOOP,
        TID_MODIFIER_MELODY_EDITOR,
        TID_MODIFIER_TEMP_READ,
        TID_MODIFIER_RGB_LED_COLOR_X,
        TID_MODIFIER_RGB_LED_COLOR_1,
        TID_MODIFIER_RGB_LED_COLOR_2,
        TID_MODIFIER_RGB_LED_COLOR_3,
        TID_MODIFIER_RGB_LED_COLOR_4,
        TID_MODIFIER_RGB_LED_COLOR_5,
        TID_MODIFIER_RGB_LED_COLOR_6,
        TID_MODIFIER_RGB_LED_COLOR_RAINBOW,
        TID_MODIFIER_RGB_LED_COLOR_SPARKLE,
        TID_MODIFIER_SERVO_SET_ANGLE,
        TID_MODIFIER_CAR_FORWARD,
        TID_MODIFIER_CAR_REVERSE,
        TID_MODIFIER_CAR_TURN_LEFT,
        TID_MODIFIER_CAR_TURN_RIGHT,
        TID_MODIFIER_CAR_STOP,
    }

    export function tidToEnum(t: string) {
        switch (t) {
            case microcode.TID_SENSOR_START_PAGE: return Tid.TID_SENSOR_START_PAGE
            case microcode.TID_SENSOR_PRESS: return Tid.TID_SENSOR_PRESS
            case microcode.TID_SENSOR_RELEASE: return Tid.TID_SENSOR_RELEASE
            case microcode.TID_SENSOR_ACCELEROMETER: return Tid.TID_SENSOR_ACCELEROMETER
            case microcode.TID_SENSOR_TIMER: return Tid.TID_SENSOR_TIMER
            case microcode.TID_SENSOR_LIGHT: return Tid.TID_SENSOR_LIGHT
            case microcode.TID_SENSOR_TEMP: return Tid.TID_SENSOR_TEMP
            case microcode.TID_SENSOR_RADIO_RECEIVE: return Tid.TID_SENSOR_RADIO_RECEIVE
            case microcode.TID_SENSOR_MICROPHONE: return Tid.TID_SENSOR_MICROPHONE
            case microcode.TID_SENSOR_CUP_X_WRITTEN: return Tid.TID_SENSOR_CUP_X_WRITTEN
            case microcode.TID_SENSOR_CUP_Y_WRITTEN: return Tid.TID_SENSOR_CUP_Y_WRITTEN
            case microcode.TID_SENSOR_CUP_Z_WRITTEN: return Tid.TID_SENSOR_CUP_Z_WRITTEN
            case microcode.TID_SENSOR_MAGNET: return Tid.TID_SENSOR_MAGNET
            case microcode.TID_SENSOR_SLIDER: return Tid.TID_SENSOR_SLIDER
            case microcode.TID_SENSOR_ROTARY: return Tid.TID_SENSOR_ROTARY
            case microcode.TID_SENSOR_CAR_WALL: return Tid.TID_SENSOR_CAR_WALL
            case microcode.TID_SENSOR_LINE: return Tid.TID_SENSOR_LINE
            case microcode.TID_FILTER_PIN_0: return Tid.TID_FILTER_PIN_0
            case microcode.TID_FILTER_PIN_1: return Tid.TID_FILTER_PIN_1
            case microcode.TID_FILTER_PIN_2: return Tid.TID_FILTER_PIN_2
            case microcode.TID_FILTER_BUTTON_A: return Tid.TID_FILTER_BUTTON_A
            case microcode.TID_FILTER_BUTTON_B: return Tid.TID_FILTER_BUTTON_B
            case microcode.TID_FILTER_KITA_KEY_1: return Tid.TID_FILTER_KITA_KEY_1
            case microcode.TID_FILTER_KITA_KEY_2: return Tid.TID_FILTER_KITA_KEY_2
            case microcode.TID_FILTER_LOGO: return Tid.TID_FILTER_LOGO
            case microcode.TID_FILTER_COIN_1: return Tid.TID_FILTER_COIN_1
            case microcode.TID_FILTER_COIN_2: return Tid.TID_FILTER_COIN_2
            case microcode.TID_FILTER_COIN_3: return Tid.TID_FILTER_COIN_3
            case microcode.TID_FILTER_COIN_4: return Tid.TID_FILTER_COIN_4
            case microcode.TID_FILTER_COIN_5: return Tid.TID_FILTER_COIN_5
            case microcode.TID_FILTER_TIMESPAN_SHORT: return Tid.TID_FILTER_TIMESPAN_SHORT
            case microcode.TID_FILTER_TIMESPAN_LONG: return Tid.TID_FILTER_TIMESPAN_LONG
            case microcode.TID_FILTER_LOUD: return Tid.TID_FILTER_LOUD
            case microcode.TID_FILTER_QUIET: return Tid.TID_FILTER_QUIET
            case microcode.TID_FILTER_ACCEL: return Tid.TID_FILTER_ACCEL
            case microcode.TID_FILTER_ACCEL_SHAKE: return Tid.TID_FILTER_ACCEL_SHAKE
            case microcode.TID_FILTER_ACCEL_TILT_UP: return Tid.TID_FILTER_ACCEL_TILT_UP
            case microcode.TID_FILTER_ACCEL_TILT_DOWN: return Tid.TID_FILTER_ACCEL_TILT_DOWN
            case microcode.TID_FILTER_ACCEL_TILT_LEFT: return Tid.TID_FILTER_ACCEL_TILT_LEFT
            case microcode.TID_FILTER_ACCEL_TILT_RIGHT: return Tid.TID_FILTER_ACCEL_TILT_RIGHT
            case microcode.TID_FILTER_TIMESPAN_RANDOM: return Tid.TID_FILTER_TIMESPAN_RANDOM
            case microcode.TID_FILTER_TIMESPAN_VERY_LONG: return Tid.TID_FILTER_TIMESPAN_VERY_LONG
            case microcode.TID_FILTER_CUP_X_READ: return Tid.TID_FILTER_CUP_X_READ
            case microcode.TID_FILTER_CUP_Y_READ: return Tid.TID_FILTER_CUP_Y_READ
            case microcode.TID_FILTER_CUP_Z_READ: return Tid.TID_FILTER_CUP_Z_READ
            case microcode.TID_FILTER_ROTARY_LEFT: return Tid.TID_FILTER_ROTARY_LEFT
            case microcode.TID_FILTER_ROTARY_RIGHT: return Tid.TID_FILTER_ROTARY_RIGHT
            case microcode.TID_FILTER_TEMP_WARMER: return Tid.TID_FILTER_TEMP_WARMER
            case microcode.TID_FILTER_TEMP_COLDER: return Tid.TID_FILTER_TEMP_COLDER
            case microcode.TID_FILTER_LINE_LEFT: return Tid.TID_FILTER_LINE_LEFT
            case microcode.TID_FILTER_LINE_RIGHT: return Tid.TID_FILTER_LINE_RIGHT
            case microcode.TID_FILTER_LINE_BOTH: return Tid.TID_FILTER_LINE_BOTH
            case microcode.TID_FILTER_LINE_NEITHER: return Tid.TID_FILTER_LINE_NEITHER
            case microcode.TID_ACTUATOR_SWITCH_PAGE: return Tid.TID_ACTUATOR_SWITCH_PAGE
            case microcode.TID_ACTUATOR_SPEAKER: return Tid.TID_ACTUATOR_SPEAKER
            case microcode.TID_ACTUATOR_MICROPHONE: return Tid.TID_ACTUATOR_MICROPHONE
            case microcode.TID_ACTUATOR_MUSIC: return Tid.TID_ACTUATOR_MUSIC
            case microcode.TID_ACTUATOR_PAINT: return Tid.TID_ACTUATOR_PAINT
            case microcode.TID_ACTUATOR_RADIO_SEND: return Tid.TID_ACTUATOR_RADIO_SEND
            case microcode.TID_ACTUATOR_RADIO_SET_GROUP: return Tid.TID_ACTUATOR_RADIO_SET_GROUP
            case microcode.TID_ACTUATOR_RGB_LED: return Tid.TID_ACTUATOR_RGB_LED
            case microcode.TID_ACTUATOR_CUP_X_ASSIGN: return Tid.TID_ACTUATOR_CUP_X_ASSIGN
            case microcode.TID_ACTUATOR_CUP_Y_ASSIGN: return Tid.TID_ACTUATOR_CUP_Y_ASSIGN
            case microcode.TID_ACTUATOR_CUP_Z_ASSIGN: return Tid.TID_ACTUATOR_CUP_Z_ASSIGN
            case microcode.TID_ACTUATOR_SHOW_NUMBER: return Tid.TID_ACTUATOR_SHOW_NUMBER
            case microcode.TID_MODIFIER_PAGE_1: return Tid.TID_MODIFIER_PAGE_1
            case microcode.TID_MODIFIER_PAGE_2: return Tid.TID_MODIFIER_PAGE_2
            case microcode.TID_MODIFIER_PAGE_3: return Tid.TID_MODIFIER_PAGE_3
            case microcode.TID_MODIFIER_PAGE_4: return Tid.TID_MODIFIER_PAGE_4
            case microcode.TID_MODIFIER_PAGE_5: return Tid.TID_MODIFIER_PAGE_5
            case microcode.TID_MODIFIER_COIN_1: return Tid.TID_MODIFIER_COIN_1
            case microcode.TID_MODIFIER_COIN_2: return Tid.TID_MODIFIER_COIN_2
            case microcode.TID_MODIFIER_COIN_3: return Tid.TID_MODIFIER_COIN_3
            case microcode.TID_MODIFIER_COIN_4: return Tid.TID_MODIFIER_COIN_4
            case microcode.TID_MODIFIER_COIN_5: return Tid.TID_MODIFIER_COIN_5
            case microcode.TID_MODIFIER_ICON_EDITOR: return Tid.TID_MODIFIER_ICON_EDITOR
            case microcode.TID_MODIFIER_COLOR_RED: return Tid.TID_MODIFIER_COLOR_RED
            case microcode.TID_MODIFIER_COLOR_DARKPURPLE: return Tid.TID_MODIFIER_COLOR_DARKPURPLE
            case microcode.TID_MODIFIER_EMOJI_GIGGLE: return Tid.TID_MODIFIER_EMOJI_GIGGLE
            case microcode.TID_MODIFIER_EMOJI_HAPPY: return Tid.TID_MODIFIER_EMOJI_HAPPY
            case microcode.TID_MODIFIER_EMOJI_HELLO: return Tid.TID_MODIFIER_EMOJI_HELLO
            case microcode.TID_MODIFIER_EMOJI_MYSTERIOUS: return Tid.TID_MODIFIER_EMOJI_MYSTERIOUS
            case microcode.TID_MODIFIER_EMOJI_SAD: return Tid.TID_MODIFIER_EMOJI_SAD
            case microcode.TID_MODIFIER_EMOJI_SLIDE: return Tid.TID_MODIFIER_EMOJI_SLIDE
            case microcode.TID_MODIFIER_EMOJI_SOARING: return Tid.TID_MODIFIER_EMOJI_SOARING
            case microcode.TID_MODIFIER_EMOJI_SPRING: return Tid.TID_MODIFIER_EMOJI_SPRING
            case microcode.TID_MODIFIER_EMOJI_TWINKLE: return Tid.TID_MODIFIER_EMOJI_TWINKLE
            case microcode.TID_MODIFIER_EMOJI_YAWN: return Tid.TID_MODIFIER_EMOJI_YAWN
            case microcode.TID_MODIFIER_CUP_X_READ: return Tid.TID_MODIFIER_CUP_X_READ
            case microcode.TID_MODIFIER_CUP_Y_READ: return Tid.TID_MODIFIER_CUP_Y_READ
            case microcode.TID_MODIFIER_CUP_Z_READ: return Tid.TID_MODIFIER_CUP_Z_READ
            case microcode.TID_MODIFIER_RADIO_VALUE: return Tid.TID_MODIFIER_RADIO_VALUE
            case microcode.TID_MODIFIER_RANDOM_TOSS: return Tid.TID_MODIFIER_RANDOM_TOSS
            case microcode.TID_MODIFIER_LOOP: return Tid.TID_MODIFIER_LOOP
            case microcode.TID_MODIFIER_MELODY_EDITOR: return Tid.TID_MODIFIER_MELODY_EDITOR
            case microcode.TID_MODIFIER_TEMP_READ: return Tid.TID_MODIFIER_TEMP_READ
            case microcode.TID_MODIFIER_RGB_LED_COLOR_X: return Tid.TID_MODIFIER_RGB_LED_COLOR_X
            case microcode.TID_MODIFIER_RGB_LED_COLOR_1: return Tid.TID_MODIFIER_RGB_LED_COLOR_1
            case microcode.TID_MODIFIER_RGB_LED_COLOR_2: return Tid.TID_MODIFIER_RGB_LED_COLOR_2
            case microcode.TID_MODIFIER_RGB_LED_COLOR_3: return Tid.TID_MODIFIER_RGB_LED_COLOR_3
            case microcode.TID_MODIFIER_RGB_LED_COLOR_4: return Tid.TID_MODIFIER_RGB_LED_COLOR_4
            case microcode.TID_MODIFIER_RGB_LED_COLOR_5: return Tid.TID_MODIFIER_RGB_LED_COLOR_5
            case microcode.TID_MODIFIER_RGB_LED_COLOR_6: return Tid.TID_MODIFIER_RGB_LED_COLOR_6
            case microcode.TID_MODIFIER_RGB_LED_COLOR_RAINBOW: return Tid.TID_MODIFIER_RGB_LED_COLOR_RAINBOW
            case microcode.TID_MODIFIER_RGB_LED_COLOR_SPARKLE: return Tid.TID_MODIFIER_RGB_LED_COLOR_SPARKLE
            case microcode.TID_MODIFIER_SERVO_SET_ANGLE: return Tid.TID_MODIFIER_SERVO_SET_ANGLE
            case microcode.TID_ACTUATOR_CAR: return Tid.TID_ACTUATOR_CAR
            case microcode.TID_MODIFIER_CAR_FORWARD: return Tid.TID_MODIFIER_CAR_FORWARD
            case microcode.TID_MODIFIER_CAR_REVERSE: return Tid.TID_MODIFIER_CAR_REVERSE
            case microcode.TID_MODIFIER_CAR_TURN_LEFT: return Tid.TID_MODIFIER_CAR_TURN_LEFT
            case microcode.TID_MODIFIER_CAR_TURN_RIGHT: return Tid.TID_MODIFIER_CAR_TURN_RIGHT
            case microcode.TID_MODIFIER_CAR_STOP: return Tid.TID_MODIFIER_CAR_STOP
            default: return undefined
        }
    }

    export function enumToTid(e: Tid) {
        switch (e) {
            case Tid.TID_SENSOR_START_PAGE: return microcode.TID_SENSOR_START_PAGE
            case Tid.TID_SENSOR_PRESS: return microcode.TID_SENSOR_PRESS
            case Tid.TID_SENSOR_RELEASE: return microcode.TID_SENSOR_RELEASE
            case Tid.TID_SENSOR_ACCELEROMETER: return microcode.TID_SENSOR_ACCELEROMETER
            case Tid.TID_SENSOR_TIMER: return microcode.TID_SENSOR_TIMER
            case Tid.TID_SENSOR_LIGHT: return microcode.TID_SENSOR_LIGHT
            case Tid.TID_SENSOR_TEMP: return microcode.TID_SENSOR_TEMP
            case Tid.TID_SENSOR_RADIO_RECEIVE: return microcode.TID_SENSOR_RADIO_RECEIVE
            case Tid.TID_SENSOR_MICROPHONE: return microcode.TID_SENSOR_MICROPHONE
            case Tid.TID_SENSOR_CUP_X_WRITTEN: return microcode.TID_SENSOR_CUP_X_WRITTEN
            case Tid.TID_SENSOR_CUP_Y_WRITTEN: return microcode.TID_SENSOR_CUP_Y_WRITTEN
            case Tid.TID_SENSOR_CUP_Z_WRITTEN: return microcode.TID_SENSOR_CUP_Z_WRITTEN
            case Tid.TID_SENSOR_MAGNET: return microcode.TID_SENSOR_MAGNET
            case Tid.TID_SENSOR_SLIDER: return microcode.TID_SENSOR_SLIDER
            case Tid.TID_SENSOR_ROTARY: return microcode.TID_SENSOR_ROTARY
            case Tid.TID_SENSOR_CAR_WALL: return microcode.TID_SENSOR_CAR_WALL
            case Tid.TID_SENSOR_LINE: return microcode.TID_SENSOR_LINE
            case Tid.TID_FILTER_PIN_0: return microcode.TID_FILTER_PIN_0
            case Tid.TID_FILTER_PIN_1: return microcode.TID_FILTER_PIN_1
            case Tid.TID_FILTER_PIN_2: return microcode.TID_FILTER_PIN_2
            case Tid.TID_FILTER_BUTTON_A: return microcode.TID_FILTER_BUTTON_A
            case Tid.TID_FILTER_BUTTON_B: return microcode.TID_FILTER_BUTTON_B
            case Tid.TID_FILTER_KITA_KEY_1: return microcode.TID_FILTER_KITA_KEY_1
            case Tid.TID_FILTER_KITA_KEY_2: return microcode.TID_FILTER_KITA_KEY_2
            case Tid.TID_FILTER_LOGO: return microcode.TID_FILTER_LOGO
            case Tid.TID_FILTER_COIN_1: return microcode.TID_FILTER_COIN_1
            case Tid.TID_FILTER_COIN_2: return microcode.TID_FILTER_COIN_2
            case Tid.TID_FILTER_COIN_3: return microcode.TID_FILTER_COIN_3
            case Tid.TID_FILTER_COIN_4: return microcode.TID_FILTER_COIN_4
            case Tid.TID_FILTER_COIN_5: return microcode.TID_FILTER_COIN_5
            case Tid.TID_FILTER_TIMESPAN_SHORT: return microcode.TID_FILTER_TIMESPAN_SHORT
            case Tid.TID_FILTER_TIMESPAN_LONG: return microcode.TID_FILTER_TIMESPAN_LONG
            case Tid.TID_FILTER_LOUD: return microcode.TID_FILTER_LOUD
            case Tid.TID_FILTER_QUIET: return microcode.TID_FILTER_QUIET
            case Tid.TID_FILTER_ACCEL: return microcode.TID_FILTER_ACCEL
            case Tid.TID_FILTER_ACCEL_SHAKE: return microcode.TID_FILTER_ACCEL_SHAKE
            case Tid.TID_FILTER_ACCEL_TILT_UP: return microcode.TID_FILTER_ACCEL_TILT_UP
            case Tid.TID_FILTER_ACCEL_TILT_DOWN: return microcode.TID_FILTER_ACCEL_TILT_DOWN
            case Tid.TID_FILTER_ACCEL_TILT_LEFT: return microcode.TID_FILTER_ACCEL_TILT_LEFT
            case Tid.TID_FILTER_ACCEL_TILT_RIGHT: return microcode.TID_FILTER_ACCEL_TILT_RIGHT
            case Tid.TID_FILTER_TIMESPAN_RANDOM: return microcode.TID_FILTER_TIMESPAN_RANDOM
            case Tid.TID_FILTER_TIMESPAN_VERY_LONG: return microcode.TID_FILTER_TIMESPAN_VERY_LONG
            case Tid.TID_FILTER_CUP_X_READ: return microcode.TID_FILTER_CUP_X_READ
            case Tid.TID_FILTER_CUP_Y_READ: return microcode.TID_FILTER_CUP_Y_READ
            case Tid.TID_FILTER_CUP_Z_READ: return microcode.TID_FILTER_CUP_Z_READ
            case Tid.TID_FILTER_ROTARY_LEFT: return microcode.TID_FILTER_ROTARY_LEFT
            case Tid.TID_FILTER_ROTARY_RIGHT: return microcode.TID_FILTER_ROTARY_RIGHT
            case Tid.TID_FILTER_TEMP_WARMER: return microcode.TID_FILTER_TEMP_WARMER
            case Tid.TID_FILTER_TEMP_COLDER: return microcode.TID_FILTER_TEMP_COLDER
            case Tid.TID_FILTER_LINE_LEFT: return microcode.TID_FILTER_LINE_LEFT
            case Tid.TID_FILTER_LINE_RIGHT: return microcode.TID_FILTER_LINE_RIGHT
            case Tid.TID_FILTER_LINE_BOTH: return microcode.TID_FILTER_LINE_BOTH
            case Tid.TID_FILTER_LINE_NEITHER: return microcode.TID_FILTER_LINE_NEITHER
            case Tid.TID_ACTUATOR_SWITCH_PAGE: return microcode.TID_ACTUATOR_SWITCH_PAGE
            case Tid.TID_ACTUATOR_SPEAKER: return microcode.TID_ACTUATOR_SPEAKER
            case Tid.TID_ACTUATOR_MICROPHONE: return microcode.TID_ACTUATOR_MICROPHONE
            case Tid.TID_ACTUATOR_MUSIC: return microcode.TID_ACTUATOR_MUSIC
            case Tid.TID_ACTUATOR_PAINT: return microcode.TID_ACTUATOR_PAINT
            case Tid.TID_ACTUATOR_RADIO_SEND: return microcode.TID_ACTUATOR_RADIO_SEND
            case Tid.TID_ACTUATOR_RADIO_SET_GROUP: return microcode.TID_ACTUATOR_RADIO_SET_GROUP
            case Tid.TID_ACTUATOR_RGB_LED: return microcode.TID_ACTUATOR_RGB_LED
            case Tid.TID_ACTUATOR_CUP_X_ASSIGN: return microcode.TID_ACTUATOR_CUP_X_ASSIGN
            case Tid.TID_ACTUATOR_CUP_Y_ASSIGN: return microcode.TID_ACTUATOR_CUP_Y_ASSIGN
            case Tid.TID_ACTUATOR_CUP_Z_ASSIGN: return microcode.TID_ACTUATOR_CUP_Z_ASSIGN
            case Tid.TID_ACTUATOR_SHOW_NUMBER: return microcode.TID_ACTUATOR_SHOW_NUMBER
            case Tid.TID_MODIFIER_PAGE_1: return microcode.TID_MODIFIER_PAGE_1
            case Tid.TID_MODIFIER_PAGE_2: return microcode.TID_MODIFIER_PAGE_2
            case Tid.TID_MODIFIER_PAGE_3: return microcode.TID_MODIFIER_PAGE_3
            case Tid.TID_MODIFIER_PAGE_4: return microcode.TID_MODIFIER_PAGE_4
            case Tid.TID_MODIFIER_PAGE_5: return microcode.TID_MODIFIER_PAGE_5
            case Tid.TID_MODIFIER_COIN_1: return microcode.TID_MODIFIER_COIN_1
            case Tid.TID_MODIFIER_COIN_2: return microcode.TID_MODIFIER_COIN_2
            case Tid.TID_MODIFIER_COIN_3: return microcode.TID_MODIFIER_COIN_3
            case Tid.TID_MODIFIER_COIN_4: return microcode.TID_MODIFIER_COIN_4
            case Tid.TID_MODIFIER_COIN_5: return microcode.TID_MODIFIER_COIN_5
            case Tid.TID_MODIFIER_ICON_EDITOR: return microcode.TID_MODIFIER_ICON_EDITOR
            case Tid.TID_MODIFIER_COLOR_RED: return microcode.TID_MODIFIER_COLOR_RED
            case Tid.TID_MODIFIER_COLOR_DARKPURPLE: return microcode.TID_MODIFIER_COLOR_DARKPURPLE
            case Tid.TID_MODIFIER_EMOJI_GIGGLE: return microcode.TID_MODIFIER_EMOJI_GIGGLE
            case Tid.TID_MODIFIER_EMOJI_HAPPY: return microcode.TID_MODIFIER_EMOJI_HAPPY
            case Tid.TID_MODIFIER_EMOJI_HELLO: return microcode.TID_MODIFIER_EMOJI_HELLO
            case Tid.TID_MODIFIER_EMOJI_MYSTERIOUS: return microcode.TID_MODIFIER_EMOJI_MYSTERIOUS
            case Tid.TID_MODIFIER_EMOJI_SAD: return microcode.TID_MODIFIER_EMOJI_SAD
            case Tid.TID_MODIFIER_EMOJI_SLIDE: return microcode.TID_MODIFIER_EMOJI_SLIDE
            case Tid.TID_MODIFIER_EMOJI_SOARING: return microcode.TID_MODIFIER_EMOJI_SOARING
            case Tid.TID_MODIFIER_EMOJI_SPRING: return microcode.TID_MODIFIER_EMOJI_SPRING
            case Tid.TID_MODIFIER_EMOJI_TWINKLE: return microcode.TID_MODIFIER_EMOJI_TWINKLE
            case Tid.TID_MODIFIER_EMOJI_YAWN: return microcode.TID_MODIFIER_EMOJI_YAWN
            case Tid.TID_MODIFIER_CUP_X_READ: return microcode.TID_MODIFIER_CUP_X_READ
            case Tid.TID_MODIFIER_CUP_Y_READ: return microcode.TID_MODIFIER_CUP_Y_READ
            case Tid.TID_MODIFIER_CUP_Z_READ: return microcode.TID_MODIFIER_CUP_Z_READ
            case Tid.TID_MODIFIER_RADIO_VALUE: return microcode.TID_MODIFIER_RADIO_VALUE
            case Tid.TID_MODIFIER_RANDOM_TOSS: return microcode.TID_MODIFIER_RANDOM_TOSS
            case Tid.TID_MODIFIER_LOOP: return microcode.TID_MODIFIER_LOOP
            case Tid.TID_MODIFIER_MELODY_EDITOR: return microcode.TID_MODIFIER_MELODY_EDITOR
            case Tid.TID_MODIFIER_TEMP_READ: return microcode.TID_MODIFIER_TEMP_READ
            case Tid.TID_MODIFIER_RGB_LED_COLOR_X: return microcode.TID_MODIFIER_RGB_LED_COLOR_X
            case Tid.TID_MODIFIER_RGB_LED_COLOR_1: return microcode.TID_MODIFIER_RGB_LED_COLOR_1
            case Tid.TID_MODIFIER_RGB_LED_COLOR_2: return microcode.TID_MODIFIER_RGB_LED_COLOR_2
            case Tid.TID_MODIFIER_RGB_LED_COLOR_3: return microcode.TID_MODIFIER_RGB_LED_COLOR_3
            case Tid.TID_MODIFIER_RGB_LED_COLOR_4: return microcode.TID_MODIFIER_RGB_LED_COLOR_4
            case Tid.TID_MODIFIER_RGB_LED_COLOR_5: return microcode.TID_MODIFIER_RGB_LED_COLOR_5
            case Tid.TID_MODIFIER_RGB_LED_COLOR_6: return microcode.TID_MODIFIER_RGB_LED_COLOR_6
            case Tid.TID_MODIFIER_RGB_LED_COLOR_RAINBOW: return microcode.TID_MODIFIER_RGB_LED_COLOR_RAINBOW
            case Tid.TID_MODIFIER_RGB_LED_COLOR_SPARKLE: return microcode.TID_MODIFIER_RGB_LED_COLOR_SPARKLE
            case Tid.TID_MODIFIER_SERVO_SET_ANGLE: return microcode.TID_MODIFIER_SERVO_SET_ANGLE
            case Tid.TID_ACTUATOR_CAR: return microcode.TID_ACTUATOR_CAR
            case Tid.TID_MODIFIER_CAR_FORWARD: return microcode.TID_MODIFIER_CAR_FORWARD
            case Tid.TID_MODIFIER_CAR_REVERSE: return microcode.TID_MODIFIER_CAR_REVERSE
            case Tid.TID_MODIFIER_CAR_TURN_LEFT: return microcode.TID_MODIFIER_CAR_TURN_LEFT
            case Tid.TID_MODIFIER_CAR_TURN_RIGHT: return microcode.TID_MODIFIER_CAR_TURN_RIGHT
            case Tid.TID_MODIFIER_CAR_STOP: return microcode.TID_MODIFIER_CAR_STOP
            default: return undefined
        }
    }
}