import { useMemo, useSyncExternalStore } from "react";

// Hash routing keeps deep links working on GitHub Pages, which has no server-side rewrites.

export interface Route {
  path: string;
  params: URLSearchParams;
}

const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return useMemo(() => {
    const [path, query] = hash.replace(/^#/, "").split("?");
    return { path: path || "/", params: new URLSearchParams(query) };
  }, [hash]);
}

export const href = (to: string) => `#${to}`;

export function navigate(to: string) {
  window.location.hash = to;
}
