/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PRELOAD_VITE_API_URL: string
  readonly PRELOAD_VITE_API_SITE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
