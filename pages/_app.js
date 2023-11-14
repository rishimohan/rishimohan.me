import { ThemeProvider } from "next-themes";
import "styles/app.scss";
import "styles/blog.scss";
import MainLayout from "layouts/main";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const canonicalUrl = (
    `https://rishimohan.me` + (router.asPath === "/" ? "" : router.asPath)
  ).split("?")[0];

  return (
    <ThemeProvider defaultTheme="system" attribute="class" enableSystem={true}>
      <>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;900&display=swap"
            rel="stylesheet"
          />
        </Head>
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
