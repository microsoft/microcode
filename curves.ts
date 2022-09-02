namespace microcode.curves.easing {
    // Curve formulas from https://easings.net/
    // Only "ease in"-style curves should appear here. "ease out" and "ease in-out" are derived programmatically from these.
    export function sine(t: number): number {
        return 1 - Math.cos((t * Math.PI) / 2)
    }
    export function sq2(t: number): number {
        return t * t
    }
    export function sq3(t: number): number {
        return t * t * t
    }
    export function sq4(t: number): number {
        return t * t * t * t
    }
    export function sq5(t: number): number {
        return t * t * t * t * t
    }
    export function expo(t: number): number {
        return t === 0 ? 0 : Math.pow(2, 10 * t - 10)
    }
    export function circ(t: number): number {
        return 1.0 - Math.sqrt(1.0 - Math.pow(t, 2))
    }
    export function back(t: number): number {
        const c1 = 1.70158
        const c3 = c1 + 1
        return c3 * t * t * t - c1 * t * t
    }
    export function elastic(t: number): number {
        const c4 = (2 * Math.PI) / 3
        return t === 0
            ? 0
            : t === 1
            ? 1
            : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4)
    }
}

namespace microcode.curves.util {
    export function lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t
    }
    export function flip(t: number): number {
        return 1 - t
    }
}

// Predefined curves for use with animation EaseFrame.
// Choose an ease type and curve pair, like: `easing.easeIn(easing.curves.sine)`
namespace microcode.curves {
    export function linear(): (a: number, b: number, t: number) => number {
        return util.lerp
    }
    export function snap(
        pct: number
    ): (a: number, b: number, t: number) => number {
        return (a, b, t) => (t < pct ? a : b)
    }
    export function easeIn(
        easeInFn: (t: number) => number
    ): (a: number, b: number, t: number) => number {
        return (a, b, t) => util.lerp(a, b, easeInFn(t))
    }
    export function easeOut(
        easeInFn: (t: number) => number
    ): (a: number, b: number, t: number) => number {
        return (a, b, t) => util.lerp(a, b, util.flip(easeInFn(util.flip(t))))
    }
    export function easeInOut(
        easeInFn: (t: number) => number
    ): (a: number, b: number, t: number) => number {
        return (a, b, t) =>
            util.lerp(
                a,
                b,
                util.lerp(easeInFn(t), util.flip(easeInFn(util.flip(t))), t)
            )
    }
}
