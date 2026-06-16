import { XMLParser } from "fast-xml-parser";
import { Provider } from "../../../types/news";

export async function wired() {
  try {
    const getNews = await fetch("https://www.wired.com/feed/rss");
    const xml = await getNews.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
    });

    const rssObject = parser.parse(xml);

    const articleObject = rssObject.rss.channel.item;

    const article = articleObject[0];

    return {
      success: true,
      provider: Provider.WIRED,
      message: "sucesso ao buscar notícias",
      data: [
        {
          title: article.title.replace(/"/g, '\\"'),
          content: article.description.replace(/"/g, '\\"'),
        },
      ],
    };
  } catch (error) {
    console.error("erro ao buscar notícias wired:", error);
    return {
      success: false,
      provider: Provider.WIRED,
      message: "erro ao buscar notícias",
    };
  }
}
