namespace microcode {
    // eventually, we should get rid of these constants and use the Tid enum

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
    export const TID_ACTUATOR_MICROPHONE = "A3" // dead but don't delete
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
    export const TID_MODIFIER_CAR_LED_COLOR_4 = "CAR12"
    export const TID_MODIFIER_CAR_ARM_OPEN = "CAR13"
    export const TID_MODIFIER_CAR_ARM_CLOSE = "CAR14"

    export function tidToString(e: Tid) {
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
            case Tid.TID_MODIFIER_CAR_LED_COLOR_4:
                return TID_MODIFIER_CAR_LED_COLOR_4
            case Tid.TID_MODIFIER_CAR_ARM_OPEN:
                return TID_MODIFIER_CAR_ARM_OPEN
            case Tid.TID_MODIFIER_CAR_ARM_CLOSE:
                return TID_MODIFIER_CAR_ARM_CLOSE
            default:
                assert(false, "unknown tid: " + e)
                return undefined
        }
    }
}
