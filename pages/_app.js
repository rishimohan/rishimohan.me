import { ThemeProvider } from 'next-themes'
import "styles/app.scss";
import "styles/blog.scss";
import MainLayout from "layouts/main";
import {DefaultSeo} from "next-seo";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="system" attribute="class" enableSystem={true}>
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
          additionalLinkTags={[
            {
              rel: "apple-touch-icon",
              href: "/touch-icons/apple-touch-icon-ipad-76x76.png",
              sizes: "76x76",
            },
            {
              rel: "apple-touch-icon",
              href: "/touch-icons/apple-touch-icon-ipad-retina-152x152.png",
              sizes: "152x152",
            },
            {
              rel: "apple-touch-icon",
              href: "/touch-icons/apple-touch-icon-iphone-60x60.png",
              sizes: "60x60",
            },
            {
              rel: "apple-touch-icon",
              href: "/touch-icons/apple-touch-icon-iphone-retina-120x120.png",
              sizes: "120x120",
            },
          ]}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-38898205-6"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-38898205-6');
          `,
          }}
        />
        <Component {...pageProps} />
      </MainLayout>
    </ThemeProvider>
  );
}

export default MyApp;
