function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }

  return value;
}

function port(): number {
  const raw = process.env.PORT?.trim() || "3030";
  const value = Number(raw);

  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`Variável de ambiente PORT inválida: ${raw}`);
  }

  return value;
}

export const env = {
  API_KEY_AUTH: required("API_KEY_AUTH"),
  IA_TOKEN_TAVILY: required("IA_TOKEN_TAVILY"),
  PORT: port(),
} as const;
