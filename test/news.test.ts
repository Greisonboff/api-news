import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FastifyInstance } from "fastify";

vi.mock("../src/services/ia/providers/tavily", () => ({
  tavilySearch: vi.fn(),
}));
vi.mock("../src/services/search-feed/wired", () => ({
  wired: vi.fn(),
}));

import { buildApp } from "../src/app";
import { tavilySearch } from "../src/services/ia/providers/tavily";
import { wired } from "../src/services/search-feed/wired";
import { Provider } from "../src/types/news";

const tavilyMock = vi.mocked(tavilySearch);
const wiredMock = vi.mocked(wired);

const headers = { "x-api-key": "test-key" };

const article = (title: string) => ({ title, content: `conteúdo ${title}` });

describe("API", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = await buildApp({ logger: false });
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET /health responde sem API key", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
  });

  it("GET /news sem API key retorna 401", async () => {
    const res = await app.inject({ method: "GET", url: "/news" });
    expect(res.statusCode).toBe(401);
  });

  it("GET /news com API key errada retorna 401", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/news",
      headers: { "x-api-key": "errada" },
    });
    expect(res.statusCode).toBe(401);
  });

  it.each(["2.5", "0", "11", "abc"])("limit=%s retorna 400", async (limit) => {
    const res = await app.inject({
      method: "GET",
      url: `/news?limit=${limit}`,
      headers,
    });
    expect(res.statusCode).toBe(400);
  });

  it("retorna dados da Tavily quando ela funciona", async () => {
    tavilyMock.mockResolvedValue({
      success: true,
      provider: Provider.TAVILY,
      message: "ok",
      data: [article("a"), article("b")],
    });

    const res = await app.inject({
      method: "GET",
      url: "/news?limit=2",
      headers,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({
      success: true,
      provider: "tavily",
      message: "sucesso ao buscar notícias",
      data: [article("a"), article("b")],
    });
    expect(tavilyMock).toHaveBeenCalledWith(2);
    expect(wiredMock).not.toHaveBeenCalled();
  });

  it("cai para o Wired quando a Tavily falha", async () => {
    tavilyMock.mockResolvedValue({
      success: false,
      provider: Provider.TAVILY,
      message: "erro",
    });
    wiredMock.mockResolvedValue({
      success: true,
      provider: Provider.WIRED,
      message: "ok",
      data: [article("w")],
    });

    const res = await app.inject({ method: "GET", url: "/news", headers });

    expect(res.statusCode).toBe(200);
    expect(res.json().provider).toBe("wired");
    expect(wiredMock).toHaveBeenCalledWith(1);
  });

  it("retorna 502 quando todos os providers falham", async () => {
    tavilyMock.mockResolvedValue({
      success: false,
      provider: Provider.TAVILY,
      message: "erro",
    });
    wiredMock.mockResolvedValue({
      success: false,
      provider: Provider.WIRED,
      message: "erro",
    });

    const res = await app.inject({ method: "GET", url: "/news", headers });

    expect(res.statusCode).toBe(502);
    expect(res.json()).toEqual({
      success: false,
      provider: null,
      message: "erro ao buscar notícias",
      data: null,
    });
  });

  it("busca dados novos a cada consulta", async () => {
    tavilyMock.mockResolvedValue({
      success: true,
      provider: Provider.TAVILY,
      message: "ok",
      data: [article("a")],
    });

    await app.inject({ method: "GET", url: "/news", headers });
    const res = await app.inject({ method: "GET", url: "/news", headers });

    expect(res.statusCode).toBe(200);
    expect(tavilyMock).toHaveBeenCalledTimes(2);
  });

  it("retorna 429 acima do limite de requisições", async () => {
    let last = 0;
    for (let i = 0; i < 31; i++) {
      last = (await app.inject({ method: "GET", url: "/health" })).statusCode;
    }
    expect(last).toBe(429);
  });
});
