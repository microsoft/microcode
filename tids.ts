namespace microcode {
    // Once a tid is assigned, it can NEVER BE CHANGED OR REPURPOSED.
    // Every tid must be unique in the set of all tids.
    export const TID_SENSOR_START_PAGE = "S1"
    export const TID_SENSOR_PRESS = "S2"
    export const TID_SENSOR_RELEASE = "S2B"
    export const TID_SENSOR_ACCELEROMETER = "S3"
    export const TID_SENSOR_TIMER = "S4"
    export const TID_SENSOR_LIGHT = "S5"
    export const TID_SENSOR_TEMP = "S6"
    export const TID_SENSOR_RADIO_RECEIVE = "S7"
    export const TID_SENSOR_MICROPHONE = "S8"
    export const TID_SENSOR_CUP_X_WRITTEN = "S9A"
    export const TID_SENSOR_CUP_Y_WRITTEN = "S9B"
    export const TID_SENSOR_CUP_Z_WRITTEN = "S9C"
    export const TID_SENSOR_MAGNET = "S10"
    export const TID_SENSOR_SLIDER = "S11"
    export const TID_SENSOR_ROTARY = "S12"
    export const TID_SENSOR_CAR_WALL = "S13"
    export const TID_SENSOR_LINE = "S14"

    // filters for TID_SENSOR_PRESS
    export const TID_FILTER_PIN_0 = "F0"
    export const TID_FILTER_PIN_1 = "F1"
    export const TID_FILTER_PIN_2 = "F2"
    export const TID_FILTER_BUTTON_A = "F3"
    export const TID_FILTER_BUTTON_B = "F4"
    export const TID_FILTER_KITA_KEY_1 = "F5"
    export const TID_FILTER_KITA_KEY_2 = "F6"

    export const TID_FILTER_LOGO = "F7"
    export const TID_FILTER_COIN_1 = "F8"
    export const TID_FILTER_COIN_2 = "F9"
    export const TID_FILTER_COIN_3 = "F10"
    export const TID_FILTER_COIN_4 = "F11"
    export const TID_FILTER_COIN_5 = "F12"
    export const TID_FILTER_TIMESPAN_SHORT = "F13"
    export const TID_FILTER_TIMESPAN_LONG = "F14"
    export const TID_FILTER_LOUD = "F15"
    export const TID_FILTER_QUIET = "F16"
    export const TID_FILTER_ACCEL = "F17"
    export const TID_FILTER_ACCEL_SHAKE = "F17_shake"
    export const TID_FILTER_ACCEL_TILT_UP = "F17_tilt_up"
    export const TID_FILTER_ACCEL_TILT_DOWN = "F17_tilt_down"
    export const TID_FILTER_ACCEL_TILT_LEFT = "F17_tilt_left"
    export const TID_FILTER_ACCEL_TILT_RIGHT = "F17_tilt_right"
    export const TID_FILTER_TIMESPAN_RANDOM = "F18"
    export const TID_FILTER_TIMESPAN_VERY_LONG = "F19"
    export const TID_FILTER_CUP_X_READ = "F20A"
    export const TID_FILTER_CUP_Y_READ = "F20B"
    export const TID_FILTER_CUP_Z_READ = "F20C"
    export const TID_FILTER_ROTARY_LEFT = "F21L"
    export const TID_FILTER_ROTARY_RIGHT = "F21R"
    export const TID_FILTER_TEMP_WARMER = "F22U"
    export const TID_FILTER_TEMP_COLDER = "F22D"
    export const TID_FILTER_LINE_LEFT = "F23L"
    export const TID_FILTER_LINE_RIGHT = "F23R"
    export const TID_FILTER_LINE_BOTH = "F23B"
    export const TID_FILTER_LINE_NEITHER = "F23N"
    export const TID_FILTER_LINE_NEITHER_LEFT = "F23NL"
    export const TID_FILTER_LINE_NEITHER_RIGHT = "F23NR"

    export const TID_ACTUATOR_SWITCH_PAGE = "A1"
    export const TID_ACTUATOR_SPEAKER = "A2"
    export const TID_ACTUATOR_MICROPHONE = "A3"
    export const TID_ACTUATOR_MUSIC = "A4"
    export const TID_ACTUATOR_PAINT = "A5"
    export const TID_ACTUATOR_RADIO_SEND = "A6"
    export const TID_ACTUATOR_RADIO_SET_GROUP = "A6A"
    export const TID_ACTUATOR_RGB_LED = "A8"
    export const TID_ACTUATOR_CUP_X_ASSIGN = "A9A"
    export const TID_ACTUATOR_CUP_Y_ASSIGN = "A9B"
    export const TID_ACTUATOR_CUP_Z_ASSIGN = "A9C"
    export const TID_ACTUATOR_SHOW_NUMBER = "A10"

    export const TID_MODIFIER_PAGE_1 = "M1"
    export const TID_MODIFIER_PAGE_2 = "M2"
    export const TID_MODIFIER_PAGE_3 = "M3"
    export const TID_MODIFIER_PAGE_4 = "M4"
    export const TID_MODIFIER_PAGE_5 = "M5"

    export const TID_MODIFIER_COIN_1 = "M6"
    export const TID_MODIFIER_COIN_2 = "M7"
    export const TID_MODIFIER_COIN_3 = "M8"
    export const TID_MODIFIER_COIN_4 = "M9"
    export const TID_MODIFIER_COIN_5 = "M10"

    export const TID_MODIFIER_ICON_EDITOR = "M15"
    export const TID_MODIFIER_COLOR_RED = "M16"
    export const TID_MODIFIER_COLOR_DARKPURPLE = "M17"

    export const TID_MODIFIER_EMOJI_GIGGLE = "M19giggle"
    export const TID_MODIFIER_EMOJI_HAPPY = "M19happy"
    export const TID_MODIFIER_EMOJI_HELLO = "M19hello"
    export const TID_MODIFIER_EMOJI_MYSTERIOUS = "M19mysterious"
    export const TID_MODIFIER_EMOJI_SAD = "M19sad"
    export const TID_MODIFIER_EMOJI_SLIDE = "M19slide"
    export const TID_MODIFIER_EMOJI_SOARING = "M19soaring"
    export const TID_MODIFIER_EMOJI_SPRING = "M19spring"
    export const TID_MODIFIER_EMOJI_TWINKLE = "M19twinkle"
    export const TID_MODIFIER_EMOJI_YAWN = "M19yawn"

    export const TID_MODIFIER_CUP_X_READ = "M20A"
    export const TID_MODIFIER_CUP_Y_READ = "M20B"
    export const TID_MODIFIER_CUP_Z_READ = "M20C"
    export const TID_MODIFIER_RADIO_VALUE = "M21"
    export const TID_MODIFIER_RANDOM_TOSS = "M22"
    export const TID_MODIFIER_LOOP = "M23"
    export const TID_MODIFIER_MELODY_EDITOR = "M24"
    export const TID_MODIFIER_TEMP_READ = "M25"

    export const TID_MODIFIER_RGB_LED_COLOR_X = "A20_"
    export const TID_MODIFIER_RGB_LED_COLOR_1 = "A20_1"
    export const TID_MODIFIER_RGB_LED_COLOR_2 = "A20_2"
    export const TID_MODIFIER_RGB_LED_COLOR_3 = "A20_3"
    export const TID_MODIFIER_RGB_LED_COLOR_4 = "A20_4"
    export const TID_MODIFIER_RGB_LED_COLOR_5 = "A20_5"
    export const TID_MODIFIER_RGB_LED_COLOR_6 = "A20_6"
    export const TID_MODIFIER_RGB_LED_COLOR_RAINBOW = "A20_rainbow"
    export const TID_MODIFIER_RGB_LED_COLOR_SPARKLE = "A20_sparkle"

    export const TID_ACTUATOR_SERVO_SET_ANGLE = "A21_"

    export const TID_ACTUATOR_CAR = "CAR"
    export const TID_MODIFIER_CAR_FORWARD = "CAR1"
    export const TID_MODIFIER_CAR_REVERSE = "CAR2"
    export const TID_MODIFIER_CAR_TURN_LEFT = "CAR3"
    export const TID_MODIFIER_CAR_TURN_RIGHT = "CAR4"
    export const TID_MODIFIER_CAR_STOP = "CAR5"
    export const TID_MODIFIER_CAR_FORWARD_FAST = "CAR6"
    export const TID_MODIFIER_CAR_SPIN_LEFT = "CAR7"
    export const TID_MODIFIER_CAR_SPIN_RIGHT = "CAR8"
    export const TID_MODIFIER_CAR_LED_COLOR_1 = "CAR9"
    export const TID_MODIFIER_CAR_LED_COLOR_2 = "CAR10"
    export const TID_MODIFIER_CAR_LED_COLOR_3 = "CAR11"

    // should fit into a byte
    export enum Tid {
        // we need markers to indicate the end of a program, page
        END_OF_PROG = 0,
        END_OF_PAGE,

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
        TID_ACTUATOR_SERVO_SET_ANGLE,
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
        TID_FILTER_TIMESPAN_RANDOM,
        TID_FILTER_TIMESPAN_VERY_LONG,
        TID_FILTER_LOUD,
        TID_FILTER_QUIET,
        TID_FILTER_ACCEL,
        TID_FILTER_ACCEL_SHAKE,
        TID_FILTER_ACCEL_TILT_UP,
        TID_FILTER_ACCEL_TILT_DOWN,
        TID_FILTER_ACCEL_TILT_LEFT,
        TID_FILTER_ACCEL_TILT_RIGHT,
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
        TID_FILTER_LINE_NEITHER_LEFT,
        TID_FILTER_LINE_NEITHER_RIGHT,
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
        TID_MODIFIER_CAR_FORWARD,
        TID_MODIFIER_CAR_REVERSE,
        TID_MODIFIER_CAR_TURN_LEFT,
        TID_MODIFIER_CAR_TURN_RIGHT,
        TID_MODIFIER_CAR_STOP,
        TID_MODIFIER_CAR_FORWARD_FAST,
        TID_MODIFIER_CAR_SPIN_LEFT,
        TID_MODIFIER_CAR_SPIN_RIGHT,
        TID_MODIFIER_CAR_LED_COLOR_1,
        TID_MODIFIER_CAR_LED_COLOR_2,
        TID_MODIFIER_CAR_LED_COLOR_3,
        MODIFER_END,
    }

    export function tidToEnum(t: string) {
        switch (t) {
            case TID_SENSOR_START_PAGE:
                return Tid.TID_SENSOR_START_PAGE
            case TID_SENSOR_PRESS:
                return Tid.TID_SENSOR_PRESS
            case TID_SENSOR_RELEASE:
                return Tid.TID_SENSOR_RELEASE
            case TID_SENSOR_ACCELEROMETER:
                return Tid.TID_SENSOR_ACCELEROMETER
            case TID_SENSOR_TIMER:
                return Tid.TID_SENSOR_TIMER
            case TID_SENSOR_LIGHT:
                return Tid.TID_SENSOR_LIGHT
            case TID_SENSOR_TEMP:
                return Tid.TID_SENSOR_TEMP
            case TID_SENSOR_RADIO_RECEIVE:
                return Tid.TID_SENSOR_RADIO_RECEIVE
            case TID_SENSOR_MICROPHONE:
                return Tid.TID_SENSOR_MICROPHONE
            case TID_SENSOR_CUP_X_WRITTEN:
                return Tid.TID_SENSOR_CUP_X_WRITTEN
            case TID_SENSOR_CUP_Y_WRITTEN:
                return Tid.TID_SENSOR_CUP_Y_WRITTEN
            case TID_SENSOR_CUP_Z_WRITTEN:
                return Tid.TID_SENSOR_CUP_Z_WRITTEN
            case TID_SENSOR_MAGNET:
                return Tid.TID_SENSOR_MAGNET
            case TID_SENSOR_SLIDER:
                return Tid.TID_SENSOR_SLIDER
            case TID_SENSOR_ROTARY:
                return Tid.TID_SENSOR_ROTARY
            case TID_SENSOR_CAR_WALL:
                return Tid.TID_SENSOR_CAR_WALL
            case TID_SENSOR_LINE:
                return Tid.TID_SENSOR_LINE
            case TID_FILTER_PIN_0:
                return Tid.TID_FILTER_PIN_0
            case TID_FILTER_PIN_1:
                return Tid.TID_FILTER_PIN_1
            case TID_FILTER_PIN_2:
                return Tid.TID_FILTER_PIN_2
            case TID_FILTER_BUTTON_A:
                return Tid.TID_FILTER_BUTTON_A
            case TID_FILTER_BUTTON_B:
                return Tid.TID_FILTER_BUTTON_B
            case TID_FILTER_KITA_KEY_1:
                return Tid.TID_FILTER_KITA_KEY_1
            case TID_FILTER_KITA_KEY_2:
                return Tid.TID_FILTER_KITA_KEY_2
            case TID_FILTER_LOGO:
                return Tid.TID_FILTER_LOGO
            case TID_FILTER_COIN_1:
                return Tid.TID_FILTER_COIN_1
            case TID_FILTER_COIN_2:
                return Tid.TID_FILTER_COIN_2
            case TID_FILTER_COIN_3:
                return Tid.TID_FILTER_COIN_3
            case TID_FILTER_COIN_4:
                return Tid.TID_FILTER_COIN_4
            case TID_FILTER_COIN_5:
                return Tid.TID_FILTER_COIN_5
            case TID_FILTER_TIMESPAN_SHORT:
                return Tid.TID_FILTER_TIMESPAN_SHORT
            case TID_FILTER_TIMESPAN_LONG:
                return Tid.TID_FILTER_TIMESPAN_LONG
            case TID_FILTER_LOUD:
                return Tid.TID_FILTER_LOUD
            case TID_FILTER_QUIET:
                return Tid.TID_FILTER_QUIET
            case TID_FILTER_ACCEL:
                return Tid.TID_FILTER_ACCEL
            case TID_FILTER_ACCEL_SHAKE:
                return Tid.TID_FILTER_ACCEL_SHAKE
            case TID_FILTER_ACCEL_TILT_UP:
                return Tid.TID_FILTER_ACCEL_TILT_UP
            case TID_FILTER_ACCEL_TILT_DOWN:
                return Tid.TID_FILTER_ACCEL_TILT_DOWN
            case TID_FILTER_ACCEL_TILT_LEFT:
                return Tid.TID_FILTER_ACCEL_TILT_LEFT
            case TID_FILTER_ACCEL_TILT_RIGHT:
                return Tid.TID_FILTER_ACCEL_TILT_RIGHT
            case TID_FILTER_TIMESPAN_RANDOM:
                return Tid.TID_FILTER_TIMESPAN_RANDOM
            case TID_FILTER_TIMESPAN_VERY_LONG:
                return Tid.TID_FILTER_TIMESPAN_VERY_LONG
            case TID_FILTER_CUP_X_READ:
                return Tid.TID_FILTER_CUP_X_READ
            case TID_FILTER_CUP_Y_READ:
                return Tid.TID_FILTER_CUP_Y_READ
            case TID_FILTER_CUP_Z_READ:
                return Tid.TID_FILTER_CUP_Z_READ
            case TID_FILTER_ROTARY_LEFT:
                return Tid.TID_FILTER_ROTARY_LEFT
            case TID_FILTER_ROTARY_RIGHT:
                return Tid.TID_FILTER_ROTARY_RIGHT
            case TID_FILTER_TEMP_WARMER:
                return Tid.TID_FILTER_TEMP_WARMER
            case TID_FILTER_TEMP_COLDER:
                return Tid.TID_FILTER_TEMP_COLDER
            case TID_FILTER_LINE_LEFT:
                return Tid.TID_FILTER_LINE_LEFT
            case TID_FILTER_LINE_RIGHT:
                return Tid.TID_FILTER_LINE_RIGHT
            case TID_FILTER_LINE_BOTH:
                return Tid.TID_FILTER_LINE_BOTH
            case TID_FILTER_LINE_NEITHER:
                return Tid.TID_FILTER_LINE_NEITHER
            case TID_FILTER_LINE_NEITHER_LEFT:
                return Tid.TID_FILTER_LINE_NEITHER_LEFT
            case TID_FILTER_LINE_NEITHER_RIGHT:
                return Tid.TID_FILTER_LINE_NEITHER_RIGHT
            case TID_ACTUATOR_SWITCH_PAGE:
                return Tid.TID_ACTUATOR_SWITCH_PAGE
            case TID_ACTUATOR_SPEAKER:
                return Tid.TID_ACTUATOR_SPEAKER
            case TID_ACTUATOR_MICROPHONE:
                return Tid.TID_ACTUATOR_MICROPHONE
            case TID_ACTUATOR_MUSIC:
                return Tid.TID_ACTUATOR_MUSIC
            case TID_ACTUATOR_PAINT:
                return Tid.TID_ACTUATOR_PAINT
            case TID_ACTUATOR_RADIO_SEND:
                return Tid.TID_ACTUATOR_RADIO_SEND
            case TID_ACTUATOR_RADIO_SET_GROUP:
                return Tid.TID_ACTUATOR_RADIO_SET_GROUP
            case TID_ACTUATOR_RGB_LED:
                return Tid.TID_ACTUATOR_RGB_LED
            case TID_ACTUATOR_CUP_X_ASSIGN:
                return Tid.TID_ACTUATOR_CUP_X_ASSIGN
            case TID_ACTUATOR_CUP_Y_ASSIGN:
                return Tid.TID_ACTUATOR_CUP_Y_ASSIGN
            case TID_ACTUATOR_CUP_Z_ASSIGN:
                return Tid.TID_ACTUATOR_CUP_Z_ASSIGN
            case TID_ACTUATOR_SHOW_NUMBER:
                return Tid.TID_ACTUATOR_SHOW_NUMBER
            case TID_MODIFIER_PAGE_1:
                return Tid.TID_MODIFIER_PAGE_1
            case TID_MODIFIER_PAGE_2:
                return Tid.TID_MODIFIER_PAGE_2
            case TID_MODIFIER_PAGE_3:
                return Tid.TID_MODIFIER_PAGE_3
            case TID_MODIFIER_PAGE_4:
                return Tid.TID_MODIFIER_PAGE_4
            case TID_MODIFIER_PAGE_5:
                return Tid.TID_MODIFIER_PAGE_5
            case TID_MODIFIER_COIN_1:
                return Tid.TID_MODIFIER_COIN_1
            case TID_MODIFIER_COIN_2:
                return Tid.TID_MODIFIER_COIN_2
            case TID_MODIFIER_COIN_3:
                return Tid.TID_MODIFIER_COIN_3
            case TID_MODIFIER_COIN_4:
                return Tid.TID_MODIFIER_COIN_4
            case TID_MODIFIER_COIN_5:
                return Tid.TID_MODIFIER_COIN_5
            case TID_MODIFIER_ICON_EDITOR:
                return Tid.TID_MODIFIER_ICON_EDITOR
            case TID_MODIFIER_COLOR_RED:
                return Tid.TID_MODIFIER_COLOR_RED
            case TID_MODIFIER_COLOR_DARKPURPLE:
                return Tid.TID_MODIFIER_COLOR_DARKPURPLE
            case TID_MODIFIER_EMOJI_GIGGLE:
                return Tid.TID_MODIFIER_EMOJI_GIGGLE
            case TID_MODIFIER_EMOJI_HAPPY:
                return Tid.TID_MODIFIER_EMOJI_HAPPY
            case TID_MODIFIER_EMOJI_HELLO:
                return Tid.TID_MODIFIER_EMOJI_HELLO
            case TID_MODIFIER_EMOJI_MYSTERIOUS:
                return Tid.TID_MODIFIER_EMOJI_MYSTERIOUS
            case TID_MODIFIER_EMOJI_SAD:
                return Tid.TID_MODIFIER_EMOJI_SAD
            case TID_MODIFIER_EMOJI_SLIDE:
                return Tid.TID_MODIFIER_EMOJI_SLIDE
            case TID_MODIFIER_EMOJI_SOARING:
                return Tid.TID_MODIFIER_EMOJI_SOARING
            case TID_MODIFIER_EMOJI_SPRING:
                return Tid.TID_MODIFIER_EMOJI_SPRING
            case TID_MODIFIER_EMOJI_TWINKLE:
                return Tid.TID_MODIFIER_EMOJI_TWINKLE
            case TID_MODIFIER_EMOJI_YAWN:
                return Tid.TID_MODIFIER_EMOJI_YAWN
            case TID_MODIFIER_CUP_X_READ:
                return Tid.TID_MODIFIER_CUP_X_READ
            case TID_MODIFIER_CUP_Y_READ:
                return Tid.TID_MODIFIER_CUP_Y_READ
            case TID_MODIFIER_CUP_Z_READ:
                return Tid.TID_MODIFIER_CUP_Z_READ
            case TID_MODIFIER_RADIO_VALUE:
                return Tid.TID_MODIFIER_RADIO_VALUE
            case TID_MODIFIER_RANDOM_TOSS:
                return Tid.TID_MODIFIER_RANDOM_TOSS
            case TID_MODIFIER_LOOP:
                return Tid.TID_MODIFIER_LOOP
            case TID_MODIFIER_MELODY_EDITOR:
                return Tid.TID_MODIFIER_MELODY_EDITOR
            case TID_MODIFIER_TEMP_READ:
                return Tid.TID_MODIFIER_TEMP_READ
            case TID_MODIFIER_RGB_LED_COLOR_X:
                return Tid.TID_MODIFIER_RGB_LED_COLOR_X
            case TID_MODIFIER_RGB_LED_COLOR_1:
                return Tid.TID_MODIFIER_RGB_LED_COLOR_1
            case TID_MODIFIER_RGB_LED_COLOR_2:
                return Tid.TID_MODIFIER_RGB_LED_COLOR_2
            case TID_MODIFIER_RGB_LED_COLOR_3:
                return Tid.TID_MODIFIER_RGB_LED_COLOR_3
            case TID_MODIFIER_RGB_LED_COLOR_4:
                return Tid.TID_MODIFIER_RGB_LED_COLOR_4
            case TID_MODIFIER_RGB_LED_COLOR_5:
                return Tid.TID_MODIFIER_RGB_LED_COLOR_5
            case TID_MODIFIER_RGB_LED_COLOR_6:
                return Tid.TID_MODIFIER_RGB_LED_COLOR_6
            case TID_MODIFIER_RGB_LED_COLOR_RAINBOW:
                return Tid.TID_MODIFIER_RGB_LED_COLOR_RAINBOW
            case TID_MODIFIER_RGB_LED_COLOR_SPARKLE:
                return Tid.TID_MODIFIER_RGB_LED_COLOR_SPARKLE
            case TID_ACTUATOR_SERVO_SET_ANGLE:
                return Tid.TID_ACTUATOR_SERVO_SET_ANGLE
            case TID_ACTUATOR_CAR:
                return Tid.TID_ACTUATOR_CAR
            case TID_MODIFIER_CAR_FORWARD:
                return Tid.TID_MODIFIER_CAR_FORWARD
            case TID_MODIFIER_CAR_REVERSE:
                return Tid.TID_MODIFIER_CAR_REVERSE
            case TID_MODIFIER_CAR_TURN_LEFT:
                return Tid.TID_MODIFIER_CAR_TURN_LEFT
            case TID_MODIFIER_CAR_TURN_RIGHT:
                return Tid.TID_MODIFIER_CAR_TURN_RIGHT
            case TID_MODIFIER_CAR_STOP:
                return Tid.TID_MODIFIER_CAR_STOP
            case TID_MODIFIER_CAR_FORWARD_FAST:
                return Tid.TID_MODIFIER_CAR_FORWARD_FAST
            case TID_MODIFIER_CAR_SPIN_LEFT:
                return Tid.TID_MODIFIER_CAR_SPIN_LEFT
            case TID_MODIFIER_CAR_SPIN_RIGHT:
                return Tid.TID_MODIFIER_CAR_SPIN_RIGHT
            case TID_MODIFIER_CAR_LED_COLOR_1:
                return Tid.TID_MODIFIER_CAR_LED_COLOR_1
            case TID_MODIFIER_CAR_LED_COLOR_2:
                return Tid.TID_MODIFIER_CAR_LED_COLOR_2
            case TID_MODIFIER_CAR_LED_COLOR_3:
                return Tid.TID_MODIFIER_CAR_LED_COLOR_3
            default:
                return undefined
        }
    }

    export function enumToTid(e: Tid) {
        switch (e) {
            case Tid.TID_SENSOR_START_PAGE:
                return TID_SENSOR_START_PAGE
            case Tid.TID_SENSOR_PRESS:
                return TID_SENSOR_PRESS
            case Tid.TID_SENSOR_RELEASE:
                return TID_SENSOR_RELEASE
            case Tid.TID_SENSOR_ACCELEROMETER:
                return TID_SENSOR_ACCELEROMETER
            case Tid.TID_SENSOR_TIMER:
                return TID_SENSOR_TIMER
            case Tid.TID_SENSOR_LIGHT:
                return TID_SENSOR_LIGHT
            case Tid.TID_SENSOR_TEMP:
                return TID_SENSOR_TEMP
            case Tid.TID_SENSOR_RADIO_RECEIVE:
                return TID_SENSOR_RADIO_RECEIVE
            case Tid.TID_SENSOR_MICROPHONE:
                return TID_SENSOR_MICROPHONE
            case Tid.TID_SENSOR_CUP_X_WRITTEN:
                return TID_SENSOR_CUP_X_WRITTEN
            case Tid.TID_SENSOR_CUP_Y_WRITTEN:
                return TID_SENSOR_CUP_Y_WRITTEN
            case Tid.TID_SENSOR_CUP_Z_WRITTEN:
                return TID_SENSOR_CUP_Z_WRITTEN
            case Tid.TID_SENSOR_MAGNET:
                return TID_SENSOR_MAGNET
            case Tid.TID_SENSOR_SLIDER:
                return TID_SENSOR_SLIDER
            case Tid.TID_SENSOR_ROTARY:
                return TID_SENSOR_ROTARY
            case Tid.TID_SENSOR_CAR_WALL:
                return TID_SENSOR_CAR_WALL
            case Tid.TID_SENSOR_LINE:
                return TID_SENSOR_LINE
            case Tid.TID_FILTER_PIN_0:
                return TID_FILTER_PIN_0
            case Tid.TID_FILTER_PIN_1:
                return TID_FILTER_PIN_1
            case Tid.TID_FILTER_PIN_2:
                return TID_FILTER_PIN_2
            case Tid.TID_FILTER_BUTTON_A:
                return TID_FILTER_BUTTON_A
            case Tid.TID_FILTER_BUTTON_B:
                return TID_FILTER_BUTTON_B
            case Tid.TID_FILTER_KITA_KEY_1:
                return TID_FILTER_KITA_KEY_1
            case Tid.TID_FILTER_KITA_KEY_2:
                return TID_FILTER_KITA_KEY_2
            case Tid.TID_FILTER_LOGO:
                return TID_FILTER_LOGO
            case Tid.TID_FILTER_COIN_1:
                return TID_FILTER_COIN_1
            case Tid.TID_FILTER_COIN_2:
                return TID_FILTER_COIN_2
            case Tid.TID_FILTER_COIN_3:
                return TID_FILTER_COIN_3
            case Tid.TID_FILTER_COIN_4:
                return TID_FILTER_COIN_4
            case Tid.TID_FILTER_COIN_5:
                return TID_FILTER_COIN_5
            case Tid.TID_FILTER_TIMESPAN_SHORT:
                return TID_FILTER_TIMESPAN_SHORT
            case Tid.TID_FILTER_TIMESPAN_LONG:
                return TID_FILTER_TIMESPAN_LONG
            case Tid.TID_FILTER_LOUD:
                return TID_FILTER_LOUD
            case Tid.TID_FILTER_QUIET:
                return TID_FILTER_QUIET
            case Tid.TID_FILTER_ACCEL:
                return TID_FILTER_ACCEL
            case Tid.TID_FILTER_ACCEL_SHAKE:
                return TID_FILTER_ACCEL_SHAKE
            case Tid.TID_FILTER_ACCEL_TILT_UP:
                return TID_FILTER_ACCEL_TILT_UP
            case Tid.TID_FILTER_ACCEL_TILT_DOWN:
                return TID_FILTER_ACCEL_TILT_DOWN
            case Tid.TID_FILTER_ACCEL_TILT_LEFT:
                return TID_FILTER_ACCEL_TILT_LEFT
            case Tid.TID_FILTER_ACCEL_TILT_RIGHT:
                return TID_FILTER_ACCEL_TILT_RIGHT
            case Tid.TID_FILTER_TIMESPAN_RANDOM:
                return TID_FILTER_TIMESPAN_RANDOM
            case Tid.TID_FILTER_TIMESPAN_VERY_LONG:
                return TID_FILTER_TIMESPAN_VERY_LONG
            case Tid.TID_FILTER_CUP_X_READ:
                return TID_FILTER_CUP_X_READ
            case Tid.TID_FILTER_CUP_Y_READ:
                return TID_FILTER_CUP_Y_READ
            case Tid.TID_FILTER_CUP_Z_READ:
                return TID_FILTER_CUP_Z_READ
            case Tid.TID_FILTER_ROTARY_LEFT:
                return TID_FILTER_ROTARY_LEFT
            case Tid.TID_FILTER_ROTARY_RIGHT:
                return TID_FILTER_ROTARY_RIGHT
            case Tid.TID_FILTER_TEMP_WARMER:
                return TID_FILTER_TEMP_WARMER
            case Tid.TID_FILTER_TEMP_COLDER:
                return TID_FILTER_TEMP_COLDER
            case Tid.TID_FILTER_LINE_LEFT:
                return TID_FILTER_LINE_LEFT
            case Tid.TID_FILTER_LINE_RIGHT:
                return TID_FILTER_LINE_RIGHT
            case Tid.TID_FILTER_LINE_BOTH:
                return TID_FILTER_LINE_BOTH
            case Tid.TID_FILTER_LINE_NEITHER:
                return TID_FILTER_LINE_NEITHER
            case Tid.TID_FILTER_LINE_NEITHER_LEFT:
                return TID_FILTER_LINE_NEITHER_LEFT
            case Tid.TID_FILTER_LINE_NEITHER_RIGHT:
                return TID_FILTER_LINE_NEITHER_RIGHT
            case Tid.TID_ACTUATOR_SWITCH_PAGE:
                return TID_ACTUATOR_SWITCH_PAGE
            case Tid.TID_ACTUATOR_SPEAKER:
                return TID_ACTUATOR_SPEAKER
            case Tid.TID_ACTUATOR_MICROPHONE:
                return TID_ACTUATOR_MICROPHONE
            case Tid.TID_ACTUATOR_MUSIC:
                return TID_ACTUATOR_MUSIC
            case Tid.TID_ACTUATOR_PAINT:
                return TID_ACTUATOR_PAINT
            case Tid.TID_ACTUATOR_RADIO_SEND:
                return TID_ACTUATOR_RADIO_SEND
            case Tid.TID_ACTUATOR_RADIO_SET_GROUP:
                return TID_ACTUATOR_RADIO_SET_GROUP
            case Tid.TID_ACTUATOR_RGB_LED:
                return TID_ACTUATOR_RGB_LED
            case Tid.TID_ACTUATOR_CUP_X_ASSIGN:
                return TID_ACTUATOR_CUP_X_ASSIGN
            case Tid.TID_ACTUATOR_CUP_Y_ASSIGN:
                return TID_ACTUATOR_CUP_Y_ASSIGN
            case Tid.TID_ACTUATOR_CUP_Z_ASSIGN:
                return TID_ACTUATOR_CUP_Z_ASSIGN
            case Tid.TID_ACTUATOR_SHOW_NUMBER:
                return TID_ACTUATOR_SHOW_NUMBER
            case Tid.TID_MODIFIER_PAGE_1:
                return TID_MODIFIER_PAGE_1
            case Tid.TID_MODIFIER_PAGE_2:
                return TID_MODIFIER_PAGE_2
            case Tid.TID_MODIFIER_PAGE_3:
                return TID_MODIFIER_PAGE_3
            case Tid.TID_MODIFIER_PAGE_4:
                return TID_MODIFIER_PAGE_4
            case Tid.TID_MODIFIER_PAGE_5:
                return TID_MODIFIER_PAGE_5
            case Tid.TID_MODIFIER_COIN_1:
                return TID_MODIFIER_COIN_1
            case Tid.TID_MODIFIER_COIN_2:
                return TID_MODIFIER_COIN_2
            case Tid.TID_MODIFIER_COIN_3:
                return TID_MODIFIER_COIN_3
            case Tid.TID_MODIFIER_COIN_4:
                return TID_MODIFIER_COIN_4
            case Tid.TID_MODIFIER_COIN_5:
                return TID_MODIFIER_COIN_5
            case Tid.TID_MODIFIER_ICON_EDITOR:
                return TID_MODIFIER_ICON_EDITOR
            case Tid.TID_MODIFIER_COLOR_RED:
                return TID_MODIFIER_COLOR_RED
            case Tid.TID_MODIFIER_COLOR_DARKPURPLE:
                return TID_MODIFIER_COLOR_DARKPURPLE
            case Tid.TID_MODIFIER_EMOJI_GIGGLE:
                return TID_MODIFIER_EMOJI_GIGGLE
            case Tid.TID_MODIFIER_EMOJI_HAPPY:
                return TID_MODIFIER_EMOJI_HAPPY
            case Tid.TID_MODIFIER_EMOJI_HELLO:
                return TID_MODIFIER_EMOJI_HELLO
            case Tid.TID_MODIFIER_EMOJI_MYSTERIOUS:
                return TID_MODIFIER_EMOJI_MYSTERIOUS
            case Tid.TID_MODIFIER_EMOJI_SAD:
                return TID_MODIFIER_EMOJI_SAD
            case Tid.TID_MODIFIER_EMOJI_SLIDE:
                return TID_MODIFIER_EMOJI_SLIDE
            case Tid.TID_MODIFIER_EMOJI_SOARING:
                return TID_MODIFIER_EMOJI_SOARING
            case Tid.TID_MODIFIER_EMOJI_SPRING:
                return TID_MODIFIER_EMOJI_SPRING
            case Tid.TID_MODIFIER_EMOJI_TWINKLE:
                return TID_MODIFIER_EMOJI_TWINKLE
            case Tid.TID_MODIFIER_EMOJI_YAWN:
                return TID_MODIFIER_EMOJI_YAWN
            case Tid.TID_MODIFIER_CUP_X_READ:
                return TID_MODIFIER_CUP_X_READ
            case Tid.TID_MODIFIER_CUP_Y_READ:
                return TID_MODIFIER_CUP_Y_READ
            case Tid.TID_MODIFIER_CUP_Z_READ:
                return TID_MODIFIER_CUP_Z_READ
            case Tid.TID_MODIFIER_RADIO_VALUE:
                return TID_MODIFIER_RADIO_VALUE
            case Tid.TID_MODIFIER_RANDOM_TOSS:
                return TID_MODIFIER_RANDOM_TOSS
            case Tid.TID_MODIFIER_LOOP:
                return TID_MODIFIER_LOOP
            case Tid.TID_MODIFIER_MELODY_EDITOR:
                return TID_MODIFIER_MELODY_EDITOR
            case Tid.TID_MODIFIER_TEMP_READ:
                return TID_MODIFIER_TEMP_READ
            case Tid.TID_MODIFIER_RGB_LED_COLOR_X:
                return TID_MODIFIER_RGB_LED_COLOR_X
            case Tid.TID_MODIFIER_RGB_LED_COLOR_1:
                return TID_MODIFIER_RGB_LED_COLOR_1
            case Tid.TID_MODIFIER_RGB_LED_COLOR_2:
                return TID_MODIFIER_RGB_LED_COLOR_2
            case Tid.TID_MODIFIER_RGB_LED_COLOR_3:
                return TID_MODIFIER_RGB_LED_COLOR_3
            case Tid.TID_MODIFIER_RGB_LED_COLOR_4:
                return TID_MODIFIER_RGB_LED_COLOR_4
            case Tid.TID_MODIFIER_RGB_LED_COLOR_5:
                return TID_MODIFIER_RGB_LED_COLOR_5
            case Tid.TID_MODIFIER_RGB_LED_COLOR_6:
                return TID_MODIFIER_RGB_LED_COLOR_6
            case Tid.TID_MODIFIER_RGB_LED_COLOR_RAINBOW:
                return TID_MODIFIER_RGB_LED_COLOR_RAINBOW
            case Tid.TID_MODIFIER_RGB_LED_COLOR_SPARKLE:
                return TID_MODIFIER_RGB_LED_COLOR_SPARKLE
            case Tid.TID_ACTUATOR_SERVO_SET_ANGLE:
                return TID_ACTUATOR_SERVO_SET_ANGLE
            case Tid.TID_ACTUATOR_CAR:
                return TID_ACTUATOR_CAR
            case Tid.TID_MODIFIER_CAR_FORWARD:
                return TID_MODIFIER_CAR_FORWARD
            case Tid.TID_MODIFIER_CAR_REVERSE:
                return TID_MODIFIER_CAR_REVERSE
            case Tid.TID_MODIFIER_CAR_TURN_LEFT:
                return TID_MODIFIER_CAR_TURN_LEFT
            case Tid.TID_MODIFIER_CAR_TURN_RIGHT:
                return TID_MODIFIER_CAR_TURN_RIGHT
            case Tid.TID_MODIFIER_CAR_STOP:
                return TID_MODIFIER_CAR_STOP
            case Tid.TID_MODIFIER_CAR_FORWARD_FAST:
                return TID_MODIFIER_CAR_FORWARD_FAST
            case Tid.TID_MODIFIER_CAR_SPIN_LEFT:
                return TID_MODIFIER_CAR_SPIN_LEFT
            case Tid.TID_MODIFIER_CAR_SPIN_RIGHT:
                return TID_MODIFIER_CAR_SPIN_RIGHT
            case Tid.TID_MODIFIER_CAR_LED_COLOR_1:
                return TID_MODIFIER_CAR_LED_COLOR_1
            case Tid.TID_MODIFIER_CAR_LED_COLOR_2:
                return TID_MODIFIER_CAR_LED_COLOR_2
            case Tid.TID_MODIFIER_CAR_LED_COLOR_3:
                return TID_MODIFIER_CAR_LED_COLOR_3
            default:
                return undefined
        }
    }

    export function isSensor(tid: Tid) {
        return tid >= Tid.SENSOR_START && tid < Tid.SENSOR_END
    }

    export function isFilter(tid: Tid) {
        return tid >= Tid.FILTER_START && tid < Tid.FILTER_END
    }

    export function isActuator(tid: Tid) {
        return tid >= Tid.ACTUATOR_START && tid < Tid.ACTUATOR_END
    }

    export function isModifier(tid: Tid) {
        return tid >= Tid.MODIFIER_START && tid < Tid.MODIFER_END
    }

    export function isTidNotTerminal(tid: Tid) {
        // the following sensors and actuators are terminal
        if (
            tid == Tid.TID_SENSOR_CAR_WALL ||
            tid == Tid.TID_SENSOR_SLIDER ||
            tid == Tid.TID_ACTUATOR_SWITCH_PAGE ||
            tid == Tid.TID_SENSOR_LIGHT ||
            tid == Tid.TID_SENSOR_MAGNET
        )
            return false
        // everything else except some filters is not terminal
        if (!isFilter(tid)) return true
        // the following filters are not terminal
        if (
            (Tid.TID_FILTER_COIN_1 <= tid && tid <= Tid.TID_FILTER_COIN_5) ||
            (Tid.TID_FILTER_TIMESPAN_SHORT <= tid &&
                tid <= Tid.TID_FILTER_TIMESPAN_VERY_LONG) ||
            (Tid.TID_FILTER_CUP_X_READ <= tid &&
                tid <= Tid.TID_FILTER_CUP_Z_READ)
        )
            return true
        // all other filters are terminal
        return false
    }

    // Jacdac event codes
    export function eventCode(tid: Tid) {
        switch (tid) {
            case Tid.TID_SENSOR_TEMP:
            case Tid.TID_FILTER_QUIET:
            case Tid.TID_SENSOR_RELEASE:
                return 2
            case Tid.TID_SENSOR_LINE:
            case Tid.TID_SENSOR_CAR_WALL:
            case Tid.TID_SENSOR_RADIO_RECEIVE:
                return 0x91
            case Tid.TID_SENSOR_MICROPHONE:
            case Tid.TID_SENSOR_ROTARY:
            case Tid.TID_FILTER_LOUD:
            case Tid.TID_SENSOR_PRESS:
                return 1
            case Tid.TID_SENSOR_ACCELEROMETER:
                return 0x8b
            default:
                return undefined
        }
    }

    export function serviceClassName(tid: Tid) {
        switch (tid) {
            case Tid.TID_SENSOR_PRESS:
            case Tid.TID_SENSOR_RELEASE:
                return "button"
            case Tid.TID_SENSOR_TEMP:
                return "temperature"
            case Tid.TID_SENSOR_RADIO_RECEIVE:
            case Tid.TID_ACTUATOR_RADIO_SEND:
            case Tid.TID_ACTUATOR_RADIO_SET_GROUP:
            case Tid.TID_SENSOR_LINE:
            case Tid.TID_SENSOR_CAR_WALL:
            case Tid.TID_ACTUATOR_CAR:
                return "radio"
            case Tid.TID_SENSOR_SLIDER:
                return "potentiometer"
            case Tid.TID_SENSOR_MAGNET:
                return "magneticFieldLevel"
            case Tid.TID_SENSOR_LIGHT:
                return "lightLevel"
            case Tid.TID_SENSOR_ROTARY:
                return "rotaryEncoder"
            case Tid.TID_SENSOR_ACCELEROMETER:
                return "accelerometer"
            case Tid.TID_SENSOR_MICROPHONE:
                return "soundLevel"
            case Tid.TID_ACTUATOR_PAINT:
            case Tid.TID_ACTUATOR_SHOW_NUMBER:
                return "dotMatrix"
            case Tid.TID_ACTUATOR_SPEAKER:
                return "soundPlayer"
            case Tid.TID_ACTUATOR_MUSIC:
                return "buzzer"
            case Tid.TID_ACTUATOR_RGB_LED:
                return "led"
            case Tid.TID_ACTUATOR_SERVO_SET_ANGLE:
                return "servo"
            default:
                return undefined
        }
    }

    export function serviceCommand(tid: Tid) {
        switch (tid) {
            case Tid.TID_ACTUATOR_PAINT:
            case Tid.TID_ACTUATOR_RGB_LED:
                return jacs.CMD_SET_REG | 0x2
            case Tid.TID_ACTUATOR_SPEAKER:
            case Tid.TID_ACTUATOR_MUSIC:
                return 0x80
            case Tid.TID_ACTUATOR_CAR:
            case Tid.TID_ACTUATOR_RADIO_SEND:
                return 0x81
            case Tid.TID_ACTUATOR_RADIO_SET_GROUP:
            case Tid.TID_ACTUATOR_SERVO_SET_ANGLE:
                return jacs.CMD_SET_REG | 0x80
            default:
                return undefined
        }
    }

    export function jdExternalClass(tid: Tid) {
        switch (tid) {
            case Tid.TID_FILTER_KITA_KEY_1:
            case Tid.TID_FILTER_KITA_KEY_2:
                return 0x1473a263
            case Tid.TID_SENSOR_SLIDER:
                return 0x1f274746
            case Tid.TID_SENSOR_MAGNET:
                return 0x12fe180f
            case Tid.TID_SENSOR_LIGHT:
                return 0x17dc9a1c
            case Tid.TID_SENSOR_ROTARY:
                return 0x10fa29c9
            case Tid.TID_ACTUATOR_RGB_LED:
                return 0x1609d4f0
            case Tid.TID_ACTUATOR_SERVO_SET_ANGLE:
                return 0x12fc9103
            default:
                return undefined
        }
    }

    export function isVisible(tid: Tid) {
        const ext = jdExternalClass(tid)
        if (ext && !jacs.debugOut) {
            const count = jdc.numServiceInstances(ext)
            // special case for buttons, which already exist on micro:bit (6 of them)
            // we also have light sensor on board micro:bit (1 of them), as well as in Kit A
            return ext == 0x1473a263 ? count > 6 : count > 0
        }
        return true
    }

    // TODO: we don't need separate bits for everything.
    // TODO: only certain things can be combined. Analyze and optimize
    export enum TidKinds {
        PressEvent = 0x01,
        ValueIn = 0x02,
        ValueOut = 0x04,
        RotaryEvent = 0x08,
        TempEvent = 0x10,
        AccelEvent = 0x20,
        TimeSpan = 0x40,
        SoundEvent = 0x80,
        IconEditor = 0x100,
        Loop = 0x200,
        MelodyEditor = 0x400,
        SoundEmoji = 0x800,
        Constant = 0x1000,
        Page = 0x2000,
        Car = 0x4000,
        RGBLed = 0x8000,
    }

    export function assert(cond: boolean, msg?: string) {
        if (!cond) {
            if (msg == null) msg = "Assertion failed"
            console.debug(msg)
            throw msg
        }
    }

    // use this to manage a buffer that may grow
    export class BufferWriter {
        private buf: Buffer
        private ptr: number = 0

        constructor() {
            this.buf = Buffer.create(64)
        }

        public get length() {
            return this.ptr
        }

        public get buffer() {
            const buf = Buffer.create(this.ptr)
            buf.write(0, this.buf.slice(0, this.ptr))
            return buf
        }

        public writeByte(v: number) {
            assert(
                0 <= v && v <= 0xff && (v | 0) == v,
                "writeByte: v=" + v.toString()
            )
            if (this.ptr >= this.buf.length) {
                const copy = Buffer.create(this.buf.length * 2)
                copy.write(0, this.buf)
                this.buf = copy
            }
            this.buf[this.ptr++] = v
        }

        public writeBuffer(b: Buffer) {
            for (let i = 0; i < b.length; ++i) this.writeByte(b[i])
        }
    }

    export class BufferReader {
        constructor(private buf: Buffer, private ptr: number = 0) {}

        public get buffer() {
            return this.buf
        }

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
            for (let i = 0; i < len; ++i) b[i] = this.buf[this.ptr++]
            return b
        }
    }
}
