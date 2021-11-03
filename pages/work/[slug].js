import { useRouter } from "next/router";
import { WorkList, WorkContent } from "components";
import Head from "next/head";
import {getAllPosts, getPostBySlug} from "pages/api/work";
import md2Html from "lib/md2Html";

export default function Post({ post }) {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <div>Error</div>;
  }

  return (
    <div className="flex w-full">
      <Head>
        <title>{post.title} – Rishi Mohan</title>
      </Head>
      <WorkList />
      <WorkContent post={post} />
    </div>
  );
}

export async function getStaticProps({ params }) {

  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "image",
    "content",
    "excerpt",
    "link",
    "tech",
    "web",
    "ios",
    "icon"
  ]);

  const content = await md2Html(post.content || post.excerpt || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
