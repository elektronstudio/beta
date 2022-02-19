import { marked } from "marked";

export const formatMarkdown = (text = "") =>
  text
    ? marked(text, {
        breaks: true,
      })
    : "";
