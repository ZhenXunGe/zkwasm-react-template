#!/bin/bash

set -e
set -x

rm -rf output/*.data

# Single test
~/zkWasm/target/release/delphinus-cli -k 18 --function zkmain --param ./params --output ./output --wasm ../src/js/gameplay.wasm dry-run --public 103:i64 4:i64 --private 1:i64 0:i64 1:i64 1:i64
