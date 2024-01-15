import { PikaSdk } from "pika-sdk";
const pikaSdk = new PikaSdk(process.env.PIKA_API_KEY);

export default async function handler(req, res) {
  const { title, description } = req.query;

  const response = await pikaSdk.generateImageFromTemplate(
    "open-graph-image-1",
    {
      title: title,
      description: description,
      textColor: "#fff",
      backgroundImageUrl: "https://rishimohan.me/images/site/meta-bg.png",
    },
    "binary"
  );

  const arrayBuffer = await response.arrayBuffer();
  const image = Buffer.from(arrayBuffer);

  res.writeHead(200, {
    "Content-Type": "image/png",
  });
  res.end(image);
}
