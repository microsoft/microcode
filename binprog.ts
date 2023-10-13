namespace microcode {
    // should fit into a byte
    export enum Tid {
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
        SENSOR_END,

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
        ACTUATOR_END,
     
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
        FILTER_END,
     
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
        MODIFER_END
    }

    export function tidToEnum(t: string) {
        switch (t) {
            case TID_SENSOR_START_PAGE: return Tid.TID_SENSOR_START_PAGE
            case TID_SENSOR_PRESS: return Tid.TID_SENSOR_PRESS
            case TID_SENSOR_RELEASE: return Tid.TID_SENSOR_RELEASE
            case TID_SENSOR_ACCELEROMETER: return Tid.TID_SENSOR_ACCELEROMETER
            case TID_SENSOR_TIMER: return Tid.TID_SENSOR_TIMER
            case TID_SENSOR_LIGHT: return Tid.TID_SENSOR_LIGHT
            case TID_SENSOR_TEMP: return Tid.TID_SENSOR_TEMP
            case TID_SENSOR_RADIO_RECEIVE: return Tid.TID_SENSOR_RADIO_RECEIVE
            case TID_SENSOR_MICROPHONE: return Tid.TID_SENSOR_MICROPHONE
            case TID_SENSOR_CUP_X_WRITTEN: return Tid.TID_SENSOR_CUP_X_WRITTEN
            case TID_SENSOR_CUP_Y_WRITTEN: return Tid.TID_SENSOR_CUP_Y_WRITTEN
            case TID_SENSOR_CUP_Z_WRITTEN: return Tid.TID_SENSOR_CUP_Z_WRITTEN
            case TID_SENSOR_MAGNET: return Tid.TID_SENSOR_MAGNET
            case TID_SENSOR_SLIDER: return Tid.TID_SENSOR_SLIDER
            case TID_SENSOR_ROTARY: return Tid.TID_SENSOR_ROTARY
            case TID_SENSOR_CAR_WALL: return Tid.TID_SENSOR_CAR_WALL
            case TID_SENSOR_LINE: return Tid.TID_SENSOR_LINE
            case TID_FILTER_PIN_0: return Tid.TID_FILTER_PIN_0
            case TID_FILTER_PIN_1: return Tid.TID_FILTER_PIN_1
            case TID_FILTER_PIN_2: return Tid.TID_FILTER_PIN_2
            case TID_FILTER_BUTTON_A: return Tid.TID_FILTER_BUTTON_A
            case TID_FILTER_BUTTON_B: return Tid.TID_FILTER_BUTTON_B
            case TID_FILTER_KITA_KEY_1: return Tid.TID_FILTER_KITA_KEY_1
            case TID_FILTER_KITA_KEY_2: return Tid.TID_FILTER_KITA_KEY_2
            case TID_FILTER_LOGO: return Tid.TID_FILTER_LOGO
            case TID_FILTER_COIN_1: return Tid.TID_FILTER_COIN_1
            case TID_FILTER_COIN_2: return Tid.TID_FILTER_COIN_2
            case TID_FILTER_COIN_3: return Tid.TID_FILTER_COIN_3
            case TID_FILTER_COIN_4: return Tid.TID_FILTER_COIN_4
            case TID_FILTER_COIN_5: return Tid.TID_FILTER_COIN_5
            case TID_FILTER_TIMESPAN_SHORT: return Tid.TID_FILTER_TIMESPAN_SHORT
            case TID_FILTER_TIMESPAN_LONG: return Tid.TID_FILTER_TIMESPAN_LONG
            case TID_FILTER_LOUD: return Tid.TID_FILTER_LOUD
            case TID_FILTER_QUIET: return Tid.TID_FILTER_QUIET
            case TID_FILTER_ACCEL: return Tid.TID_FILTER_ACCEL
            case TID_FILTER_ACCEL_SHAKE: return Tid.TID_FILTER_ACCEL_SHAKE
            case TID_FILTER_ACCEL_TILT_UP: return Tid.TID_FILTER_ACCEL_TILT_UP
            case TID_FILTER_ACCEL_TILT_DOWN: return Tid.TID_FILTER_ACCEL_TILT_DOWN
            case TID_FILTER_ACCEL_TILT_LEFT: return Tid.TID_FILTER_ACCEL_TILT_LEFT
            case TID_FILTER_ACCEL_TILT_RIGHT: return Tid.TID_FILTER_ACCEL_TILT_RIGHT
            case TID_FILTER_TIMESPAN_RANDOM: return Tid.TID_FILTER_TIMESPAN_RANDOM
            case TID_FILTER_TIMESPAN_VERY_LONG: return Tid.TID_FILTER_TIMESPAN_VERY_LONG
            case TID_FILTER_CUP_X_READ: return Tid.TID_FILTER_CUP_X_READ
            case TID_FILTER_CUP_Y_READ: return Tid.TID_FILTER_CUP_Y_READ
            case TID_FILTER_CUP_Z_READ: return Tid.TID_FILTER_CUP_Z_READ
            case TID_FILTER_ROTARY_LEFT: return Tid.TID_FILTER_ROTARY_LEFT
            case TID_FILTER_ROTARY_RIGHT: return Tid.TID_FILTER_ROTARY_RIGHT
            case TID_FILTER_TEMP_WARMER: return Tid.TID_FILTER_TEMP_WARMER
            case TID_FILTER_TEMP_COLDER: return Tid.TID_FILTER_TEMP_COLDER
            case TID_FILTER_LINE_LEFT: return Tid.TID_FILTER_LINE_LEFT
            case TID_FILTER_LINE_RIGHT: return Tid.TID_FILTER_LINE_RIGHT
            case TID_FILTER_LINE_BOTH: return Tid.TID_FILTER_LINE_BOTH
            case TID_FILTER_LINE_NEITHER: return Tid.TID_FILTER_LINE_NEITHER
            case TID_ACTUATOR_SWITCH_PAGE: return Tid.TID_ACTUATOR_SWITCH_PAGE
            case TID_ACTUATOR_SPEAKER: return Tid.TID_ACTUATOR_SPEAKER
            case TID_ACTUATOR_MICROPHONE: return Tid.TID_ACTUATOR_MICROPHONE
            case TID_ACTUATOR_MUSIC: return Tid.TID_ACTUATOR_MUSIC
            case TID_ACTUATOR_PAINT: return Tid.TID_ACTUATOR_PAINT
            case TID_ACTUATOR_RADIO_SEND: return Tid.TID_ACTUATOR_RADIO_SEND
            case TID_ACTUATOR_RADIO_SET_GROUP: return Tid.TID_ACTUATOR_RADIO_SET_GROUP
            case TID_ACTUATOR_RGB_LED: return Tid.TID_ACTUATOR_RGB_LED
            case TID_ACTUATOR_CUP_X_ASSIGN: return Tid.TID_ACTUATOR_CUP_X_ASSIGN
            case TID_ACTUATOR_CUP_Y_ASSIGN: return Tid.TID_ACTUATOR_CUP_Y_ASSIGN
            case TID_ACTUATOR_CUP_Z_ASSIGN: return Tid.TID_ACTUATOR_CUP_Z_ASSIGN
            case TID_ACTUATOR_SHOW_NUMBER: return Tid.TID_ACTUATOR_SHOW_NUMBER
            case TID_MODIFIER_PAGE_1: return Tid.TID_MODIFIER_PAGE_1
            case TID_MODIFIER_PAGE_2: return Tid.TID_MODIFIER_PAGE_2
            case TID_MODIFIER_PAGE_3: return Tid.TID_MODIFIER_PAGE_3
            case TID_MODIFIER_PAGE_4: return Tid.TID_MODIFIER_PAGE_4
            case TID_MODIFIER_PAGE_5: return Tid.TID_MODIFIER_PAGE_5
            case TID_MODIFIER_COIN_1: return Tid.TID_MODIFIER_COIN_1
            case TID_MODIFIER_COIN_2: return Tid.TID_MODIFIER_COIN_2
            case TID_MODIFIER_COIN_3: return Tid.TID_MODIFIER_COIN_3
            case TID_MODIFIER_COIN_4: return Tid.TID_MODIFIER_COIN_4
            case TID_MODIFIER_COIN_5: return Tid.TID_MODIFIER_COIN_5
            case TID_MODIFIER_ICON_EDITOR: return Tid.TID_MODIFIER_ICON_EDITOR
            case TID_MODIFIER_COLOR_RED: return Tid.TID_MODIFIER_COLOR_RED
            case TID_MODIFIER_COLOR_DARKPURPLE: return Tid.TID_MODIFIER_COLOR_DARKPURPLE
            case TID_MODIFIER_EMOJI_GIGGLE: return Tid.TID_MODIFIER_EMOJI_GIGGLE
            case TID_MODIFIER_EMOJI_HAPPY: return Tid.TID_MODIFIER_EMOJI_HAPPY
            case TID_MODIFIER_EMOJI_HELLO: return Tid.TID_MODIFIER_EMOJI_HELLO
            case TID_MODIFIER_EMOJI_MYSTERIOUS: return Tid.TID_MODIFIER_EMOJI_MYSTERIOUS
            case TID_MODIFIER_EMOJI_SAD: return Tid.TID_MODIFIER_EMOJI_SAD
            case TID_MODIFIER_EMOJI_SLIDE: return Tid.TID_MODIFIER_EMOJI_SLIDE
            case TID_MODIFIER_EMOJI_SOARING: return Tid.TID_MODIFIER_EMOJI_SOARING
            case TID_MODIFIER_EMOJI_SPRING: return Tid.TID_MODIFIER_EMOJI_SPRING
            case TID_MODIFIER_EMOJI_TWINKLE: return Tid.TID_MODIFIER_EMOJI_TWINKLE
            case TID_MODIFIER_EMOJI_YAWN: return Tid.TID_MODIFIER_EMOJI_YAWN
            case TID_MODIFIER_CUP_X_READ: return Tid.TID_MODIFIER_CUP_X_READ
            case TID_MODIFIER_CUP_Y_READ: return Tid.TID_MODIFIER_CUP_Y_READ
            case TID_MODIFIER_CUP_Z_READ: return Tid.TID_MODIFIER_CUP_Z_READ
            case TID_MODIFIER_RADIO_VALUE: return Tid.TID_MODIFIER_RADIO_VALUE
            case TID_MODIFIER_RANDOM_TOSS: return Tid.TID_MODIFIER_RANDOM_TOSS
            case TID_MODIFIER_LOOP: return Tid.TID_MODIFIER_LOOP
            case TID_MODIFIER_MELODY_EDITOR: return Tid.TID_MODIFIER_MELODY_EDITOR
            case TID_MODIFIER_TEMP_READ: return Tid.TID_MODIFIER_TEMP_READ
            case TID_MODIFIER_RGB_LED_COLOR_X: return Tid.TID_MODIFIER_RGB_LED_COLOR_X
            case TID_MODIFIER_RGB_LED_COLOR_1: return Tid.TID_MODIFIER_RGB_LED_COLOR_1
            case TID_MODIFIER_RGB_LED_COLOR_2: return Tid.TID_MODIFIER_RGB_LED_COLOR_2
            case TID_MODIFIER_RGB_LED_COLOR_3: return Tid.TID_MODIFIER_RGB_LED_COLOR_3
            case TID_MODIFIER_RGB_LED_COLOR_4: return Tid.TID_MODIFIER_RGB_LED_COLOR_4
            case TID_MODIFIER_RGB_LED_COLOR_5: return Tid.TID_MODIFIER_RGB_LED_COLOR_5
            case TID_MODIFIER_RGB_LED_COLOR_6: return Tid.TID_MODIFIER_RGB_LED_COLOR_6
            case TID_MODIFIER_RGB_LED_COLOR_RAINBOW: return Tid.TID_MODIFIER_RGB_LED_COLOR_RAINBOW
            case TID_MODIFIER_RGB_LED_COLOR_SPARKLE: return Tid.TID_MODIFIER_RGB_LED_COLOR_SPARKLE
            case TID_MODIFIER_SERVO_SET_ANGLE: return Tid.TID_MODIFIER_SERVO_SET_ANGLE
            case TID_ACTUATOR_CAR: return Tid.TID_ACTUATOR_CAR
            case TID_MODIFIER_CAR_FORWARD: return Tid.TID_MODIFIER_CAR_FORWARD
            case TID_MODIFIER_CAR_REVERSE: return Tid.TID_MODIFIER_CAR_REVERSE
            case TID_MODIFIER_CAR_TURN_LEFT: return Tid.TID_MODIFIER_CAR_TURN_LEFT
            case TID_MODIFIER_CAR_TURN_RIGHT: return Tid.TID_MODIFIER_CAR_TURN_RIGHT
            case TID_MODIFIER_CAR_STOP: return Tid.TID_MODIFIER_CAR_STOP
            default: return undefined
        }
    }

    export function enumToTid(e: Tid) {
        switch (e) {
            case Tid.TID_SENSOR_START_PAGE: return TID_SENSOR_START_PAGE
            case Tid.TID_SENSOR_PRESS: return TID_SENSOR_PRESS
            case Tid.TID_SENSOR_RELEASE: return TID_SENSOR_RELEASE
            case Tid.TID_SENSOR_ACCELEROMETER: return TID_SENSOR_ACCELEROMETER
            case Tid.TID_SENSOR_TIMER: return TID_SENSOR_TIMER
            case Tid.TID_SENSOR_LIGHT: return TID_SENSOR_LIGHT
            case Tid.TID_SENSOR_TEMP: return TID_SENSOR_TEMP
            case Tid.TID_SENSOR_RADIO_RECEIVE: return TID_SENSOR_RADIO_RECEIVE
            case Tid.TID_SENSOR_MICROPHONE: return TID_SENSOR_MICROPHONE
            case Tid.TID_SENSOR_CUP_X_WRITTEN: return TID_SENSOR_CUP_X_WRITTEN
            case Tid.TID_SENSOR_CUP_Y_WRITTEN: return TID_SENSOR_CUP_Y_WRITTEN
            case Tid.TID_SENSOR_CUP_Z_WRITTEN: return TID_SENSOR_CUP_Z_WRITTEN
            case Tid.TID_SENSOR_MAGNET: return TID_SENSOR_MAGNET
            case Tid.TID_SENSOR_SLIDER: return TID_SENSOR_SLIDER
            case Tid.TID_SENSOR_ROTARY: return TID_SENSOR_ROTARY
            case Tid.TID_SENSOR_CAR_WALL: return TID_SENSOR_CAR_WALL
            case Tid.TID_SENSOR_LINE: return TID_SENSOR_LINE
            case Tid.TID_FILTER_PIN_0: return TID_FILTER_PIN_0
            case Tid.TID_FILTER_PIN_1: return TID_FILTER_PIN_1
            case Tid.TID_FILTER_PIN_2: return TID_FILTER_PIN_2
            case Tid.TID_FILTER_BUTTON_A: return TID_FILTER_BUTTON_A
            case Tid.TID_FILTER_BUTTON_B: return TID_FILTER_BUTTON_B
            case Tid.TID_FILTER_KITA_KEY_1: return TID_FILTER_KITA_KEY_1
            case Tid.TID_FILTER_KITA_KEY_2: return TID_FILTER_KITA_KEY_2
            case Tid.TID_FILTER_LOGO: return TID_FILTER_LOGO
            case Tid.TID_FILTER_COIN_1: return TID_FILTER_COIN_1
            case Tid.TID_FILTER_COIN_2: return TID_FILTER_COIN_2
            case Tid.TID_FILTER_COIN_3: return TID_FILTER_COIN_3
            case Tid.TID_FILTER_COIN_4: return TID_FILTER_COIN_4
            case Tid.TID_FILTER_COIN_5: return TID_FILTER_COIN_5
            case Tid.TID_FILTER_TIMESPAN_SHORT: return TID_FILTER_TIMESPAN_SHORT
            case Tid.TID_FILTER_TIMESPAN_LONG: return TID_FILTER_TIMESPAN_LONG
            case Tid.TID_FILTER_LOUD: return TID_FILTER_LOUD
            case Tid.TID_FILTER_QUIET: return TID_FILTER_QUIET
            case Tid.TID_FILTER_ACCEL: return TID_FILTER_ACCEL
            case Tid.TID_FILTER_ACCEL_SHAKE: return TID_FILTER_ACCEL_SHAKE
            case Tid.TID_FILTER_ACCEL_TILT_UP: return TID_FILTER_ACCEL_TILT_UP
            case Tid.TID_FILTER_ACCEL_TILT_DOWN: return TID_FILTER_ACCEL_TILT_DOWN
            case Tid.TID_FILTER_ACCEL_TILT_LEFT: return TID_FILTER_ACCEL_TILT_LEFT
            case Tid.TID_FILTER_ACCEL_TILT_RIGHT: return TID_FILTER_ACCEL_TILT_RIGHT
            case Tid.TID_FILTER_TIMESPAN_RANDOM: return TID_FILTER_TIMESPAN_RANDOM
            case Tid.TID_FILTER_TIMESPAN_VERY_LONG: return TID_FILTER_TIMESPAN_VERY_LONG
            case Tid.TID_FILTER_CUP_X_READ: return TID_FILTER_CUP_X_READ
            case Tid.TID_FILTER_CUP_Y_READ: return TID_FILTER_CUP_Y_READ
            case Tid.TID_FILTER_CUP_Z_READ: return TID_FILTER_CUP_Z_READ
            case Tid.TID_FILTER_ROTARY_LEFT: return TID_FILTER_ROTARY_LEFT
            case Tid.TID_FILTER_ROTARY_RIGHT: return TID_FILTER_ROTARY_RIGHT
            case Tid.TID_FILTER_TEMP_WARMER: return TID_FILTER_TEMP_WARMER
            case Tid.TID_FILTER_TEMP_COLDER: return TID_FILTER_TEMP_COLDER
            case Tid.TID_FILTER_LINE_LEFT: return TID_FILTER_LINE_LEFT
            case Tid.TID_FILTER_LINE_RIGHT: return TID_FILTER_LINE_RIGHT
            case Tid.TID_FILTER_LINE_BOTH: return TID_FILTER_LINE_BOTH
            case Tid.TID_FILTER_LINE_NEITHER: return TID_FILTER_LINE_NEITHER
            case Tid.TID_ACTUATOR_SWITCH_PAGE: return TID_ACTUATOR_SWITCH_PAGE
            case Tid.TID_ACTUATOR_SPEAKER: return TID_ACTUATOR_SPEAKER
            case Tid.TID_ACTUATOR_MICROPHONE: return TID_ACTUATOR_MICROPHONE
            case Tid.TID_ACTUATOR_MUSIC: return TID_ACTUATOR_MUSIC
            case Tid.TID_ACTUATOR_PAINT: return TID_ACTUATOR_PAINT
            case Tid.TID_ACTUATOR_RADIO_SEND: return TID_ACTUATOR_RADIO_SEND
            case Tid.TID_ACTUATOR_RADIO_SET_GROUP: return TID_ACTUATOR_RADIO_SET_GROUP
            case Tid.TID_ACTUATOR_RGB_LED: return TID_ACTUATOR_RGB_LED
            case Tid.TID_ACTUATOR_CUP_X_ASSIGN: return TID_ACTUATOR_CUP_X_ASSIGN
            case Tid.TID_ACTUATOR_CUP_Y_ASSIGN: return TID_ACTUATOR_CUP_Y_ASSIGN
            case Tid.TID_ACTUATOR_CUP_Z_ASSIGN: return TID_ACTUATOR_CUP_Z_ASSIGN
            case Tid.TID_ACTUATOR_SHOW_NUMBER: return TID_ACTUATOR_SHOW_NUMBER
            case Tid.TID_MODIFIER_PAGE_1: return TID_MODIFIER_PAGE_1
            case Tid.TID_MODIFIER_PAGE_2: return TID_MODIFIER_PAGE_2
            case Tid.TID_MODIFIER_PAGE_3: return TID_MODIFIER_PAGE_3
            case Tid.TID_MODIFIER_PAGE_4: return TID_MODIFIER_PAGE_4
            case Tid.TID_MODIFIER_PAGE_5: return TID_MODIFIER_PAGE_5
            case Tid.TID_MODIFIER_COIN_1: return TID_MODIFIER_COIN_1
            case Tid.TID_MODIFIER_COIN_2: return TID_MODIFIER_COIN_2
            case Tid.TID_MODIFIER_COIN_3: return TID_MODIFIER_COIN_3
            case Tid.TID_MODIFIER_COIN_4: return TID_MODIFIER_COIN_4
            case Tid.TID_MODIFIER_COIN_5: return TID_MODIFIER_COIN_5
            case Tid.TID_MODIFIER_ICON_EDITOR: return TID_MODIFIER_ICON_EDITOR
            case Tid.TID_MODIFIER_COLOR_RED: return TID_MODIFIER_COLOR_RED
            case Tid.TID_MODIFIER_COLOR_DARKPURPLE: return TID_MODIFIER_COLOR_DARKPURPLE
            case Tid.TID_MODIFIER_EMOJI_GIGGLE: return TID_MODIFIER_EMOJI_GIGGLE
            case Tid.TID_MODIFIER_EMOJI_HAPPY: return TID_MODIFIER_EMOJI_HAPPY
            case Tid.TID_MODIFIER_EMOJI_HELLO: return TID_MODIFIER_EMOJI_HELLO
            case Tid.TID_MODIFIER_EMOJI_MYSTERIOUS: return TID_MODIFIER_EMOJI_MYSTERIOUS
            case Tid.TID_MODIFIER_EMOJI_SAD: return TID_MODIFIER_EMOJI_SAD
            case Tid.TID_MODIFIER_EMOJI_SLIDE: return TID_MODIFIER_EMOJI_SLIDE
            case Tid.TID_MODIFIER_EMOJI_SOARING: return TID_MODIFIER_EMOJI_SOARING
            case Tid.TID_MODIFIER_EMOJI_SPRING: return TID_MODIFIER_EMOJI_SPRING
            case Tid.TID_MODIFIER_EMOJI_TWINKLE: return TID_MODIFIER_EMOJI_TWINKLE
            case Tid.TID_MODIFIER_EMOJI_YAWN: return TID_MODIFIER_EMOJI_YAWN
            case Tid.TID_MODIFIER_CUP_X_READ: return TID_MODIFIER_CUP_X_READ
            case Tid.TID_MODIFIER_CUP_Y_READ: return TID_MODIFIER_CUP_Y_READ
            case Tid.TID_MODIFIER_CUP_Z_READ: return TID_MODIFIER_CUP_Z_READ
            case Tid.TID_MODIFIER_RADIO_VALUE: return TID_MODIFIER_RADIO_VALUE
            case Tid.TID_MODIFIER_RANDOM_TOSS: return TID_MODIFIER_RANDOM_TOSS
            case Tid.TID_MODIFIER_LOOP: return TID_MODIFIER_LOOP
            case Tid.TID_MODIFIER_MELODY_EDITOR: return TID_MODIFIER_MELODY_EDITOR
            case Tid.TID_MODIFIER_TEMP_READ: return TID_MODIFIER_TEMP_READ
            case Tid.TID_MODIFIER_RGB_LED_COLOR_X: return TID_MODIFIER_RGB_LED_COLOR_X
            case Tid.TID_MODIFIER_RGB_LED_COLOR_1: return TID_MODIFIER_RGB_LED_COLOR_1
            case Tid.TID_MODIFIER_RGB_LED_COLOR_2: return TID_MODIFIER_RGB_LED_COLOR_2
            case Tid.TID_MODIFIER_RGB_LED_COLOR_3: return TID_MODIFIER_RGB_LED_COLOR_3
            case Tid.TID_MODIFIER_RGB_LED_COLOR_4: return TID_MODIFIER_RGB_LED_COLOR_4
            case Tid.TID_MODIFIER_RGB_LED_COLOR_5: return TID_MODIFIER_RGB_LED_COLOR_5
            case Tid.TID_MODIFIER_RGB_LED_COLOR_6: return TID_MODIFIER_RGB_LED_COLOR_6
            case Tid.TID_MODIFIER_RGB_LED_COLOR_RAINBOW: return TID_MODIFIER_RGB_LED_COLOR_RAINBOW
            case Tid.TID_MODIFIER_RGB_LED_COLOR_SPARKLE: return TID_MODIFIER_RGB_LED_COLOR_SPARKLE
            case Tid.TID_MODIFIER_SERVO_SET_ANGLE: return TID_MODIFIER_SERVO_SET_ANGLE
            case Tid.TID_ACTUATOR_CAR: return TID_ACTUATOR_CAR
            case Tid.TID_MODIFIER_CAR_FORWARD: return TID_MODIFIER_CAR_FORWARD
            case Tid.TID_MODIFIER_CAR_REVERSE: return TID_MODIFIER_CAR_REVERSE
            case Tid.TID_MODIFIER_CAR_TURN_LEFT: return TID_MODIFIER_CAR_TURN_LEFT
            case Tid.TID_MODIFIER_CAR_TURN_RIGHT: return TID_MODIFIER_CAR_TURN_RIGHT
            case Tid.TID_MODIFIER_CAR_STOP: return TID_MODIFIER_CAR_STOP
            default: return undefined
        }
    }

    export function toFieldEditor(tid: Tid) {
        if (tid == Tid.TID_MODIFIER_ICON_EDITOR)
            return "icon-editor"
        else if (tid == Tid.TID_MODIFIER_MELODY_EDITOR)
            return "melody-editor"
        return undefined
    }

    function assert(cond: boolean, msg?: string) {
        if (!cond) {
            if (msg == null) msg = "Assertion failed"
            throw msg
        }
    }

    // use this to manage a buffer that may grow
    export class BufferWriter {
        private buf: Buffer
        private ptr: number = 0

        constructor() {
            this.buf = Buffer.create(128)
        }

        public get buffer() { return this.buf }

        public writeByte(v: number) {
            assert(0 <= v && v <= 0xff && (v | 0) == v)
            if (this.ptr >= this.buf.length) {
                const copy = Buffer.create(this.buf.length * 2)
                copy.write(0, this.buf)
                this.buf = copy
            }
            this.buf[this.ptr++] = v
        }

        public writeBuffer(b: Buffer) {
            for (let i = 0; i < b.length; ++i)
                this.writeByte(b[i])
        }
    }

    export class BufferReader {
        constructor(private buf: Buffer, private ptr: number = 0) {
        }

        public get buffer() { return this.buf }

        public eof() {
            return this.ptr >= this.buf.length
        }

        public peekByte() {
            assert(this.ptr < this.buf.length)
            return this.buf[this.ptr]
        }

        public readByte() {
            assert(this.ptr < this.buf.length)
            return this.buf[this.ptr++]
        }

        public readBuffer(len: number) {
            assert(this.ptr + len <= this.buf.length)
            const b = Buffer.create(len)
            for (let i = 0; i < len; ++i)
                b[i] = this.buf[this.ptr++]
            return b
        }
    }
}