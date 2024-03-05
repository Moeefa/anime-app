import React, { createContext, useState } from "react";
import { get, set } from "dot-prop";

export const PlayerContext = createContext({
  state: {
    playing: true,
    pip: false,
    seeking: false,
    volume: 100,
    duration: 0,
    played: 0,
    quality: undefined,
    controls: {
      volume: false,
      settings: false,
      main: false,
    },
  },
  update: (value) => ({
    toggle: () => {},
    set: (value) => {},
  }),
});

export function PlayerProvider({ children }) {
  const [state, setState] = useState({
    playing: true,
    pip: false,
    seeking: false,
    volume: (window.storage.get("settings.volume") as number) || 100,
    duration: 0,
    played: 0,
    quality: undefined,
    controls: {
      volume: false,
      settings: false,
      main: false,
    },
  });

  const update = (k) => ({
    toggle: () => {
      setState((prev) => ({ ...prev, ...set(state, k, !get(state, k)) }));
    },

    set: (value) => {
      setState((prev) => ({ ...prev, ...set(state, k, value) }));
    },
  });

  return (
    <PlayerContext.Provider value={{ state, update }}>
      {children}
    </PlayerContext.Provider>
  );
}
