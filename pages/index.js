import clsx from "clsx";
import Link from "next/link";
import { ArrowSquareOut, InstagramLogo } from "phosphor-react";
import { BlogList } from "components";
import { getAllPosts } from "pages/api/blog";
import { getAllProjects } from "pages/api/projects";
import { ContentWrapper, Button } from "ui";

const TIMELINE = [
  {
    date: "May 03 to May 22, 2023",
    title: "Turned 29, did a 3 week long birthday trip!",
    description:
      "Travelled 4 different cities in 4 different European countries. Made great memories :)",
    // link: "https://twitter.com/thelifeofrishi/status/1635590849475096577?s=20",
  },
  {
    date: "Mar 12, 2023",
    title: "Moved to Berlin",
    description: "Always wanted to travel in the west :)",
    link: "https://twitter.com/thelifeofrishi/status/1635590849475096577?s=20",
  },
  {
    date: "Mar 10, 2023",
    title: "Pika crossed $2,000 MRR",
    description: "9 months for the first $1K MRR, ~4 months for the next :D",
    link: "https://twitter.com/thelifeofrishi/status/1633760970823827456?s=20",
  },
  {
    date: "Dec 01, 2022",
    title: "Joined Hive.one",
    description:
      "Joined Hive team as frontend engineer to build a new way to explore Twitter",
    link: "https://twitter.com/thelifeofrishi/status/1598692245401501696",
  },
  {
    date: "Nov 12, 2022",
    title: "Pika crossed $1K in monthly recurring revenue",
    description:
      "9 months into building Pika, it is my first side-project to cross such big milestone",
  },
  {
    date: "Jan 02, 2022",
    title: "Launched Pika.style as an open-source project",
    description:
      "Built this small tool to save my time designing better screenshots",
  },
];

const IMAGES = [
  {
    src: "/images/pages/home/rishi-rome-1.jpeg",
    place: "Rome, Italy",
    className: "md:rotate-[-2deg]",
  },
  {
    src: "/images/pages/home/rishi-nice.jpg",
    place: "Nice, France",
    className: "md:rotate-[-2deg]",
  },
  {
    src: "/images/pages/home/rishi-nice-1.jpg",
    place: "Nice, France",
    className: "md:rotate-[2deg]",
  },
  {
    src: "/images/pages/home/rishi-rome.jpeg",
    place: "Rome, Italy",
    className: "md:rotate-[-2deg]",
  },
  {
    src: "/images/pages/home/rishi-nice-2.jpg",
    place: "Nice, France",
    className: "md:rotate-[2deg]",
  },
  {
    src: "/images/pages/home/rishi-luxembourg.jpg",
    place: "Luxembourg",
    className: "md:rotate-[2deg]",
  },
  {
    src: "/images/pages/home/rishi-berlin.jpeg",
    place: "Berlin, Germany",
    className: "md:rotate-[-2deg]",
  },
  {
    src: "/images/pages/home/rishi-berlin-1.jpeg",
    place: "Berlin, Germany",
    className: "md:rotate-[2deg]",
  },
  {
    src: "/images/pages/home/rishi-goa-yellow.jpg",
    place: "Goa, India",
    className: "md:rotate-[-2deg]",
  },
  {
    src: "/images/pages/home/rishi-holi-rishikesh.jpg",
    place: "Rishikesh, India",
    className: "md:rotate-[2deg]",
  },
  {
    src: "/images/pages/home/rishi-triund.jpg",
    place: "Triund, India",
    className: "md:rotate-[-2deg]",
  },
  {
    src: "/images/pages/home/rishi-goa.jpg",
    place: "Goa, India",
    className: "md:rotate-[2deg]",
  },
];

