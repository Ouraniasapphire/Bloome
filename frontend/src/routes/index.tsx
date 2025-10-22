import { A } from "@solidjs/router";
import Counter from "~/components/Counter";
import { createEffect } from "solid-js";
import Login from "./auth/login";

export default function Home() {

  return (
    <main class="text-center mx-auto text-gray-700 p-4 content-center">
      <Login />

    </main>
  );
}
