import { BlogList } from "components";
import { getAllPosts } from "pages/api/blog";
import { NextSeo } from "next-seo";
import { ContentWrapper } from "ui";

export default function Blog({ allPosts }) {
  return (
    <>
      <NextSeo
        title="Blog - Rishi Mohan"
        description="I'm a designer and front-end engineer by profession. I like to travel, take photos and binge try Cafes and Restaurants."
        openGraph={{
          site_name: "Blog - Rishi Mohan",
          title: "Blog - Rishi Mohan",
          description:
            "I'm a designer and front-end engineer by profession. I like to travel, take photos and binge try Cafes and Restaurants.",
        }}
        twitter={{
          handle: "@thelifeofrishi",
          site: "@thelifeofrishi",
          cardType: "summary_large_image",
        }}
      />

      <ContentWrapper width="620px">
        <h2 className="font-medium text-black text-2xl mb-4 mt-10">Blog</h2>
        <BlogList data={allPosts} />
      </ContentWrapper>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "image",
    "excerpt",
    "external",
  ]);

  return {
    props: { allPosts },
  };
}
