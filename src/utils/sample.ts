/**
 * Retorna até `count` itens sorteados de `items`, sem repetição (Fisher-Yates parcial).
 * Não altera o array original.
 */
export function sample<T>(items: readonly T[], count: number): T[] {
  const copy = [...items];
  const size = Math.min(count, copy.length);

  for (let i = 0; i < size; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, size);
}
