import { autoType } from "d3-dsv";
import { ref } from "vue";

export const parseControls = (controlsConfig: string) => {
  return controlsConfig
    .split(/\n---\s*\n/g)
    .map((chunk) =>
      chunk
        .split("\n")
        .filter((row) => row.trim())
        .map((row) => {
          return row.split(/:\s*(.+)/).filter((r) => r);
        }),
    )
    .map((chunk) => autoType(Object.fromEntries(chunk)))
    .map((chunk: any) => {
      if (!chunk) {
        return;
      }
      return {
        control: chunk.control === "text" ? "text" : "slider",
        title: "",
        description: "",
        min: 0,
        max: chunk.max > chunk.min ? chunk.max : 10,
        step: "any",
        ...chunk,
        value: ref(chunk.control === "text" ? "" : chunk.value ?? 0),
        labels: chunk.labels
          ? chunk.labels.split(",").map((l) => l.trim())
          : null,
      };
    });
};
