export default async function handler(req, res) {
  const { title, description } = req.query;

  const response = await fetch(
    `https://api.pika.style/v1/templates/open-graph-image-1/images`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PIKA_API_KEY}`,
      },
      body: JSON.stringify({
        response_format: "binary",
        modifications: {
          title: title,
          description: description,
          textColor: "#fff",
          backgroundColor: "#111",
          backgroundImageUrl: "https://rishimohan.me/images/site/meta-bg.png",
        },
      }),
    }
  ).then(async (res) => {
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  });

  // console.log("response", response);
  res.writeHead(200, {
    "Content-Type": "image/png",
  });
  res.end(response);
}
