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
      title: "Modal",
      url: "/experiments/modal",
      description: "A very basic modal component in React",
    },
    // {
    //   title: "Coming Soon",
    //   url: "/experiments",
    //   description: "There's always something cooking in here, stay tuned!",
    //   disabled: true
    // },
  ];

  return <>
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
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden antialiased">
      <div className="relative p-8 md:p-20 w-full max-w-[800px]">
        <div className="mb-8">
          <h2 className="text-4xl font-black text-black dark:text-white md:text-4xl">
            Experiments
          </h2>
          <p className="text-xl text-black/40 drop-shadow-lg dark:text-white/40">
            UI and Code explorations
          </p>
        </div>
        <div className="relative">
          {LIST.map((item) => {
            return (
              (<Link
                key={item.url}
                href={item.url}
                className={classnames(
                  "flex flex-row py-4 duration-200 rounded-xl group ",
                  { "pointer-events-none opacity-30": item.disabled },
                  { "opacity-80 hover:opacity-100": !item.disabled }
                )}>

                <div className="hidden md:flex translate-x-[-20px] mt-px group-hover:translate-x-0 group-hover:opacity-100 duration-[250ms] opacity-0 ease-[cubic-bezier(.75,-0.5,0,1.75)]">
                  <div className="w-6 h-6">{ArrowIcon}</div>
                </div>
                <div className="flex flex-col pl-1">
                  <h2 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                    <span className="border-b border-gray-500 dark:border-gray-200 leading-none mb-1">
                      {item.title}
                    </span>
                  </h2>
                  <p className="text-base opacity-50 dark:opacity-60">
                    {item.description}
                  </p>
                </div>

              </Link>)
            );
          })}
        </div>
      </div>
    </div>
  </>;
}