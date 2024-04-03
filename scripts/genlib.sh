#!/bin/sh

set -x
set -e
JS=../../devicescript
JSON=${JS}/built/prog-lib.json
HERE=`pwd`
rm -f ${JSON}
(cd ${JS} && make comp-fast && node run.js -L ${HERE}/lib/lib.js)
node genlib.js ${JSON} > ../binlib.ts
prettier -w ../binlib.ts
