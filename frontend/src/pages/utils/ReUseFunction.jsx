export const formatText = (text) => {
  if (!text || typeof text !== "string") return ""; //  prevents crash
  return text
    .replace(/([A-Z]+)/g, " $1")
    .replace(/^\s+/, "")
    .replace(/^\w/, (c) => c.toUpperCase());
};
