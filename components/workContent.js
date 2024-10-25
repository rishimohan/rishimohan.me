import { ExternalLinkIcon, AppleIcon } from "lib/icons";
import clsx from "clsx";

export default function WorkContent({ post }) {
  console.log("p", post);
  return (
    <div
      key={post.title}
      className="inline-flex flex-col items-center justify-start w-full pb-32"
    >
      {post?.icon ? (
        <div className="w-12 h-12 mx-auto mb-5">
          <img
            src={post?.icon}
            className="mb-4 border border-gray-100 rounded-full shadow-lg dark:border-gray-600"
          />
        </div>
      ) : (
        ""
      )}
      <h1 className="text-4xl mb-5 font-black md:text-4xl text-center max-w-[620px] mx-auto dark:text-white">
        {post.title}
      </h1>
      <div className="flex gap-2 items-center justify-center mb-5">
        <div className="flex gap-2 items-center">
          {post?.status ? (
            <span
              className={clsx(
                "font-mono border  px-1 py-px rounded-md text-gray-600 dark:text-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3)] text-xs",
                post?.status === "Active"
                  ? "border-green-500 dark:bg-green-500/30 dark:border-green-800 dark:text-green-200 bg-green-100 text-green-700"
                  : "border-gray-200 dark:border-gray-700"
              )}
            >
              {post?.status}
            </span>
          ) : (
            ""
          )}
          {post?.statusText?.length
            ? post?.statusText?.map((status) => (
                <span
                  key={status}
                  className={clsx(
                    "font-mono border  px-1 py-px rounded-md text-gray-600 dark:text-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3)] text-xs border-gray-200 dark:border-gray-700"
                  )}
                >
                  {status}
                </span>
              ))
            : ""}
        </div>
        {post?.tech ? (
          <div className="flex gap-2 text-xs">
            {post?.tech.map((tech) => (
              <div
                key={tech}
                className="font-mono border border-gray-200 dark:border-gray-700 px-1 py-px rounded-md text-gray-600 dark:text-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3)] text-xs"
              >
                {tech}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex justify-center items-center space-x-5 max-w-[620px] w-full mt-5 mb-10">
        {post?.web ? (
          <a
            href={post?.web}
            target="_blank"
            className="flex items-center justify-center w-full px-4 py-1 text-base text-center text-white bg-black rounded-lg shadow-lg dark:bg-white dark:text-black"
          >
            <span className="w-5 h-5 mr-2">{ExternalLinkIcon}</span>
            <span>Web App</span>
          </a>
        ) : (
          ""
        )}
        {post?.ios ? (
          <a
            href={post?.ios}
            target="_blank"
            className="flex items-center justify-center w-full px-4 py-1 text-base text-center text-white bg-black rounded-lg shadow-lg dark:bg-white dark:text-black"
          >
            <span className="w-5 h-5 mr-2">{AppleIcon}</span>
            <span>iOS App</span>
          </a>
        ) : (
          ""
        )}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: post?.content }}
        className="inline-block mx-auto post-content"
      />
    </div>
  );
}
