import "./assets/globals.css";

import { HashRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "@/router";
import { SWRConfig } from "swr";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        fetcher: (url: string | URL | Request) =>
          fetch(url, { mode: "cors" }).then((res) => res.json()),
      }}
    >
      <HashRouter>
        <Routes />
      </HashRouter>
    </SWRConfig>
  </React.StrictMode>
);
