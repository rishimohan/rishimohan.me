import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <article className="w-full px-5 md:px-10 py-10 mb-20 overflow-y-auto max-w-[620px] mx-auto">
        <div className="flex items-start justify-center w-full mb-10 overflow-hidden rounded-lg max-h-[500px] shadow-xl">
          <img
            src="/images/pages/rishi-mohan.jpg"
            alt="Rishi in his natural habitat"
            title="A black and white photo of Rishi"
          />
        </div>
        <h2 className="mt-12 mb-6 text-3xl font-black md:text-5xl">
          <span className="text-gray-400">Hi, I'm </span>Rishi Mohan!
        </h2>
        <div className="post-content">
          <p className="text-lg text-gray-500">
            I'm a <span className="font-medium">designer</span> and{" "}
            <span className="font-medium">front-end engineer</span> by
            profession, currently working at{" "}
            <a href="https://www.bigbinary.com">BigBinary</a>.
          </p>
          <p className="text-lg text-gray-500">
            I like building clean and interactive apps using React.js, React
            Native and other front-end tech.
          </p>
          <p className="text-lg text-gray-500">
            On weekends I like to travel and take photos. I like to binge try
            Cafes and Restaurants. Some weekends go into building some side
            projects like this{" "}
            <Link href="https://kizie.co">
              <a target="_blank">Twitter client</a>
            </Link>, <Link href="https://pika.style"><a target="_blank">website mockup tool</a></Link>{" "}
            and this{" "}
            <Link href="/projects/maazi">
              <a>diary app</a>
            </Link>
            .
          </p>
        </div>
        <div className="px-4 py-3 my-5 text-base text-gray-400 bg-gray-100 rounded-xl dark:bg-gray-900 dark:text-gray-500">
          The code for this blog is{" "}
          <a
            className="underline"
            target="_blank"
            href="https://github.com/rishimohan/rishimohan.me"
          >
            available on Github
          </a>
          .
        </div>
      </article>
    </>
  );
}
