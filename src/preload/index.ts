import { contextBridge } from "electron"
import { electronAPI } from "@electron-toolkit/preload"

// Custom APIs for renderer
const api = {
  URL: import.meta.env.PRELOAD_VITE_API_URL,
  SITE: import.meta.env.PRELOAD_VITE_API_SITE,
}

const storage = {
  set: <T>(key: string, value: T) => electronAPI.ipcRenderer.send("setStorage", key, value),
  get: <T>(key: string): T => electronAPI.ipcRenderer.sendSync("getStorage", key),
  remove: (key: string) => electronAPI.ipcRenderer.send("removeStorage", key),
  clear: () => electronAPI.ipcRenderer.send("clearStorage"),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("storage", storage)
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("api", api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.storage = storage
  // @ts-ignore (define in dts)
  window.api = api
}
