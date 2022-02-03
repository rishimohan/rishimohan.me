import {useEffect, useState} from 'react';
import Link from "next/link"
import { ArrowIcon } from "lib/icons";
import classnames from "classnames";

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
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden antialiased bg-white dark:bg-black md:p-10">
      <div
        className={classnames(
          "absolute inset-0 flex items-center justify-center w-full h-full"
        )}
      >
        <div
          className={classnames(
            "w-full h-full duration-1000 bg-gradient-to-br from-indigo-500 dark:from-indigo-600/70 dark:via-red-700/40 dark:to-gray-700/40 via-red-500/40 to-red-500 blur-[250px] transform-gpu",
            { "scale-[0.65] dark:opacity-70 rotate-[10deg]": animate },
            { "scale-0 opacity-0 animate-pulse rotate-0": !animate }
          )}
        />
        <div
          className="absolute inset-0 flex items-center justify-center w-full h-full opacity-50 dark:opacity-100 mix-blend-overlay"
          style={{ backgroundImage: `url("/images/experiments/noise.svg")` }}
        />
      </div>
      <div className="relative p-8 md:p-20 w-full max-w-[800px]">
        <div className="mb-10 ">
          <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-pink-400 to-indigo-500 dark:from-pink-400/80 dark:to-indigo-500/50 bg-clip-text mix-blend-overlay md:text-6xl drop-shadow-lg">
            Smol Experiments
          </h2>
          <p className="text-xl text-black/40 mix-blend-overlay drop-shadow-lg dark:text-white/40">
            UI and Code explorations by{" "}
            <Link href="/">
              <a className="underline">Rishi</a>
            </Link>
            <span className="px-1">/</span>
            <Link href="https://twitter.com/thelifeofrishi">
              <a target="_blank" className="underline">
                @thelifeofrishi
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
                      <span className="border-b border-gray-500 dark:border-gray-200">{item.title}</span>
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
  );
}