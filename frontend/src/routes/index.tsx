import { A } from "@solidjs/router";
import Counter from "~/components/Counter";
import { createEffect } from "solid-js";

export default function Home() {

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <script src="/wasm_exec.js"> </script>
      
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Hello world!</h1>
      <Counter />

      <p class="my-4">
        <span>Home</span>
        {" - "}
        <A href="/about" class="text-sky-600 hover:underline">
          About Page
        </A>{" "}
      </p>
    </main>
  );
}
