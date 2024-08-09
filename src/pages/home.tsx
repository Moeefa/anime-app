import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea, ScrollBar, Viewport } from "@/components/ui/scroll-area";
import { Archive16Regular, ListBar16Regular } from "@fluentui/react-icons";
import React, { useContext } from "react";

import Card from "@/components/card";
import ListItems from "@/components/list-items";
import { DataContext } from "@/contexts/data-context";
import { SettingsContext } from "@/contexts/settings-context";
import { Link } from "react-router-dom";

export default function Home(): React.ReactElement {
  const { settings, update } = useContext(SettingsContext);
  const data = useContext(DataContext);

  return (
    <>
      {settings.recents.filter((e) => e.provider === settings.provider).length >
        0 && (
        <div className="group">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Recently watched
          </h3>
          <ScrollArea className="flex justify-center pb-2">
            <Viewport>
              <div className="flex w-max space-x-5 py-4">
                {settings.recents
                  ?.filter((e) => e.provider === settings.provider)
                  .map((item, i) => (
                    <ContextMenu key={i}>
                      <ContextMenuTrigger>
                        <Card
                          data-video={true}
                          title={`${item.title} - Episódio ${item.number}`}
                          data={{
                            image: item.episode?.image || item.image || "",
                            url: item.url,
                            origin: item.origin,
                            episode: item.number,
                          }}
                        />
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem asChild>
                          <Link
                            to={`/episodes?url=${encodeURIComponent(
                              item.origin,
                            )}`}
                          >
                            <ListBar16Regular className="mr-2" />
                            View All Episodes
                          </Link>
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={async () => {
                            update("recents").set(
                              settings.recents.filter(
                                (e: any) => e.url !== item.url,
                              ),
                            );
                          }}
                        >
                          <Archive16Regular className="mr-2" />
                          Remove from History
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
              </div>
            </Viewport>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      <ListItems title="Popular" data={data.popular} />
      <ListItems title="Latest releases" data={data.latest.releases} />
      <ListItems video title="Latest episodes" data={data.latest.episodes} />
    </>
  );
}
