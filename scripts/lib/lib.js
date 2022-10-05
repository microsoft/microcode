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


function led_set_color(idx, color) {
    idx = idx * 3
    packet.setAt(idx, "u8", color >> 16)
    packet.setAt(idx + 1, "u8", color >> 8)
    packet.setAt(idx + 2, "u8", color)
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
