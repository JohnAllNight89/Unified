import { useEffect } from "react";

const SITE_URL = "https://theunifiedspirit.com";
const SITE_NAME = "The Unified Spirit";
const DEFAULT_IMAGE = `${SITE_URL}/opengraph.jpg`;

function setMetaByAttr(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setRobots(noindex: boolean) {
  let el = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (noindex) {
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "robots");
      document.head.appendChild(el);
    }
    el.setAttribute("content", "noindex, nofollow");
  } else if (el) {
    el.remove();
  }
}

export interface SeoOptions {
  /** Page title without the site name suffix, e.g. "About" */
  title: string;
  description: string;
  /** Route path starting with "/", e.g. "/about" */
  path: string;
  image?: string;
  noindex?: boolean;
}

/**
 * Keeps <title>, meta description, canonical, and Open Graph/Twitter tags in
 * sync with the current route. This is a client-side SPA with no SSR, so
 * every route otherwise inherits the static tags baked into index.html —
 * this hook is what gives each page its own metadata for crawlers and link
 * previews.
 */
export function useSEO({ title, description, path, image = DEFAULT_IMAGE, noindex = false }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    setMetaByAttr("name", "description", description);
    setCanonical(url);
    setMetaByAttr("property", "og:url", url);
    setMetaByAttr("property", "og:title", fullTitle);
    setMetaByAttr("property", "og:description", description);
    setMetaByAttr("property", "og:image", image);
    setMetaByAttr("name", "twitter:title", fullTitle);
    setMetaByAttr("name", "twitter:description", description);
    setMetaByAttr("name", "twitter:image", image);
    setRobots(noindex);
  }, [title, description, path, image, noindex]);
}
