import { BlogList } from "components";
import { getAllPosts } from "pages/api/blog";
import { NextSeo } from "next-seo";
import { ContentWrapper } from "ui";

export default function Pen({}) {
  return (
    <>
      <NextSeo title="Pen - Rishi Mohan" />

      <ContentWrapper width="620px">
        <h2 className="font-medium text-black text-2xl mb-4 mt-4">Pen</h2>
        <p className="mb-4 pb-4">
          Random thoughts, lines and everything that crosses my mind, now on
          this paper
        </p>
        <hr />
        <div className="post-content mt-4">
          <div className="mb-4">
            March 10, 2025 at 23:10 / Watching Hridayam
          </div>
          <pre>
            <code>
              pyaar nhi karte na ab <br />
              log intezar nhi karte <br />
              dil bhi nhi lagate <br />
              aur inkar bhi nhi karte
            </code>
          </pre>
        </div>
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
