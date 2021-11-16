import Link from "next/link";
import classnames from "classnames";
import { useRouter } from "next/router";

export default function WorkList({ allPosts, activeSlug }) {
  const {
    query: { slug },
  } = useRouter();
  
  return (
    <div
      className={classnames(
        "md:max-w-[360px] w-full h-screen overflow-auto border-r border-gray-100 px-4 pt-10 pb-20 flex-none dark:border-gray-800",
        { "hidden lg:flex flex-col": slug != undefined }
      )}
    >
      {allPosts?.map((post) => (
        <Link href={`/work/${post.slug}`} key={post.slug}>
          <article
            className={classnames(
              "px-5 py-3 my-1 border-b border-gray-100 rounded-lg cursor-pointer group flex items-center dark:hover:bg-black dark:border-gray-900",
              { "bg-black": activeSlug == post.slug },
              { "hover:bg-gray-100": activeSlug != post.slug }
            )}
          >
            {post?.icon ? (
              <img
                src={post?.icon}
                alt={post.title}
                className="w-10 h-10 bg-white border border-gray-100 rounded-full shadow-lg dark:border-gray-600"
              />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white bg-black border border-gray-100 rounded-full">
                {post?.title?.slice(0, 1)}
              </div>
            )}
            <h2
              className={classnames("font-semibold ml-3", {
                "text-white": activeSlug == post.slug,
              })}
            >
              {post.title}
            </h2>
          </article>
        </Link>
      ))}
    </div>
  );
}

