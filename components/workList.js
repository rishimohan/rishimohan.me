import Link from "next/link";
import classnames from "classnames";
import { useRouter } from "next/router";

export default function WorkList() {
  const { query: {slug} } = useRouter();
  const PROJECTS = [
    {
      title: "Kizie",
      slug: "/kizie",
      activeSlug: slug == "kizie",
      excerpt:
        "Kizie is a new way of using Twitter, with features like Undo Tweet, Quick Media Preview and More",
      tech: ["Next.js", "TailwindCSS", "Supabase"],
    },
    {
      title: "Maazi",
      slug: "/maazi",
      activeSlug: slug == "maazi",
      excerpt:
        "A personal diary app for iOS and Android which lets you log your experiences as text entries and voice recordings on your phone",
      tech: ["React Native", "TailwindRN", "Firebase"],
    },
    {
      title: "Qurb",
      slug: "/qurb",
      activeSlug: slug == "qurb",
      excerpt:
        "Quickest way to create mockups for iPhone, iPad, Galaxy Note and Macbook on the web. Select device, select device color and done.",
      tech: ["React.js", "SCSS"],
    },
    {
      title: "Zinx",
      slug: "/zinx",
      activeSlug: slug == "zinx",
      excerpt:
        " ZINX is a tech and design blog which has recieved over 3 million hits till now, and has been linked by blogs like Mashable, The Next Web and LifeHacker.",
      tech: ["PHP", "WordPress"],
    },
  ];

  return (
    <div className="max-w-[360px] w-full h-screen overflow-auto border-r border-gray-100 px-4 pt-10 flex-none">
      {PROJECTS?.map((post) => (
        <Link href={`/work${post.slug}`} key={post.slug}>
          <article
            className={classnames(
              "px-5 py-3 my-1 border-b border-gray-100 rounded-lg cursor-pointer group",
              { "bg-black": post?.activeSlug },
              { "hover:bg-gray-100": !post?.activeSlug }
            )}
          >
            <h2
              className={classnames("font-semibold", {
                "text-white": post?.activeSlug,
              })}
            >
              {post.title}
            </h2>
            <p
              className={classnames(
                { "text-gray-600": !post?.activeSlug },
                {
                  "text-gray-400": post?.activeSlug,
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
