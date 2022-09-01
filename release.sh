#!/bin/sh

set -e
makecode --java-script
makecode --hw F4,D5,N4,N3
cp ./built/binary.js ./assets/js/binary.js
cp ./built/combined.uf2 ./assets/firmware.uf2
