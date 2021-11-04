import {remark} from "remark";
import html from "remark-html";

export default async function md2html(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
