import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Engine } from "./engine";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function removeBaseURL(
  target: Engine,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: string[]) {
    args[0] = args[0].replace(target.url, "") ?? "";
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

export function deprecated(constructor: Engine) {
  constructor.deprecated = true;
}

export function resolveTheme(theme: "dark" | "light" | "system") {
  return theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : theme;
}

export function time(durationSeconds: number): string {
  const hrs = Math.floor(durationSeconds / 3600);
  const mins = Math.floor((durationSeconds % 3600) / 60);
  const secs = Math.floor(durationSeconds % 60);

  let formated = hrs !== 0 ? `${hrs.toString().padStart(2, "0")}:` : "";

  return (formated += `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`);
}

interface retryPromiseOptions<T> {
  retryCatchIf?: (response: T) => boolean;
  retryIf?: (response: T) => boolean;
  retries?: number;
}

export function retryPromise<T>(
  promise: () => Promise<T>,
  options: retryPromiseOptions<T>,
) {
  const {
    retryIf = (_: T) => false,
    retryCatchIf = (_: T) => true,
    retries = 1,
  } = options;
  let _promise = promise();

  for (var i = 1; i < retries; i++)
    _promise = _promise
      .catch((value) =>
        retryCatchIf(value) ? promise() : Promise.reject(value),
      )
      .then((value) => (retryIf(value) ? promise() : Promise.reject(value)));

  return _promise;
}
