import { createContext, useContext, useState } from "react";
import { getProperty, setProperty } from "dot-prop";

import { SettingsContext } from "./settings-context";

interface PlayerContextProps {
  state: {
    playing: boolean;
    pip: boolean;
    fullscreen: boolean;
    seeking: boolean;
    volume: number;
    duration: number;
    played: number;
    quality: string | undefined;
    controls: {
      volume: boolean;
      settings: boolean;
      main: boolean;
    };
  };
  update: (key: string) => {
    toggle: () => void;
    set: (value: any) => void;
  };
}

export const PlayerContext = createContext({} as PlayerContextProps);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useContext(SettingsContext);
  const [state, setState] = useState({
    playing: true,
    pip: false,
    fullscreen: false,
    seeking: false,
    volume: Number(settings.volume) || 100,
    duration: 0,
    played: 0,
    quality: undefined,
    controls: {
      volume: false,
      settings: false,
      main: false,
    },
  });

  const update = (key: string) => ({
    toggle: () => {
      setState((prev) => ({
        ...prev,
        ...setProperty(state, key, !getProperty(state, key)),
      }));
    },

    set: (value: any) => {
      setState((prev) => ({ ...prev, ...setProperty(state, key, value) }));
    },
  });

  return (
    <PlayerContext.Provider value={{ state, update }}>
      {children}
    </PlayerContext.Provider>
  );
}
