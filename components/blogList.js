import Link from "next/link";
import clsx from "clsx";
import { ArrowSquareOut } from "phosphor-react";

export default function BlogList({ data, activeSlug }) {
  return (
    <div
      className={clsx(
        "w-full text-sm",
        activeSlug != undefined && "hidden lg:flex flex-col"
      )}
    >
      <div className="last:!border-b-0">
        {data?.map((post) => (
          <div key={post.slug} className="">
            <Link href={`/blog/${post.slug}`}>
              <article
                className={clsx(
                  "flex  border-dashed font-medium w-full py-3 md:py-[8px] dark:text-white border-b border-gray-200 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500 flex-col md:flex-row",
                  activeSlug == post.slug ? "text-black" : "text-gray-800 "
                )}
              >
                <h2
                  className={clsx(
                    "inline-flex",
                    activeSlug === post.slug
                      ? "text-black dark:text-white"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  <span>{post?.title}</span>
                  {/* {post?.link ? (
                      <span className="inline-flex ml-auto text-gray-400 dark:text-gray-600">
                        <ArrowSquareOut size={14} />
                      </span>
                    ) : (
                      ""
                    )} */}
                </h2>
                <div
                  className={clsx(
                    "md:pl-2 md:ml-auto font-normal opacity-60 dark:opacity-40"
                  )}
                >
                  {new Date(
                    post?.date.split(" ").slice(0, -1).join(" ")
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </article>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
