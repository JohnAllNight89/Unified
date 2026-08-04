/**
 * Browser-safe stub for `node:url`, `node:path`, `node:module`.
 *
 * @fusionstrings/swisseph-wasi's browser entry eagerly imports a dnt
 * (Deno-to-Node) build artifact (`_dnt.polyfills.js`) that references these
 * Node built-ins at module scope — but only inside closures that are never
 * invoked by our usage (we call `createSwissEph()` directly from the
 * embedded-WASM browser wrapper, which never touches `import.meta` ponyfill
 * logic). These stubs exist only so the module graph resolves under Vite;
 * none of these functions are ever actually called at runtime.
 */
export function pathToFileURL(path: string): URL {
  return new URL(`file:///${path}`);
}
export function fileURLToPath(url: string | URL): string {
  return typeof url === "string" ? url : url.pathname;
}
export function dirname(path: string): string {
  return path.slice(0, path.lastIndexOf("/"));
}
export function createRequire(): never {
  throw new Error("createRequire is not available in the browser (unused stub).");
}
