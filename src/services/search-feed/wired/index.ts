import { XMLParser } from "fast-xml-parser";
import { Article, Provider, ProviderResult } from "../../../types/news";
import { sample } from "../../../utils/sample";

const FEED_URL = "https://www.wired.com/feed/rss";
const TIMEOUT_MS = 5000;

const parser = new XMLParser({
  ignoreAttributes: false,
});

function text(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "object" && "#text" in value) {
    return String((value as { "#text": unknown })["#text"]);
  }

  return String(value);
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toArticle(item: Record<string, any>): Article {
  return {
    title: stripHtml(text(item.title) ?? ""),
    content: stripHtml(text(item.description) ?? ""),
    url: text(item.link),
    image: text(item["media:thumbnail"]?.["@_url"]),
    publishedDate: text(item.pubDate),
    source: Provider.WIRED,
  };
}

export async function wired(limit: number): Promise<ProviderResult> {
  try {
    const response = await fetch(FEED_URL, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`feed respondeu HTTP ${response.status}`);
    }

    const rssObject = parser.parse(await response.text());
    const items = rssObject?.rss?.channel?.item;
    const list: Record<string, any>[] = Array.isArray(items)
      ? items
      : items
        ? [items]
        : [];

    const data = sample(
      list.map(toArticle).filter((article) => article.title),
      limit,
    );

    if (data.length === 0) {
      return {
        success: false,
        provider: Provider.WIRED,
        message: "nenhuma notícia encontrada",
      };
    }

    return {
      success: true,
      provider: Provider.WIRED,
      message: "sucesso ao buscar notícias",
      data,
    };
  } catch (error) {
    return {
      success: false,
      provider: Provider.WIRED,
      message: "erro ao buscar notícias",
      error,
    };
  }
}
