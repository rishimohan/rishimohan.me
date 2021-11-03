import Link from "next/link";
import classnames from "classnames";
import {ExternalLinkIcon} from "lib/icons";

export default function BlogList({ data, activeSlug }) {
  return (
    <div
      className={classnames(
        "md:max-w-[360px] w-full h-screen overflow-auto border-r border-gray-100 px-4 py-10 flex-none",
        { "hidden lg:flex flex-col": activeSlug != undefined }
      )}
    >
      {data?.map((post) => (
        <Link href={`/blog/${post.slug}`} key={post.slug}>
          <article
            className={classnames(
              "px-5 py-3 my-1 border-b border-gray-100 rounded-lg cursor-pointer group",
              { "bg-black": activeSlug == post.slug },
              { "hover:bg-gray-100": activeSlug != post.slug }
            )}
          >
            <h2
              className={classnames("font-semibold", {
                "text-white": activeSlug == post.slug,
              })}
            >
              {post?.link ? (
                <span className="relative top-[1px] inline-block w-4 h-4 ml-auto mr-2 text-gray-400">
                  {ExternalLinkIcon}
                </span>
              ) : (
                ""
              )}
              {post?.title}
            </h2>
            <p
              className={classnames(
                { "text-gray-600": activeSlug != post.slug },
                {
                  "text-gray-400": activeSlug == post.slug,
                }
              )}
            >
              {post?.excerpt?.slice(0, 100)}
            </p>
          </article>
        </Link>
      ))}
    </div>
  );
}
