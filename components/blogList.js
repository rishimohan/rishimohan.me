import Link from "next/link";
import clsx from "clsx";
import {
  ArrowSquareOut,
} from "phosphor-react";

export default function BlogList({ data, activeSlug }) {
  return (
    <div
      className={clsx(
        "md:max-w-[320px] w-full h-screen p-3",
        activeSlug != undefined && "hidden lg:flex flex-col"
      )}
    >
      <div
        className={clsx(
          "bg-gray-50 dark:bg-gray-900 overflow-auto rounded-lg h-full border border-gray-200/50 dark:border-gray-800/50"
        )}
      >
        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200/50 dark:border-gray-800 top-0 sticky bg-gray-50 dark:bg-gray-900">
          Blog
        </div>
        <div className="h-[calc(100vhh-24px)] overflow-auto">
          {data?.map((post) => (
            <div
              key={post.slug}
              className="border-gray-200/50 dark:border-gray-800/50 p-[5px] border-b"
            >
              <Link href={`/blog/${post.slug}`}>
                <article
                  className={clsx(
                    "rounded-lg flex flex-col text-sm w-full py-[10px] px-3 transition-all duration-150 ease-in-out  dark:text-white",
                    activeSlug == post.slug
                      ? "bg-white text-black dark:bg-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                      : "text-gray-800  hover:bg-white dark:hover:bg-gray-800 hover:shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                  )}
                >
                  <h2
                    className={clsx(
                      "inline-flex leading-[1.3] font-semibold",
                      activeSlug === post.slug
                        ? "text-black dark:text-white"
                        : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {post?.title}
                    {post?.link ? (
                      <span className="inline-flex ml-auto text-gray-400 dark:text-gray-600">
                        <ArrowSquareOut size={14} />
                      </span>
                    ) : (
                      ""
                    )}
                  </h2>
                  <div
                    className={clsx(
                      "text-xs font-semibold mt-1",
                      activeSlug == post.slug ? "opacity-60" : "opacity-30"
                    )}
                  >
                    {new Date(post?.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  {/* <p
              className={clsx(
                activeSlug != post.slug
                  ? "text-gray-600 dark:text-gray-500"
                  : "text-gray-400"
              )}
            >
              {post?.excerpt?.slice(0, 30)}
              {post?.excerpt?.length > 70 ? "..." : ""}
            </p> */}
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
