import { useEffect } from "react";
import { useRouter } from "next/router";
import { getPostBySlug, getAllPosts } from "pages/api/blog";
import md2html from "lib/md2html";
import { BlogList, PostContent } from "components";
import { NextSeo } from "next-seo";
import { ContentWrapper } from "ui";

export default function Post({ allPosts, post }) {
  const router = useRouter();

  useEffect(() => {
    const s = document.createElement("script");
    s.setAttribute("src", "https://platform.twitter.com/widgets.js");
    s.setAttribute("async", "true");
    document.head.appendChild(s);
  }, []);

  if (!router.isFallback && !post?.slug) {
    return <div>Error</div>;
  }

  return (
    <div className="flex w-full md:pt-5">
      <NextSeo
        title={`${post.title} - Rishi Mohan`}
        description={post.excerpt || post.content.slice(0, 200) || ""}
        openGraph={{
          site_name: `${post.title} - Rishi Mohan`,
          title: `${post.title} - Rishi Mohan`,
          description: post.excerpt || post.content.slice(0, 200) || "",
          images: [
            {
              url:
                post.ogImage ??
                "https://rishimohan.vercel.app/images/site/meta.jpg",
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
      <ContentWrapper width="620px">
        <PostContent post={post} />
        <div className="border-t border-gray-200 dark:border-gray-800">
          <h2 className="mb-2 mt-10 text-xl font-medium text-black dark:text-white">
            More blog posts
          </h2>
        </div>
        <BlogList
          data={allPosts
            .filter((p) => !router.asPath.includes(p.slug))
            .slice(0, 10)}
        />
      </ContentWrapper>
      {/* <TwitterScript /> */}
    </div>
  );
}

export async function getStaticProps({ params }) {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "image",
    "excerpt",
    "content",
    "link",
    "ogImage",
  ]);

  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "image",
    "content",
    "excerpt",
    "link",
    "ogImage",
  ]);

  const content = await md2html(post.content || post.excerpt || "");

  return {
    props: {
      allPosts,
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "image",
    "excerpt",
    "content",
    "ogImage",
  ]);
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          allPosts,
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
