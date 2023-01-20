build:
	wasm-pack build --release --out-name gameplay.wasm --out-dir pkg
	wasm-opt -Oz -o ../src/js/gameplay.wasm pkg/gameplay.wasm
	cp pkg/gameplay.d.ts ../src/js/gameplay.d.ts
	cp pkg/gameplay.wasm_bg.js ../src/js/gameplay.wasm_bg.js

trace:
	wasm-interp pkg/output.wasm --run-all-exports  --trace > trace.log
	wc -l trace.log

clean:
	rm -rf pkg
	rm -rf ../src/js/gameplay.wasm
	rm -rf ../src/js/gameplay.d.ts
