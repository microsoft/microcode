function hsv(hue, sat, val) {
    //reference: based on FastLED's hsv2rgb rainbow algorithm [https://github.com/FastLED/FastLED](MIT)
    var h = (hue & 0xff) * 192 >> 8
    var brightness_floor = val * (0xff - sat) >> 8
    var color_amplitude = val - brightness_floor;
    var rampup = h & 0x3f // [0..63]
    var rampup_adj_with_floor = ((rampup * color_amplitude >> 6) + brightness_floor);
    var rampdown_adj_with_floor = (((0x3f - rampup) * color_amplitude >> 6) + brightness_floor);

    var section = h >> 6 // [0..2]

    var r, g, b
    if (section == 0) {
        // section 0: 0x00..0x3F
        r = rampdown_adj_with_floor;
        g = rampup_adj_with_floor;
        b = brightness_floor;
    } else if (section == 1) {
        // section 1: 0x40..0x7F
        r = brightness_floor;
        g = rampdown_adj_with_floor;
        b = rampup_adj_with_floor;
    } else {
        // section 2; 0x80..0xBF
        r = rampup_adj_with_floor;
        g = brightness_floor;
        b = rampdown_adj_with_floor;
    }

    return (r << 16) | (g << 8) | b
}

function get_light_level(/** @type LightLevelRole */ light) {
    return light.lightLevel.read()
}

function slider_to_1_to_5(/** @type PotentiometerRole */ potentiometer) {
    var slider = potentiometer.position.read()
    return Math.idiv(100 * slider, 23) + 1
}

function led_set_color(idx, color) {
    idx = idx * 3
    packet.setAt(idx, "u8", (color >> 16) & 0xff)
    packet.setAt(idx + 1, "u8", (color >> 8) & 0xff)
    packet.setAt(idx + 2, "u8", color & 0xff)
}

function led_setup_packet(/** @type LedRole */ led) {
    var numpix = led.numPixels.read()
    packet.setLength(numpix * 3)
    return numpix
}

function led_solid(/** @type LedRole */ led, color) {
    var numpix = led_setup_packet(led)
    var idx = 0
    while (idx < numpix) {
        led_set_color(idx, color)
        idx = idx + 1
    }
    led.pixels.write(packet)
    wait(1)
}

function led_anim_sparkle(/** @type LedRole */ led) {
    var numpix = led_setup_packet(led)
    var iter = 0
    while (iter < 30) {
        packet.setLength(numpix * 3) // clears packet
        led_set_color(Math.randomInt(numpix - 1), 0xffffff)
        led.pixels.write(packet)
        wait(0.06)
        iter = iter + 1
    }

    // clear
    packet.setLength(numpix * 3)
    led.pixels.write(packet)
}

function led_anim_rainbow(/** @type LedRole */ led) {
    var numpix = led_setup_packet(led)
    var iter = 0
    while (iter < numpix) {
        packet.setLength(numpix * 3)
        var idx = 0
        while (idx < numpix) {
            var h = iter + idx
            if (h >= numpix) h = h - numpix
            h = clamp(0, Math.idiv(h << 8, numpix), 0xff)
            led_set_color(idx, hsv(h, 0xff, 0xff))
            idx = idx + 1
        }
        led.pixels.write(packet)
        wait(0.1)
        iter = iter + 1
    }
}

function dot_animation(/** @type DotMatrixRole */dots, /** @type JDBuffer */ buf, delay) {
    var pos = 0
    while (pos < buf.length) {
        packet.setLength(5)
        packet.blitAt(0, buf, pos, 5)
        dots.dots.write(packet)
        wait(delay / 1000)
        pos = pos + 5
    }
}

function note_sequence(/** @type BuzzerRole */buzzer, /** @type JDBuffer */ buf) {
    var pos = 0
    while (pos < buf.length) {
        packet.setLength(6)
        packet.blitAt(0, buf, pos, 6)
        var delay = packet.getAt(4,"u16")
        buzzer.playTone(packet)
        wait(delay / 1000)
        pos = pos + 6
    }
}


const _dot_showNumber_nums = hex`
0e 11 11 0e 00
00 12 1f 10 00
19 15 15 12 00
09 11 15 0b 00
0c 0a 09 1f 08
17 15 15 15 09
08 14 16 15 08
11 09 05 03 01
0a 15 15 15 0a
02 15 0d 05 02

0a 1f 0a 1f 0a

1f 1f
00 1f
1d 17
15 1f
07 1c
17 1d
1f 1d
01 1f
1b 1b
17 1f
`

function dot_showNumber(/** @type DotMatrixRole */dots, num) {
    num = Math.round(num) | 0
    packet.setLength(5)
    if (10 <= num && num <= 99) {
        var d0 = Math.idiv(num, 10)
        var d1 = num - d0 * 10
        packet.blitAt(0, _dot_showNumber_nums, 55 + d0 * 2, 2)
        packet.blitAt(3, _dot_showNumber_nums, 55 + d1 * 2, 2)
    } else {
        if (num < 0 || num > 99)
            num = 10 // '#'
        packet.blitAt(0, _dot_showNumber_nums, num * 5, 5)
    }
    dots.dots.write(packet)
    wait(0.1)
}
