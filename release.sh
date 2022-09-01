#!/bin/sh

set -e
makecode --java-script
makecode --hw N3
cp ./built/binary.js ./assets/js/binary.js
cp ./built/n3/binary.hex ./assets/firmware.hex
