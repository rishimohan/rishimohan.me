import Head from 'next/head'
import {BlogList} from 'components'
import {getAllPosts} from "pages/api/blog"

export default function Blog({ allPosts }) {
  return (
    <>
      <Head>
        <title>Blog - Rishi Mohan</title>
      </Head>

      <BlogList data={allPosts} />
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
    "content",
  ]);

  return {
    props: { allPosts },
  };
}
