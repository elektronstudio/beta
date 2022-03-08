// TODO: Move to elektro
export function replaceTokens(str: string, obj: Record<string, string>) {
  return str.replace(/\${(.*?)}/g, (_, v) => obj[v]);
}

export const split = (str = "", separator = ",") =>
  str
    .split(separator)
    .map((s) => s.trim())
    .filter((s) => s);
