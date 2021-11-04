import "styles/app.scss";
import "styles/blog.scss";
import MainLayout from "layouts/main";
import {DefaultSeo} from "next-seo";
import {useRouter} from "next/router";

function MyApp({ Component, pageProps }) {
  return (
    <MainLayout>
      <DefaultSeo
        title="Hi, I'm Rishi Mohan!"
        description="I'm a designer and front-end engineer by profession. I like to travel, take photos and binge try Cafes and Restaurants."
        openGraph={{
          site_name: "Hi, I'm Rishi Mohan!",
          title: "Hi, I'm Rishi Mohan!",
          description:
            "I'm a designer and front-end engineer by profession. I like to travel, take photos and binge try Cafes and Restaurants.",
          images: [
            {
              url: "https://rishimohan.vercel.app/images/site/meta.jpg",
              width: 800,
              height: 600,
              alt: "Kizie for Twitter",
            },
          ],
        }}
        twitter={{
          handle: "@thelifeofrishi",
          site: "@thelifeofrishi",
          cardType: "summary_large_image",
        }}
      />
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp;
