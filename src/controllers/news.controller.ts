import { tavilyGet, huggingface } from "../services/ia";
import { wired } from "../services/search-feed/wired";
import { News } from "../types/news";

export default async function getNews(): Promise<News> {
  try {
    const prompt = `Você é especialista em tecnologia. Retorne apenas 1 tema de tecnologia mais relevante da semana atual. Responda somente com JSON válido, sem markdown ou texto extra. Use português do Brasil, informações reais e atuais e uma URL de imagem válida.

{"week_reference":"YYYY-MM-DD","topic":{"title":"Até 30 caracteres","description":"Resumo","image":"https://imagem.jpg"}}`;

    const providers = [
      () => tavilyGet(prompt),
      () => huggingface(prompt),
      () => wired(),
    ];

    let response = null;

    for (const provider of providers) {
      response = await provider();

      if (response?.success) {
        break;
      }
    }

    if (!response?.success) {
      return {
        sucess: false,
        provider: null,
        message: "erro ao buscar notícias",
        data: null,
      };
    }

    return {
      sucess: true,
      provider: response.provider,
      message: "sucesso ao buscar notícias",
      data: response.data,
    };
  } catch (error) {
    console.error("erro ao buscar notícias:", error);
    return {
      sucess: false,
      provider: null,
      message: "internal server error",
      data: null,
    };
  }
}
