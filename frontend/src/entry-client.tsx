// @refresh reload
import { mount } from "@solidjs/start/client";
import { StartClient } from "@solidjs/start/client";

mount(() => {
  if (navigator.onLine) {
    return <StartClient />;
  } else {
    return <>Offline</>
  }
}, document.getElementById("app")!);
