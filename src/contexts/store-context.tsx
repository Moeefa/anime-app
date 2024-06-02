import { Store } from "@tauri-apps/plugin-store";
import { createContext } from "react";

interface StoreContextProps {
  store: Store;
}

export const StoreContext = createContext({} as StoreContextProps);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = new Store("store.bin");

  return (
    <StoreContext.Provider value={{ store }}>{children}</StoreContext.Provider>
  );
}
