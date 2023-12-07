import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

export default function WorkList({ allPosts, activeSlug }) {
  const {
    query: { slug },
  } = useRouter();

  return (
    <div className="w-full">
      <div
      // className={clsx(
      //   "bg-gray-50 dark:bg-gray-900 overflow-auto rounded-lg h-full border border-gray-200/50 dark:border-gray-800/50"
      // )}
      >
        <h2 className="font-medium text-black text-2xl mb-4 mt-4">
          Side projects
        </h2>
        <div className="last:!border-b-0">
          {allPosts?.map((post) => (
            <div
              key={post.slug}
              // className="border-gray-200/50 dark:border-gray-800/50 py-[5px] border-b"
            >
              <Link href={`/projects/${post.slug}`} className="w-full">
                <article
                  className={clsx(
                    "flex  border-dashed font-medium w-full py-3 md:py-[12px] dark:text-white border-b border-gray-200 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500 flex-row",
                    activeSlug == post.slug ? "text-black" : "text-gray-800 "
                  )}
                  // className={clsx(
                  //   "rounded-lg flex items-center text-sm w-full py-[10px] transition-all duration-150 ease-in-out  dark:text-white",
                  //   activeSlug == post.slug
                  //     ? "bg-white text-black dark:bg-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                  //     : "text-gray-800  hover:bg-white dark:hover:bg-gray-800 hover:shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                  // )}
                >
                  {post?.icon ? (
                    <img
                      src={post?.icon}
                      alt={post.title}
                      className="w-6 h-6 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:border-gray-800"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-6 h-6 text-lg font-bold text-white bg-black border border-gray-100 rounded-full dark:border-gray-800">
                      {post?.title?.slice(0, 1)}
                    </div>
                  )}
                  <h2 className={clsx("font-semibold ml-3")}>{post.title}</h2>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
