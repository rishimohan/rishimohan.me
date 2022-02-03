import Link from "next/link"

export default function Experiments() {
  const LIST = [
    {
      title: "Splash Screen",
      url: "/experiments/splash-screen",
      description: "Splash Screen implementation on Web using Tailwind"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white border-gray-300 md:p-10 md:border-l">
      <div className="absolute inset-0 flex items-center justify-center w-full h-full">
        <div className="w-full h-full duration-200 bg-gradient-to-br from-indigo-500 via-red-300 to-white blur-2xl transform-gpu opacity-30 dark:opacity-70" />
      </div>
      <div className="relative p-8 md:p-20 w-full max-w-[800px]">
        <h2 className="mb-10 text-4xl font-black text-black mix-blend-overlay md:text-6xl drop-shadow-lg">
          Experiments
        </h2>
        <div className="relative">
          {LIST.map((item) => {
            return (
              <Link key={item.url} href={item.url}>
                <a className="flex flex-col px-5 py-4 duration-200 border border-gray-300 bg-white/30 rounded-xl group">
                  <h2 className="text-2xl font-bold text-gray-600 group-hover:text-black">{item.title}</h2>
                  <p className="text-lg opacity-50">{item.description}</p>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}