import { Archive16Regular, ListBar16Regular } from "@fluentui/react-icons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { IAnime, IEpisode } from "src/types/anime";
import { ScrollArea, ScrollBar, Viewport } from "@/components/ui/scroll-area";

import Card from "@/components/card";
import { Link } from "react-router-dom";
import ListItems from "@/components/list-items";
import React from "react";

export default function Home(): React.ReactElement {
  return (
    <>
      {((window.storage.get("recents.episodes") as []) || []).filter(
        (e: { provider: string }) =>
          e.provider ===
          (window.storage.get("settings.provider") || window.api.PROVIDER)
      ).length > 0 && (
        <div className="group">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Recently watched
          </h3>
          <ScrollArea className="flex justify-center pb-2">
            <Viewport>
              <div className="flex w-max space-x-5 p-4">
                {(window.storage.get("recents.episodes") as [])
                  ?.filter(
                    (e: { provider: string }) =>
                      e.provider ===
                      (window.storage.get("settings.provider") ||
                        window.api.PROVIDER)
                  )
                  .map(
                    (
                      item: {
                        episode: IEpisode;
                        url: string;
                        origin: string;
                        number: number;
                      } & IAnime,
                      i: React.Key | null | undefined
                    ) => (
                      <ContextMenu key={i}>
                        <ContextMenuTrigger>
                          <Card
                            data-video={true}
                            title={`${item.title} - Episódio ${item.number}`}
                            data={{
                              image: item.episode.image || item.image,
                              url: item.url,
                              origin: item.origin,
                              episode: item.number,
                            }}
                          />
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem asChild>
                            <Link to={`/episodes?url=${item.origin}`}>
                              <ListBar16Regular className="mr-2" />
                              View All Episodes
                            </Link>
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              window.storage.set(
                                "recents.episodes",
                                (
                                  window.storage.get("recents.episodes") as []
                                ).filter(
                                  (e: { url: string }) => e.url !== item.url
                                )
                              );

                              window.location.reload();
                            }}
                          >
                            <Archive16Regular className="mr-2" />
                            Remove from History
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    )
                  )}
              </div>
            </Viewport>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      <ListItems
        title="Popular"
        url={`${window.api.BASE_URL}/popular?site=${window.storage.get("settings.provider") || window.api.PROVIDER}&page=1`}
      />
      <ListItems
        title="Latest animes"
        url={`${window.api.BASE_URL}/latest/animes?site=${window.storage.get("settings.provider") || window.api.PROVIDER}&page=1`}
      />
      <ListItems
        video
        title="Latest episodes"
        url={`${window.api.BASE_URL}/latest/episodes?site=${window.storage.get("settings.provider") || window.api.PROVIDER}&page=1`}
      />
    </>
  );
}
