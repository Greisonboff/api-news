import { Provider } from "../../../types/news";

export async function huggingface(prompt: string) {
  console.log("token", process.env.IA_TOKEN_HUGGINFACE);
  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.IA_TOKEN_HUGGINFACE}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-8B-Instruct",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      },
    );

    const data = await response.json();
    console.log(data);

    const formatedData = JSON.parse(data.choices[0].message.content);

    return {
      success: true,
      provider: Provider.HUGGINGFACE,
      message: "sucesso ao buscar ia",
      data: formatedData.topic,
    };
  } catch (error) {
    console.error("erro ao buscar ia huggingface:", error);
    return {
      success: false,
      provider: Provider.HUGGINGFACE,
      message: "erro ao buscar ia",
    };
  }
}
