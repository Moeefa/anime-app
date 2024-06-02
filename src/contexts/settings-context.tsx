import { listen } from "@tauri-apps/api/event";
import { createContext, useEffect, useState } from "react";
import { getProperty, setProperty } from "dot-prop";

import { Store } from "@tauri-apps/plugin-store";

interface SettingsContextProps {
  settings: {
    provider: string;
    volume: number;
    transparency: {
      dark: number;
      light: number;
    };
    background: {
      dark: string;
      light: string;
    };
    recents: {
      episode: {
        image: string;
      };
      image: string;
      title: string;
      url: string;
      origin: string;
      number: number;
      provider: string;
    }[];
    sidebar: {
      display: boolean;
      width: string;
    };
  };
  state: "fetching" | "fetched";
  set: (value: any) => void;
  update: (key: string) => {
    toggle: () => void;
    set: (value: any) => void;
    reset: () => void;
  };
  clear: () => void;
}

export const SettingsContext = createContext({} as SettingsContextProps);

export const DEFAULT_SETTINGS = {
  provider: import.meta.env.VITE_API_PROVIDER,
  volume: 100,
  transparency: {
    dark: 0.3,
    light: 0.3,
  },
  background: {
    dark: "39 39 42",
    light: "255 255 255",
  },
  recents: [],
  sidebar: {
    display: true,
    width: "",
  },
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const store = new Store("store.bin");
  const [state, setState] = useState<"fetching" | "fetched">("fetching");
  const [settings, setSettings] =
    useState<SettingsContextProps["settings"]>(DEFAULT_SETTINGS);

  async function saveData() {
    await store.set("settings", settings);
    await store.save();
  }

  async function fetchData() {
    const value = await store.get<SettingsContextProps["settings"]>("settings");
    setSettings(
      (value as SettingsContextProps["settings"]) || DEFAULT_SETTINGS,
    );
    setState("fetched");
  }

  async function listener() {
    await listen<any>("settings-set", async (event) => {
      setSettings((prev) => ({
        ...prev,
        ...event.payload,
      }));
    });
  }

  useEffect(() => {
    fetchData();
    listener();
  }, []);

  const update = (key: string) => ({
    toggle: () => {
      setSettings((prev) => ({
        ...prev,
        ...setProperty(prev, key, !getProperty(prev, key)),
      }));

      saveData();
    },

    set: (value: any) => {
      setSettings((prev) => ({
        ...prev,
        ...setProperty(prev, key, value),
      }));

      saveData();
    },

    reset: () => {
      setSettings((prev) => ({
        ...prev,
        ...setProperty(prev, key, getProperty(DEFAULT_SETTINGS, key)),
      }));

      saveData();
    },
  });

  const clear = () => {
    setSettings(DEFAULT_SETTINGS);

    saveData();
  };

  const set = (value: any) => {
    setSettings(value);

    saveData();
  };

  return (
    <SettingsContext.Provider value={{ settings, state, set, update, clear }}>
      {children}
    </SettingsContext.Provider>
  );
}
