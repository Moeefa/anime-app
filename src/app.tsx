import { HashRouter } from "react-router-dom";
import { ProviderProvider } from "@/contexts/provider-context";
import Routes from "@/router";
import { StoreProvider } from "./contexts/store-context";
import { ThemeProvider } from "./contexts/theme-provider";
import { DataProvider } from "./contexts/data-context";

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ProviderProvider>
        <StoreProvider>
          <HashRouter>
            <DataProvider>
              <Routes />
            </DataProvider>
          </HashRouter>
        </StoreProvider>
      </ProviderProvider>
    </ThemeProvider>
  );
}
