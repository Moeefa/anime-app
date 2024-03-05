import { Route, Routes, useLocation } from "react-router-dom";

import DisplayItems from "@/layouts/display-items";
import Episodes from "@/pages/episodes";
import Home from "@/pages/home";
import MainLayout from "@/layouts/main";
import Watch from "@/pages/watch";

export default function RoutesElement() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  return (
    <Routes>
      <Route path="/watch" element={<Watch />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/episodes" element={<Episodes />} />
        <Route
          path="/search"
          element={
            <DisplayItems
              title="Search"
              url={`${window.api.BASE_URL}/search?search=${params.get("q")?.split(" ").join("-")}&site=${window.storage.get("settings.provider") || window.api.PROVIDER}&page=1`}
            />
          }
        />
        <Route
          path="/popular"
          element={
            <DisplayItems
              title="Popular"
              url={`${window.api.BASE_URL}/popular?site=${window.storage.get("settings.provider") || window.api.PROVIDER}&page=1`}
            />
          }
        />
        <Route
          path="/latest/animes"
          element={
            <DisplayItems
              title="Latest animes"
              url={`${window.api.BASE_URL}/latest/animes?site=${window.storage.get("settings.provider") || window.api.PROVIDER}&page=1`}
            />
          }
        />
        <Route
          path="/latest/episodes"
          element={
            <DisplayItems
              video
              title="Latest episodes"
              url={`${window.api.BASE_URL}/latest/episodes?site=${window.storage.get("settings.provider") || window.api.PROVIDER}&page=1`}
            />
          }
        />
      </Route>
    </Routes>
  );
}
