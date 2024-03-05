import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function time(durationSeconds: number): string {
  const hrs = Math.floor(durationSeconds / 3600);
  const mins = Math.floor((durationSeconds % 3600) / 60);
  const secs = Math.floor(durationSeconds % 60);

  let formated = hrs !== 0 ? `${hrs.toString().padStart(2, "0")}:` : "";

  return (formated += `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
}
