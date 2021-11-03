import Link from "next/link";
import classnames from "classnames";

export default function BlogList({ data, activeSlug }) {
  return (
    <div className="max-w-[360px] w-full h-screen overflow-auto border-r border-gray-100 px-4 pt-10 flex-none">
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
              {post.title}
            </h2>
            <p
              className={classnames(
                { "text-gray-600": activeSlug != post.slug },
                {
                  "text-gray-400": activeSlug == post.slug,
                }
              )}
            >
              {post.excerpt.slice(0, 100)}
            </p>
          </article>
        </Link>
      ))}
    </div>
  );
}
