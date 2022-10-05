namespace jacs {
    export function _binGetProc(idx: number | string) {
        if (idx == 0 || idx == "main")
            return hex`000100001000000000000000000000004cf90006904b905a08924a004cfc0800`
        if (idx == 1 || idx == "hsv")
            return hex`
10010000940000000a003000020000002d0004f8ff1b04c026982a4f002d0204f8ff2d012c26982a4f012d0201
012c4f020100cf1b4f030103010226962a01011a4f04cf01032c010226962a01011a4f050100962a4f06010690
1f4df9001401054f0701044f0801014f094cf900280106911f4df9001401014f0701054f0801044f094cf90010
01044f0701014f0801054f090107a029010898291c01091c4b394b0000`
        if (idx == 2 || idx == "led_set_color")
            return hex`
a40100002800000000002000030000002d00932652003b902d002d01a02a513b902d00911a2d01982a513b902d
00921a2d0151394b000000`
        if (idx == 3 || idx == "led_setup_packet")
            return hex`
cc0100001800000001001000040000002d0004f9018290413b9190034f00010093264601004b394b`
        if (idx == 4 || idx == "led_solid")
            return hex`
e40100003c00000004002000050000002d004f00915a034900064f02904f0301030102234df9001a01034f002d
014f01925a0249000103911a4f034cfc1c2d0004f9200242913f394b000000`
        if (idx == 5 || idx == "led_anim_sparkle")
            return hex`
200200005000000004001000060000002d004f00915a034900064f02904f030103f4234df9002f010293264601
02912c174f0004faffffff4f01925a0249002d0004f920024205003f0103911a4f034cfc3001029326462d0004
f9200242394b`
        if (idx == 6 || idx == "led_anim_rainbow")
            return hex`
700200009800000009001000070000002d004f00915a034900064f05904f0601060105234df90080904f070107
0105234df90061010601071a4f0801050108234df9000b010801052c4f08904f00010801051e04f9010026901c
4f0104f8ff4f02935a074900064f0801074f0001084f0204f8ff4f0304f8ff4f04935a014902064f01925a0249
000107911a4f074cfc632d0004f920024205003f0106911a4f064cfc82394b0000`
        if (idx == 7 || idx == "clamp")
            return hex`
080300002000000000003000080000002d012d00234df900072d004b2d022d01234df900072d024b2d014b394b
000000`
        if (idx == 8 || idx == "_autoRefresh_")
            return hex`2803000008000000000000000900000004f90209404cfc05`
        return null
    }
    export function _binGetString(idx: number): string {
        if (idx == 0) return "main"
        if (idx == 1) return "cloud"
        if (idx == 2) return "hsv"
        if (idx == 3) return "led_set_color"
        if (idx == 4) return "led_setup_packet"
        if (idx == 5) return "led_solid"
        if (idx == 6) return "led_anim_sparkle"
        if (idx == 7) return "led_anim_rainbow"
        if (idx == 8) return "clamp"
        if (idx == 9) return "_autoRefresh_"
        return null
    }
    export const _binFloatLits = hex`9a9999999999b93f`
}
