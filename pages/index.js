import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js + TailwindCSS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Remove from here */}
        <div className="relative flex items-end justify-center h-screen overflow-hidden font-mono bg-gradient-to-br from-gray-100 to-white">
          <div className="relative">
            <div className="absolute bottom-[1%] left-[80%] w-[80px] h-[80px] rounded-full bg-indigo-400 animate-pulse" />
            <div className="absolute bottom-[30%] right-[-6%] w-[120px] h-[120px] rounded-full bg-green-300 animate-pulse" />
            <div className="relative z-10 px-24 py-16 border shadow-xl border-gray-200/50 bg-white/20 rounded-t-xl backdrop-filter backdrop-blur">
              <h1 className="text-4xl font-bold md:text-5xl">
                Make something{" "}
                <span className="block font-black leading-snug text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-800">
                  great!
                </span>
              </h1>
              <ul className="mt-10 space-y-3 font-mono text-gray-900 md:text-2xl">
                <li>- Next.js</li>
                <li>- TailwindCSS</li>
                <li>- SASS</li>
              </ul>
            </div>
          </div>
        </div>
        {/* To here */}
      </main>
    </>
  );
}
