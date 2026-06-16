enum Provider {
  HUGGINGFACE = "huggingface",
  TAVILY = "tavily",
  WIRED = "wired",
}

interface Article {
  title: string;
  content: string;
  url?: string;
  rawContent?: string;
  publishedDate?: string;
  score?: number;
  image?: string;
}

interface News {
  sucess: boolean;
  provider: Provider | null;
  message: string;
  data: [Article] | any;
}

export { Provider, Article, News };
