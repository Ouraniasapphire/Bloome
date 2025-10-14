import { A } from "@solidjs/router";
import Counter from "~/components/Counter";
import { createSignal, onMount } from "solid-js";

export default function About() {
  const [a, setA] = createSignal(0);
  const [b, setB] = createSignal(0);
  const [result, setResult] = createSignal<number | null>(null);

  const calculate = () => {
    if ((window as any).subNumbers) {
      const sum = (window as any).subNumbers(Number(a()), Number(b()));
      setResult(sum);
    }
  };

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        About Page
      </h1>
      <Counter />
      <p class="mt-8">
        Visit{" "}
        <a
          href="https://solidjs.com"
          target="_blank"
          class="text-sky-600 hover:underline"
        >
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <A href="/" class="text-sky-600 hover:underline">
          Home
        </A>
        {" - "}
        <span>About Page</span>
      </p>
      <div class="p-4">
        <h1 class="text-xl mb-4">Simple Calculator (Go WASM)</h1>
        <input
          type="number"
          value={a()}
          onInput={(e) => setA(Number(e.currentTarget.value))}
          class="border p-1 mr-2"
        />
        <input
          type="number"
          value={b()}
          onInput={(e) => setB(Number(e.currentTarget.value))}
          class="border p-1 mr-2"
        />
        <button onClick={calculate} class="bg-sky-500 text-white p-1">
          Add
        </button>
        {result() !== null && <p class="mt-2">Result: {result()}</p>}
      </div>
    </main>
  );
}
