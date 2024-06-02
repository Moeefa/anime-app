import { Badge } from "@/components/ui/badge";
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
  [key: string]: any;
}): JSX.Element {
  return (
    <Link
      to={
        props["data-video"]
          ? `/watch?url=${encodeURIComponent(
              data.url
            )}&origin=${encodeURIComponent(data.origin!)}&ep=${data.episode}`
          : `/episodes?url=${encodeURIComponent(data.url)}`
      }
    >
      <div
        data-video={props["data-video"]}
        className={cn(
          "data-[video=false]:w-40 data-[video=true]:w-64 hover:scale-105 transition-all group border rounded-md border-border",
          className
        )}
      >
        <div className="relative">
          <img
            data-video={props["data-video"]}
            className="rounded-t-md data-[video=true]:aspect-video data-[video=false]:aspect-[9/12.8] data-[video=false]:w-40 data-[video=true]:w-64 object-cover"
            src={data.image}
            alt={title}
          />

          {title?.match(/(- )?(\()?Dublado(\))?/g) && (
            <Badge
              className="absolute bottom-2 right-2 mt-1 w-max bg-background/60 backdrop-blur"
              variant="secondary"
            >
              Dublado
            </Badge>
          )}
        </div>

        <div className="flex justify-center h-12 min-h-12 group-hover:h-auto w-full gap-1 p-2 bg-card/60 text-card-foreground rounded-b-md">
          <small className="max-w-full text-center text-sm font-medium leading-none line-clamp-3 group-hover:line-clamp-none">
            {title?.replace(/(- )?(\()?Dublado(\))?/g, "")}
          </small>
        </div>
      </div>
    </Link>
  );
}
