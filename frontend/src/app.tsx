import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import WasmLoader from "./lib/WasmLoader";
import { createEffect } from "solid-js";
import "./app.css";

export default function App() {
  
  createEffect( () => {
    WasmLoader()
  })

  return (
    <Router
      root={props => (
        <>
          <Suspense>{props.children}</Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
