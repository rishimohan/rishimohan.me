import {ExternalLinkIcon} from "lib/icons"

export default function PostContent({ post }) {
  return (
    <div className="inline-flex flex-col items-center justify-start w-full h-screen px-5 md:px-10 pt-10 pb-32 overflow-y-auto">
      {post?.link && post?.image ? (
        <div className="max-w-[620px] mx-auto">
          <img src={post.image} className="mb-4 rounded-lg" />
        </div>
      ) : (
        ""
      )}
      <div className="text-center text-gray-400 dark:text-gray-600">
        {new Date(post?.date.slice(0, 10)).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <h1 className="text-3xl mb-10 font-black md:text-4xl text-center max-w-[620px] mx-auto">
        {post.title}
      </h1>
      <div
        dangerouslySetInnerHTML={{ __html: post?.content }}
        className="inline-block mx-auto post-content"
      />
      {post?.link ? (
        <a
          href={post?.link}
          target="_blank"
          className="w-full py-1 bg-black rounded-lg shadow-lg max-w-[620px] text-white text-lg text-center flex items-center justify-center dark:bg-white dark:text-black"
        >
          <span className="w-5 h-5 mr-2">{ExternalLinkIcon}</span>
          <span>Visit Link</span>
        </a>
      ) : (
        ""
      )}
    </div>
  );
}
