enum Provider {
  TAVILY = "tavily",
  WIRED = "wired",
}

interface Article {
  title: string;
  content: string;
  url?: string;
  image?: string;
  publishedDate?: string;
  source?: Provider;
}

interface ProviderResult {
  success: boolean;
  provider: Provider;
  message: string;
  data?: Article[];
  error?: unknown;
}

interface News {
  success: boolean;
  provider: Provider | null;
  message: string;
  data: Article[] | null;
}

export { Provider, Article, ProviderResult, News };
