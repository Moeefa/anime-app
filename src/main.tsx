import "@/globals.css";

import { App } from "./app";
import ReactDOM from "react-dom/client";
import { SettingsProvider } from "./contexts/settings-context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </>,
);
