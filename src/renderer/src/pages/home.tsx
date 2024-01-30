import ListItems from "@/components/list-items"
import React from "react"

export default function Home(): React.ReactElement {
  return (
    <>
      <ListItems title="Popular" url={`${window.api.URL}/popular?site=${window.api.SITE}&page=1`} />
      <ListItems
        title="Latest animes"
        url={`${window.api.URL}/latest/animes?site=${window.api.SITE}&page=1`}
      />
      <ListItems
        video
        title="Latest episodes"
        url={`${window.api.URL}/latest/episodes?site=${window.api.SITE}&page=1`}
      />
    </>
  )
}
