/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_CLIENT_ID: string;
  readonly PRELOAD_VITE_API_URL: string;
  readonly PRELOAD_VITE_API_SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
