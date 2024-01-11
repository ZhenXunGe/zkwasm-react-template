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

# Single test
~/zkWasm/target/release/delphinus-cli -k 18 --host standard --function zkmain --param ./params --output ./output --wasm ../src/js/gameplay.wasm dry-run --public 1:i64 --private 5:i64 \
256:i64 512:i64 1:i64 0:i64 256:i64 \
0xa353728b2c97aef0caed041aeadcf93a9da458c66fe200b912cab15ac6cd3d14:bytes-packed \
0x394ccfdcf75f554dfcd249255226a8530a6eef3304e5b2b91d59bca3c368f11d:bytes-packed \
0xd43c8863620fa30ebe8f463a7e99c67ca7a42d732f7755ff8113788b70719112:bytes-packed \
0x967864ae263ab07303a5110b90acaa37700320a625ed1efe563ce9fa6c3ccf2a:bytes-packed \
0x83c6ef711a407659c20c80184b32513fa2ec2b4aab9dc265a85224f17fab3a02:bytes-packed
