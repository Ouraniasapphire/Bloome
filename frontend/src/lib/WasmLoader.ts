// src/components/WasmLoader.tsx
import { createSignal, onMount } from "solid-js";

declare var Go: any;

export default function WasmLoader() {
  const [status, setStatus] = createSignal("Loading WASM...");

  onMount(() => {
    const script = document.createElement("script");
    script.src = "/wasm_exec.js"; // put wasm_exec.js in public/
    script.onload = async () => {
      try {
        const go = new Go();

        const response = await fetch("/wasm/main.wasm"); // put main.wasm in public/
        if (!response.ok) throw new Error("Failed to fetch WASM");

        const bytes = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(
          bytes,
          go.importObject
        );

        go.run(instance);

        setStatus("WASM loaded successfully");
      } catch (err) {
        console.error(err);
        setStatus("Failed to load WASM");
      }
    };

    document.head.appendChild(script);
  });

}
