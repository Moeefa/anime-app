import { ElectronAPI } from "@electron-toolkit/preload"
import { ipcRenderer } from "electron"

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      URL: string
      SITE: "AnimeFire" | "AnimesOnline"
    }
    storage: {
      set: <T>(key: string, value: T) => void
      get: <T>(key: string) => T
      remove: (key: string) => void
      clear: () => void
    }
  }
}
