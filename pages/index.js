import clsx from "clsx";
import Link from "next/link";
import { MapPin, ArrowCircleRight, Camera, Star } from "phosphor-react";

const TIMELINE = [
  {
    date: 'Nov 12, 2022',
    title: 'Pika crossed $1K in monthly recurring revenue',
    description: '9 months into the building Pika, it is my first side-project to cross such big milestone'
  },
  {
    date: 'Jan 02, 2022',
    title: 'Launched Pika.style as an open-source project',
    description: 'Build this small tool to save my time designing better screenshots'
  },
]

const IMAGES = [
  {
    src: "/images/pages/rishi-goa-yellow.jpg",
    place: "Goa",
    className: "rotate-[-2deg]",
  },
  {
    src: "/images/pages/rishi-holi-rishikesh.JPG",
    place: "Rishikesh",
    className: "rotate-[2deg]",
  },
  {
    src: "/images/pages/rishi-triund.JPG",
    place: "Triund",
    className: "rotate-[-2deg]",
  },
  {
    src: "/images/pages/rishi-goa.JPG",
    place: "Goa",
    className: "rotate-[2deg]",
  }
];

const ContentWrapper = ({ children, className, width }) => (
  <div
    style={{ maxWidth: `${width || '100%'}`}}
    className={clsx(
      "w-full px-5 mx-auto relative",
      className
    )}
  >
    {children}
  </div>
);

export default function Home() {
  return (
    <div className="pb-20">
      <ContentWrapper
        width="520px"
        className="mx-auto relative grid grid-cols-1 gap-10 mt-10 md:mt-20"
      >
        <div className="">
          <h2 className="mb-6 text-3xl font-black md:text-4xl dark:text-white">
            <span className="text-gray-400 dark:text-gray-400">
              Hi 👋, I'm{" "}
            </span>
            Rishi Mohan!
          </h2>
          <div className="post-content">
            <ul className="!mb-0">
              <li>Designer, front-end engineer, entrepreneur</li>
              <li>
                Worked at{" "}
                <Link href="https://bigbinary.com" target="_blank">
                  BigBinary
                </Link>
                ,{" "}
                <Link href="https://instahyre.com" target="_blank">
                  Instahyre
                </Link>
              </li>
              <li>Love to travel, explore and capture life</li>
              <li>
                Kinda active on Twitter{" "}
                <Link href="https://twitter.com/thelifeofrishi" target="_blank">
                  @thelifeofrishi
                </Link>
              </li>
              <li>
                Currently building{" "}
                <Link href="https://pika.style">Pika.style</Link> in side
              </li>
            </ul>
          </div>
        </div>
      </ContentWrapper>

      <ContentWrapper
        width="520px"
        className="mt-10 dark:border-gray-800"
      >
        <h2 className="font-bold text-lg flex items-center">
          <Camera size={20} className="mr-2 opacity-40" />
          Some photos from recent trips
        </h2>
      </ContentWrapper>

      <ContentWrapper className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 my-6 md:my-12 justify-center gap-5 md:gap-10 !max-w-[960px]">
        {IMAGES?.map((item) => (
          <div
            key={item.src}
            className={clsx(
              item?.className,
              "relative border p-[4px] shadow-[0_0_32px_rgba(0,0,0,0.1)] rounded-[12px] dark:border-gray-700"
            )}
          >
            <img src={item?.src} alt={item?.place} className="rounded-[9px]" />
            <div className="font-mono text-xs absolute bottom-[4%] left-[4%] inline-flex bg-white/90 backdrop-blur rounded-[10px] px-2 py-px items-center dark:text-black">
              <MapPin size={14} className="mr-1" />
              {item?.place}
            </div>
          </div>
        ))}
      </ContentWrapper>

      <ContentWrapper width="520px" className="mt-16 mb-4">
        <h2 className="font-bold text-lg flex items-center">
          <Star size={20} className="mr-2 opacity-40" />
          Connecting dots backwards
        </h2>
      </ContentWrapper>

      <ContentWrapper
        width="520px"
        className="border dark:border-gray-800 pt-6 bg-gray-50 md:rounded-lg dark:bg-gray-900"
      >
        <div className="relative pl-8">
          <div className="h-full w-[1px] bg-gray-200 dark:bg-gray-800 left-[10px] top-[5px] absolute"></div>
          {TIMELINE?.map((item, index) => (
            <div key={item.title + index} className="mb-10 relative">
              <div className="w-3 h-3 rounded-full absolute left-[-30px] top-[16px]">
                <ArrowCircleRight
                  size={18}
                  className="bg-white text-gray-400 dark:text-gray-400 dark:bg-gray-900 rounded-full"
                />
              </div>
              <p className="opacity-40 text-xs">{item.date}</p>
              <h3 className="leading-tight mb-1 font-semibold text-sm md:text-base">{item.title}</h3>
              <p className="opacity-60 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </ContentWrapper>
    </div>
  );
}
