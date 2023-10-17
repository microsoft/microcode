#include "pxt.h"

#define CALIBRATION_KEY "robot"

namespace microcode {
    struct Calibration {
        int runDrift;
    };

    //%
    void __writeCalibration(int runDrift) {
        Calibration cal;
        cal.runDrift = runDrift;
        uBit.storage.put(CALIBRATION_KEY, (uint8_t *)&cal, sizeof(Calibration));
    }

    //%
    int __readCalibration() {
        KeyValuePair* kv = uBit.storage.get(CALIBRATION_KEY);
        int runDrift = 0;
        if (NULL != kv) {
            Calibration cal;
            memcpy(&cal, kv->value, sizeof(Calibration));
            runDrift = cal.runDrift;
        }
        return runDrift;
    }
}