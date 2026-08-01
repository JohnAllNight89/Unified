import { useEffect } from "react";

const BASE_URL = "https://theunifiedspirit.com";

interface SEOOptions {
  title: string;
  description: string;
  path?: string;
}

export function useSEO({ title, description, path = "" }: SEOOptions) {
  useEffect(() => {
    const url = `${BASE_URL}${path}`;

    document.title = title;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector<HTMLMetaElement>(selector);
      if (el) el.setAttribute("content", content);
    };

    const setLink = (selector: string, href: string) => {
      const el = document.querySelector<HTMLLinkElement>(selector);
      if (el) el.setAttribute("href", href);
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setLink('link[rel="canonical"]', url);
  }, [title, description, path]);
}
