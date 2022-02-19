// TODO: Move to elektro
export function replaceTokens(str: string, obj: Record<string, string>) {
  return str.replace(/\${(.*?)}/g, (_, v) => obj[v]);
}
