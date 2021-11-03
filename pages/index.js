import Head from 'next/head'
import {Sidebar} from "components"
import { getAllPosts } from './api/api';

export default function Home({ allPosts }) {
  console.log("All", allPosts);
  return (
    <>
      <Head>
        <title>Rishi Mohan</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-start min-h-screen">
        <Sidebar />
      </main>
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
    "content"
  ]);

  return {
    props: { allPosts },
  };
}