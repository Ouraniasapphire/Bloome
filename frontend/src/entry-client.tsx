// @refresh reload
import { mount } from "@solidjs/start/client";
import { StartClient } from "@solidjs/start/client";

mount(() => {
  return <StartClient />;
}, document.getElementById("app")!);
