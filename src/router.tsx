import { listen } from "@tauri-apps/api/event";
import { Route, Routes, useNavigate } from "react-router-dom";

import DisplayItems from "@/components/display-items";
import { DataContext } from "@/contexts/data-context";
import MainLayout from "@/layouts/main";
import Episodes from "@/pages/episodes";
import Home from "@/pages/home";
import { Settings } from "@/pages/settings";
import Watch from "@/pages/watch";
import { useContext } from "react";
import { SettingsContext } from "./contexts/settings-context";

export default function RoutesElement() {
  const navigate = useNavigate();
  const data = useContext(DataContext);
  const { settings } = useContext(SettingsContext);

  listen<string>("navigate", (e) => {
    navigate(e.payload);
  });

  return (
    <Routes key={settings.provider}>
      <Route path="/watch" element={<Watch />} />
      <Route path="/settings" element={<Settings />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/episodes" element={<Episodes />} />
        <Route
          path="/search"
          element={<DisplayItems data={data.search} title="Search" />}
        />
        <Route
          path="/popular"
          element={<DisplayItems data={data.popular} title="Popular" />}
        />
        <Route
          path="/latest/releases"
          element={
            <DisplayItems data={data.latest.releases} title="Latest releases" />
          }
        />
        <Route
          path="/latest/episodes"
          element={
            <DisplayItems
              data={data.latest.episodes}
              title="Latest episodes"
              video
            />
          }
        />
      </Route>
    </Routes>
  );
}