export default function Home({ allPosts, allProjects, post }) {
  return (
    <div className="grid md:grid-cols-1 mt-0 md:mt-8">
      <ContentWrapper
        width="620px"
        className="divide-y divide-gray-200 dark:divide-gray-800 space-y-6"
      >
        <div className="">
          <h2 className="mb-3 md:mb-4 text-3xl">
            <span className="opacity-70">Hi 👋, I'm </span>
            <span className="font-bold text-black dark:text-white">
              Rishi Mohan!
            </span>
          </h2>
          <div>
            <ul className="!mb-0 list-disc pl-4 dark:text-gray-300/80 space-y-1 md:space-y-[6px]">
              <li>Design engineer, entrepreneur based in Berlin</li>
              <li>
                Building{" "}
                <Link
                  className="border-b border-gray-300 hover:border-gray-400 dark:text-gray-200"
                  href="https://pika.style"
                >
                  Pika
                </Link>{" "}
                (design tool at $2,700 MRR and growing)
              </li>
              <li>
                Working with{" "}
                <Link
                  className="border-b border-gray-300 hover:border-gray-400 dark:text-gray-200"
                  href="https://hive.one"
                  target="_blank"
                >
                  Hive
                </Link>
                , previously at{" "}
                <Link
                  className="border-b border-gray-300 hover:border-gray-400 dark:text-gray-200"
                  href="https://bigbinary.com"
                  target="_blank"
                >
                  BigBinary
                </Link>
                ,{" "}
                <Link
                  className="border-b border-gray-300 hover:border-gray-400 dark:text-gray-200"
                  href="https://instahyre.com"
                  target="_blank"
                >
                  Instahyre
                </Link>
              </li>

              <li>
                Kinda active on Twitter{" "}
                <Link
                  className="border-b border-gray-300 hover:border-gray-400 dark:text-gray-200"
                  href="https://twitter.com/thelifeofrishi"
                  target="_blank"
                >
                  @thelifeofrishi
                </Link>
              </li>

              <li>Love to travel, explore and capture life</li>
            </ul>
          </div>
        </div>
        <div className="pt-6 pb-2">
          <h2 className="text-xl font-medium text-black dark:text-white mb-4">
            Side-projects
          </h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {allProjects?.map((project) => (
              <div className="min-w-[120px] flex-col px-4 py-2 border border-gray-200 dark:border-gray-700/70 rounded-lg hover:bg-gray-100 dark:bg-gray-800/70 dark:hover:bg-gray-800 dark:hover:border-gray-700 dark:shadow-[0_0_8px_rgba(0,0,0,0.8)] shadow-[0_0_8px_rgba(0,0,0,0.06)] flex relative ">
                {project?.ios ? (
                  <Link
                    href={project?.ios}
                    target="_blank"
                    title={project?.title}
                  >
                    <div className="absolute top-[10%] right-[10%] z-10 opacity-50 hover:opacity-100 hover:scale-[1.1] duration-100">
                      <ArrowSquareOut className="text-base" />
                    </div>
                  </Link>
                ) : project?.web ? (
                  <Link
                    href={project?.web}
                    target="_blank"
                    title={project?.title}
                  >
                    <div className="absolute top-[10%] right-[10%] z-10 opacity-50 hover:opacity-100 hover:scale-[1.1] duration-100">
                      <ArrowSquareOut className="text-base" />
                    </div>
                  </Link>
                ) : (
                  ""
                )}
                <Link
                  href={`/projects/${project?.slug}` || "/"}
                  key={project?.title}
                >
                  <div className="py-3 relative">
                    {project?.icon ? (
                      <img
                        className="w-[40px] drop-shadow-xl"
                        src={project?.icon}
                        alt={project?.title}
                      />
                    ) : (
                      <>
                        <div className="flex items-center justify-center w-[42px] h-[42px] text-lg font-medium text-white bg-black border border-gray-100 rounded-full dark:border-gray-800 drop-shadow-xl">
                          {project?.title?.slice(0, 1)}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="pb-1">
                    <div className="flex items-center gap-[6px] mt-1">
                      <h3 className="font-medium text-base">
                        {project?.title}
                      </h3>
                      {project?.active ? (
                        <div
                          className="w-[8px] h-[8px] rounded-full bg-green-500"
                          title="Active"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    {project?.tagline ? (
                      <p className="text-sm opacity-80">{project?.tagline}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 pb-2">
          <div className="flex items-center gap-3 pb-3">
            <h2 className=" text-xl font-medium text-black dark:text-white">
              Blog
            </h2>
            <Button variant="secondary" className="text-sm" href="/blog" as="a">
              View all blog posts →
            </Button>
          </div>
          <BlogList data={allPosts?.slice(0, 12)} activeSlug={post?.slug} />
        </div>
        {/* <div>
          <div className="mt-12 mb-4">
            <h2 className="text-base flex items-center">
              <Star size={20} className="mr-2 opacity-40" />
              Connecting dots backwards
            </h2>
          </div>

          <div className="">
            <div className="relative pl-8">
              <div className="h-full w-[1px] bg-gray-200 dark:bg-gray-800 left-[10px] top-[5px] absolute"></div>
              {TIMELINE?.map((item, index) => (
                <div key={item.title + index} className="mb-10 relative">
                  <div className="w-3 h-3 rounded-full absolute left-[-30px] top-[16px]">
                    <ArrowCircleRight
                      size={24}
                      className="bg-white text-gray-400 dark:text-gray-400 dark:bg-gray-900 rounded-full"
                    />
                  </div>
                  <p className="opacity-40 text-xs">{item.date}</p>

                  <h3 className="leading-tight mb-1 font-medium text-sm md:text-base inline-block">
                    <span className="">{item.title}</span>
                    {item?.link ? (
                      <Link href={item.link} target="_blank">
                        <span className="inline-block ml-1 opacity-80">
                          <ArrowSquareOut size={12} />
                        </span>
                      </Link>
                    ) : (
                      ""
                    )}
                  </h3>

                  <p className="opacity-60 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        <div>
          <div className="flex items-center mt-10 gap-3">
            <h2 className=" text-xl font-medium text-black dark:text-white">
              Photos
            </h2>
            <Link
              className="bg-transparent border-gray-200 dark:border-gray-700/70 border text-sm px-2 py-px rounded-lg flex gap-1 items-center"
              href="https://instagram.com/thelifeofrishi"
              target="_blank"
            >
              <InstagramLogo /> Instagram
              <ArrowSquareOut />
            </Link>
          </div>

          <div className="mt-2 mb-8">
            <p>
              I love to travel and take photos. I also have been maintaining a
              map of all the places I've been to, you can{" "}
              <Link className="border-b" href="/map">
                check it here
              </Link>
            </p>
          </div>

          <div className=" mt-5 mb-12 justify-center relative group">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-5 md:gap-6">
              {IMAGES?.slice(0, 8)?.map((item) => (
                <div
                  key={item.src}
                  className={clsx(
                    // item?.className,
                    "relative bg-gray-100  hover:bg-gray-900 duration-100 ease-in-out rounded-[12px] dark:border-gray-700 hover:shadow-xl md:hover:scale-[1.1]"
                  )}
                >
                  <img
                    src={item?.src}
                    alt={item?.place}
                    className="rounded-[9px] object-cover w-full h-full"
                    loading="lazy"
                  />
                  {/* <div className="font-mono text-xs absolute bottom-[4%] left-[4%] inline-flex bg-white/90 backdrop-blur rounded-[10px] px-2 py-px items-center dark:text-black">
                  <MapPin size={14} className="mr-1" />
                  {item?.place}
                </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "image",
    "excerpt",
    "external",
  ]);

  const allProjects = getAllProjects([
    "title",
    "date",
    "slug",
    "author",
    "image",
    "excerpt",
    "content",
    "icon",
    "active",
    "tagline",
    "web",
    "ios",
  ]);

  return {
    props: {
      allPosts,
      allProjects: allProjects
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .sort((left, right) =>
          left.hasOwnProperty("active")
            ? -1
            : right.hasOwnProperty("active")
            ? 1
            : 0
        ),
    },
  };
}
