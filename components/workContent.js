import {ExternalLinkIcon, AppleIcon} from "lib/icons"

export default function WorkContent({ post }) {
  return (
    <div className="inline-flex flex-col items-center justify-start w-full h-screen px-5 md:px-10 pt-10 pb-32 overflow-y-auto">
      {post?.icon ? (
        <div className="w-12 h-12 mx-auto mb-5">
          <img src={post?.icon} className="mb-4 border border-gray-100 rounded-full shadow-lg dark:border-gray-600" />
        </div>
      ) : (
        ""
      )}
      <h1 className="text-4xl mb-5 font-black md:text-4xl text-center max-w-[620px] mx-auto">
        {post.title}
      </h1>
      {post?.tech ? (
        <div className="flex mb-5 space-x-4 text-sm">
          {post?.tech.map((tech) => (
            <div
              key={tech}
              className="px-2 py-px font-mono bg-gray-200 rounded-lg dark:bg-black"
            >
              {tech}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      <div className="flex justify-center items-center space-x-5 max-w-[620px] w-full mt-5 mb-10">
        {post?.web ? (
          <a
            href={post?.web}
            target="_blank"
            className="flex items-center justify-center w-full px-4 py-1 text-lg text-center text-white bg-black rounded-lg shadow-lg dark:bg-white dark:text-black"
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
            className="flex items-center justify-center w-full px-4 py-1 text-lg text-center text-white bg-black rounded-lg shadow-lg dark:bg-white dark:text-black"
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
