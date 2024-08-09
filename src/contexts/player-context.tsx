import { getProperty, setProperty } from "dot-prop";
import { createContext, useContext, useState } from "react";

import { getCurrent } from "@tauri-apps/api/webviewWindow";
import { SettingsContext } from "./settings-context";

let timeout: NodeJS.Timeout;

type State = {
  playing: boolean;
  pip: boolean;
  fullscreen: boolean;
  seeking: boolean;
  volume: number;
  duration: number;
  elapsed: number;
  quality: string | undefined;
  controls: {
    volume: boolean;
    settings: boolean;
    main: boolean;
  };
};

interface PlayerContextProps {
  state: State;
  update: (key: string) => {
    toggle: () => void;
    set: (value: any) => void;
  };
  toggleFullscreen: () => void;
  resetIdleCursor: () => void;
}

export const PlayerContext = createContext({} as PlayerContextProps);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useContext(SettingsContext);

  const [state, setState] = useState({
    playing: true,
    pip: false,
    fullscreen: false,
    seeking: false,
    volume: settings.volume || 100,
    duration: 0,
    elapsed: 0,
    quality: undefined,
    controls: {
      volume: false,
      settings: false,
      main: false,
    },
  });

  const resetIdleCursor = () => {
    clearTimeout(timeout);
    update("controls.main").set(true);
    timeout = setTimeout(() => {
      update("controls.main").set(false);
      update("controls.volume").set(false);
      update("controls.settings").set(false);
    }, 3000);
  };

  const toggleFullscreen = async () => {
    await getCurrent().setFullscreen(!(await getCurrent().isFullscreen()));
  };

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
    <PlayerContext.Provider
      value={{ state, update, resetIdleCursor, toggleFullscreen }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
