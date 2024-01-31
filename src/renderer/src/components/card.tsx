import { Badge } from "./ui/badge"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

const getVideoURL = (url: string) => {
  switch (window.api.SITE) {
    case "AnimeFire":
      return `/watch?url=${url}&origin=${url.slice(0, url.lastIndexOf("/"))}-todos-os-episodios&ep=${url.split("/").pop()}`

    default:
      return ""
  }
}

export default function Card({
  className,
  src,
  url,
  video = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  src: string
  url: string
  video?: boolean
}): JSX.Element {
  return (
    <Link to={video ? getVideoURL(url) : `/episodes?url=${encodeURIComponent(url)}`}>
      <div
        data-video={video}
        className={cn("relative hover:scale-110 transition-all group", className)}
      >
        <img
          className="h-52 rounded-md group-data-[video=true]:aspect-video group-data-[video=false]:aspect-[9/12.8] object-cover"
          src={src}
          alt={props.title}
        />
        <div className="flex flex-col-reverse w-full gap-1 absolute bottom-0 p-2 bg-gradient-to-b from-transparent to-black rounded-md">
          <small className="text-sm font-medium leading-none text-white line-clamp-3 group-hover:line-clamp-none">
            {props.title?.replace("(Dublado)", "")}
          </small>
          {props.title?.includes("(Dublado)") && (
            <Badge className="mt-1 w-max" variant="secondary">
              Dublado
            </Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
