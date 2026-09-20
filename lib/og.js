// Orshot dynamic URL — renders the OG card straight from template 20195.
// No API route and no API key: the signature is per-template, and the
// modifications ride along as plain query params.
const DYNAMIC_URL =
  "https://api.orshot.com/v1/studio/dynamic-url/rishimohan-og.png?templateId=20195&sign=835bb87b1853a4e0";

export const ogImage = ({ title, masthead } = {}) => {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (masthead) params.set("masthead", masthead);

  const query = params.toString();
  return query ? `${DYNAMIC_URL}&${query}` : DYNAMIC_URL;
};
