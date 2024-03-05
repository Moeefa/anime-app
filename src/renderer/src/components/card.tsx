import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Card({
  className,
  title,
  data,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  data: {
    image: string;
    url: string;
    origin?: string;
    episode?: number;
  };
}): JSX.Element {
  return (
    <Link
      to={
        props["data-video"]
          ? `/watch?url=${encodeURIComponent(data.url)}&origin=${encodeURIComponent(data.origin!)}&ep=${data.episode}`
          : `/episodes?url=${encodeURIComponent(data.url)}`
      }
    >
      <div
        data-video={props["data-video"]}
        className={cn(
          "relative data-[video=true]:hover:scale-105 data-[video=false]:hover:scale-110 transition-all group",
          className
        )}
      >
        <img
          data-video={props["data-video"]}
          className="h-52 rounded-md data-[video=true]:aspect-video data-[video=false]:aspect-[9/12.8] object-cover"
          src={data.image}
          alt={title}
        />
        <div className="flex flex-col-reverse w-full gap-1 absolute bottom-0 p-2 bg-gradient-to-b from-transparent to-black rounded-md">
          <small className="text-sm font-medium leading-none text-white line-clamp-3 group-hover:line-clamp-none">
            {title?.replace("(Dublado)", "")}
          </small>
          {title?.includes("(Dublado)") && (
            <Badge className="mt-1 w-max" variant="secondary">
              Dublado
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
