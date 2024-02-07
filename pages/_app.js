import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import "styles/app.scss";
import "styles/blog.scss";
import MainLayout from "layouts/main";
import { DefaultSeo } from "next-seo";
import Script from "next/script";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const canonicalUrl = (
    `https://rishimohan.me` + (router.asPath === "/" ? "" : router.asPath)
  ).split("?")[0];

  useEffect(() => {
    window.addEventListener("message", (event) => {
      console.log(
        "Message received from the child: " + event?.data,
        event?.data?.message,
        event?.data?.blob
      ); // Message received from child
    });
  }, []);

  return (
    <ThemeProvider defaultTheme="system" attribute="class" enableSystem={true}>
      <>
        <DefaultSeo
          title="Hi, I'm Rishi Mohan!"
          description="I'm a designer and front-end engineer by profession. I build SaaS apps, like to travel, take photos and binge try Cafes and Restaurants."
          canonical={canonicalUrl}
          openGraph={{
            site_name: "Hi, I'm Rishi Mohan!",
            title: "Hi, I'm Rishi Mohan!",
            description:
              "I'm a designer and front-end engineer by profession. I build SaaS apps, like to travel, take photos and binge try Cafes and Restaurants.",
            images: [
              {
                url: "https://rishimohan.me/images/site/meta.jpg",
                width: 800,
                height: 600,
                alt: "Rishi Mohan",
              },
            ],
          }}
          twitter={{
            handle: "@thelifeofrishi",
            site: "@thelifeofrishi",
            cardType: "summary_large_image",
          }}
          additionalLinkTags={[
            {
              rel: "apple-touch-icon",
              href: "/touch-icons/main-icon.png",
            },
          ]}
        />

        {process.env.NODE_ENV == "production" ? (
          // Analytics Script
          <Script
            src="https://api.pirsch.io/pirsch.js"
            id="pirschjs"
            data-code={process.env.NEXT_PUBLIC_PIRSCH_KEY}
            strategy="afterInteractive"
          />
        ) : (
          ""
        )}

        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </>
    </ThemeProvider>
  );
}

export default MyApp;
