import { Alert, AlertTitle } from "@/components/ui/alert"
import { ArrowDownToLine, Map, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [search, setSearch] = useState("")
  const [updated, setUpdated] = useState(true)
  window.electron.ipcRenderer.on("update-available", () => {
    setUpdated(false)
  })

  return (
    <aside className={cn("h-full min-h-28 overflow-auto", className)}>
      <div className="space-y-4 py-4 h-full flex flex-col justify-between">
        {/* Section */}
        <div className="h-full z-50">
          <div className="px-3 py-2 bg-card">
            <div className="flex w-full max-w-sm items-center mb-4">
              <form className="flex">
                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  className="flex-1 rounded-r-none focus-visible:ring-0"
                  placeholder="Search"
                  minLength={1}
                />
                <Link
                  data-disabled={search.length === 0}
                  className="data-[disabled=true]:pointer-events-none"
                  to={`/search?q=${encodeURIComponent(search.toLowerCase())}`}
                >
                  <Button
                    disabled={search.length === 0}
                    type="submit"
                    size="icon"
                    className="rounded-l-none"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </Link>
              </form>
            </div>

            <div className="flex items-center gap-2">
              <Map />
              <h2 className="text-lg font-semibold tracking-tight">Discover</h2>
            </div>
            <div className="space-y-1">
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start">
                  Home
                </Button>
              </Link>
              <Link to="/popular">
                <Button variant="ghost" className="w-full justify-start">
                  Popular
                </Button>
              </Link>
              <Link to="/latest/animes">
                <Button variant="ghost" className="w-full justify-start">
                  Latest animes
                </Button>
              </Link>
              <Link to="/latest/episodes">
                <Button variant="ghost" className="w-full justify-start">
                  Latest episodes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-3 flex-1">
          {!updated && (
            <Alert className="flex justify-center items-center [&>svg]:static [&>svg]:translate-x-0 [&>svg]:translate-y-0 [&>svg~*]:pl-2 [&>h5]:mb-0">
              <ArrowDownToLine className="h-4 w-4" />
              <AlertTitle>Update available!</AlertTitle>
            </Alert>
          )}
        </div>
      </div>
    </aside>
  )
}
