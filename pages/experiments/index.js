import {useEffect, useState} from 'react';
import Link from "next/link"
import { ArrowIcon } from "lib/icons";
import classnames from "classnames";
import {NextSeo} from "next-seo";

export default function Experiments() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true)
    }, 100)
  }, [])

  const LIST = [
    {
      title: "Splash Screen",
      url: "/experiments/splash-screen",
      description: "Splash Screen implementation on Web using Tailwind",
    },
    {
      title: "Coming Soon",
      url: "/experiments",
      description: "There's always something cooking in here, stay tuned!",
      disabled: true
    },
  ];

  return (
    <>
      <NextSeo
        title="Design & Code Explorations - Rishi Mohan"
        description="A collection of design and code experiments, a college where student are ideas. Would the ideas graduate? Let's find out!"
        openGraph={{
          site_name: "Hi, I'm Rishi Mohan!",
          title: "Design and Code Explorations - Rishi Mohan",
          description:
            "A collection of design and code experiments, a college where student are ideas. Would the ideas graduate? Let's find out!",
        }}
      />
      <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden antialiased bg-white dark:bg-black">
        <div
          className={classnames(
            "absolute inset-0 flex items-center justify-center w-full h-full overflow-hidden"
          )}
        >
          <div
            className={classnames(
              "w-full h-full duration-[2000ms] rounded-[100px] transform-gpu bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-500/50 dark:to-pink-600/50",
              { "scale-[1.2] blur-[200px]": animate },
              {
                "scale-[3] blur-[250px]": !animate,
              }
            )}
          />
        </div>
        <div className="relative p-8 md:p-20 w-full max-w-[800px]">
          <div className="mb-10 ">
            <Link href="/">
              <a
                className={classnames(
                  "py-1 rounded-lg text-pink-700/80 dark:text-pink-300/70 shadow-gray-200/10 flex items-center"
                )}
              >
                <span className="w-5 h-5 rotate-180">{ArrowIcon}</span>
                Back to site
              </a>
            </Link>
            <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-pink-400 to-indigo-500 dark:from-pink-400/80 dark:to-indigo-500/50 bg-clip-text md:text-6xl drop-shadow-lg">
              Experiments
            </h2>
            <p className="text-xl text-black/40 drop-shadow-lg dark:text-white/40">
              UI and Code explorations by{" "}
              <Link href="https://twitter.com/thelifeofrishi">
                <a target="_blank">
                  @<span className="underline">thelifeofrishi</span>
                </a>
              </Link>
            </p>
          </div>
          <div className="relative">
            {LIST.map((item) => {
              return (
                <Link key={item.url} href={item.url}>
                  <a
                    className={classnames(
                      "flex flex-row py-4 duration-200 rounded-xl group ",
                      { "pointer-events-none opacity-30": item.disabled },
                      { "opacity-80 hover:opacity-100": !item.disabled }
                    )}
                  >
                    <div className="hidden md:flex translate-x-[-20px] mt-px group-hover:translate-x-0 group-hover:opacity-100 pt-px duration-[250ms] opacity-0 ease-[cubic-bezier(.75,-0.5,0,1.75)]">
                      <div className="w-6 h-6">{ArrowIcon}</div>
                    </div>
                    <div className="flex flex-col pl-1">
                      <h2 className="flex items-center text-xl font-semibold text-gray-800 dark:text-white">
                        <span className="border-b border-gray-500 dark:border-gray-200">
                          {item.title}
                        </span>
                      </h2>
                      <p className="text-lg opacity-50 dark:opacity-60">
                        {item.description}
                      </p>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}