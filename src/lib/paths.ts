export const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export function withBase(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${basePath || ""}/`;
  return `${basePath}${normalized.endsWith("/") || normalized.includes(".") ? normalized : `${normalized}/`}`;
}

export function canonical(path = "/"): string {
  const route = withBase(path);
  return new URL(route, "https://easonwangzk.github.io").toString();
}
