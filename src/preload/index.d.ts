import { ElectronAPI } from "@electron-toolkit/preload";
import { ipcRenderer } from "electron";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      BASE_URL: string;
      PROVIDER: string;
    };
    storage: {
      set: <T>(key: string, value: T) => void;
      get: <T>(key: string) => T;
      remove: (key: string) => void;
      clear: () => void;
    };
  }
}
