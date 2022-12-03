import md from "markdown-it";

export default async function md2html(markdown) {
  return md({
    html: true,
    linkify: true,
    typographer: true,
  }).render(markdown);
}
