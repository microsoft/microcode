#include "pxt.h"

#define CALIBRATION_KEY "robot"

namespace microcode {
    struct Calibration {
        uint8_t radioGroup;
        int8_t drift;
        uint8_t maxLineSpeed;
    };

    //%
    void __writeCalibration(Buffer buffer) {
        uBit.storage.put(CALIBRATION_KEY, buffer->data, sizeof(Calibration));
    }

    //%
    Buffer __readCalibration() {
        KeyValuePair* kv = uBit.storage.get(CALIBRATION_KEY);
        if (NULL != kv) {
            auto res = mkBuffer(kv->value, sizeof(Calibration));
            delete kv;
            return res;
        }
        return  NULL;
    }
}