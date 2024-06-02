import { DEFAULT_SETTINGS, SettingsContext } from "./settings-context";
import { createContext, useContext, useEffect, useState } from "react";

import { Engine } from "@/lib/engine";
import { fetch } from "@tauri-apps/plugin-http";
import { listen } from "@tauri-apps/api/event";
import providers from "@/lib/providers";

interface ProviderContextProps {
  provider: Engine;
  status: "fetching" | "online" | "offline";
  setStatus: (status: ProviderContextProps["status"]) => void;
}

export const ProviderContext = createContext({} as ProviderContextProps);

export function ProviderProvider({ children }: { children: React.ReactNode }) {
  const { settings, state } = useContext(SettingsContext);
  const [status, setStatus] =
    useState<ProviderContextProps["status"]>("fetching");
  const [provider, setProvider] = useState<ProviderContextProps["provider"]>(
    new providers[DEFAULT_SETTINGS.provider as keyof typeof providers](),
  );

  async function listener() {
    await listen<ProviderContextProps["status"]>(
      "provider-status-set",
      async (event) => {
        setStatus(event.payload);
      },
    );
  }

  useEffect(() => {
    listener();
  }, []);

  useEffect(() => {
    fetch(provider.url, {
      connectTimeout: 10000,
      mode: "cors",
    })
      .then(() => setStatus("online"))
      .catch(() => setStatus("offline"));
  }, [provider, status]);

  useEffect(() => {
    if (state === "fetching") return;
    if (!settings.provider) return;

    const ProviderEngine =
      providers[settings.provider as keyof typeof providers];

    if (!ProviderEngine)
      return console.error(`Provider '${settings.provider}' is not supported.`);

    setProvider(new ProviderEngine());
  }, [settings.provider]);

  return (
    <ProviderContext.Provider value={{ provider, status, setStatus }}>
      {children}
    </ProviderContext.Provider>
  );
}
