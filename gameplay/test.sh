#!/bin/bash

set -e
set -x

rm -rf output/*.data

# Single test
~/zkWasm/target/release/delphinus-cli -k 18 --host standard --function zkmain --param ./params --output ./output --wasm ../src/js/gameplay.wasm dry-run --public 1:i64 --private 3:i64 \
0:i64 256:i64 512:i64 \
0x7137da164bacaa9332b307e25c1abd906c5c240dcb27e520b84522a1674aab01:bytes-packed \
0x33b51854d1cde428aa0379606752a341b85cf1d47803e22330a0c9d41ce59c2b:bytes-packed \
0xc3a29245df679423efc6784f4fa337fad6acb5037befcb49ae6e4e017e2b2618:bytes-packed \
0x936682230fe9fe82104364dcb5e3a554d6aa7c76c0f162a9c199541f9a8f2e1c:bytes-packed \
0x1fded3e82063fc1f92e645e288e40b3911f5aba9fae8d4485f4d60cd7413d205:bytes-packed
