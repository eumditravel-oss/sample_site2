/** Resolve public assets correctly in local development and GitHub Pages. */
export function assetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
