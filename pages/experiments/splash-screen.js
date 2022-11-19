import { useEffect, useState } from "react"
import classnames from "classnames";
import {SpinnerIcon, ArrowIcon} from "lib/icons"
import {NextSeo} from "next-seo"
import Link from "next/link"

export default function Splash() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setLoaded(true);
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        setShowContent(true);
      }, 1200)
    }, 3000);
  }, [])

  const RenderContent = () => {
    return (
      <div
        className={classnames(
          "flex items-center justify-center min-h-screen max-w-[550px] mx-auto py-20 antialiased px-5",
          { "scale-0 opacity-0 duration-[200ms]": !showContent },
          { "scale-100 opacity-100": showContent }
        )}
      >
        <div>
          <Link
            href="/experiments"
            className={classnames(
              "py-1 rounded-lg text-gray-500 dark:text-gray-500 shadow-gray-200/10 flex items-center"
            )}>

            <span className="w-5 h-5 rotate-180">{ArrowIcon}</span>View all experiments
          </Link>
          <div>
            <h1 className="text-4xl font-black">Splash Screen</h1>
            <p className="mt-10 text-xl opacity-50">
              A simple splash screen implementation for Web apps. It uses
              Tailwind CSS and React's state for animations.
            </p>
            <p className="mt-10 text-xl opacity-50">
              I plan to eventually release it as a separate NPM package which
              can just be imported and ready to use. Till then it'll go under
              interations until it's right.
            </p>
          </div>
          <div className="mt-8">
            <button
              className={classnames(
                "px-4 py-1 bg-white border border-gray-500 rounded-lg shadow-lg dark:bg-gray-900 dark:border-gray-700/70 dark:text-gray-200 shadow-gray-200/10 dark:shadow-gray-900 inline-flex"
              )}
              onClick={() => window.location.reload()}
            >
              Preview again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NextSeo
        title="Splash Screen - Rishi Mohan"
        description="An open-source splash screen implementation for web apps made in Tailwind CSS and React"
        openGraph={{
          site_name: "Hi, I'm Rishi Mohan!",
          title: "Splash Screen Implementation on Web - Rishi Mohan",
          description: "An open-source splash screen implementation for web apps made in Tailwind CSS and React.",
        }}
      />
      {!showContent ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-[#111]">
          <div
            className={classnames(
              "font-black text-white text-4xl transform-gpu flex items-center justify-center flex-col"
            )}
          >
            <div
              className={classnames(
                "ease-[cubic-bezier(.75,-0.5,0,1.75)] duration-[800ms]",
                {
                  "scale-100": loaded,
                },
                { "scale-0 opacity-0 blur-0": !loaded },
                {
                  "scale-[2] opacity-0": isLoading,
                }
              )}
            >
              <img
                src="/images/experiments/kizie-icon.png"
                className="w-[64px] h-[64px] shadow-lg rounded-2xl"
              />
            </div>
            <div
              className={classnames(
                "flex justify-center w-5 h-5 mt-5 text-center",
                { "opacity-0": isLoading }
              )}
            >
              {SpinnerIcon}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <RenderContent />
    </>
  );
}