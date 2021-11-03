import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Travel Map – Rishi Mohan</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-start justify-center w-full mb-10 overflow-hidden max-h-[600px]">
        <iframe
          src="https://www.google.com/maps/d/u/0/embed?mid=1_yNkyfqV1g9kKRz0el2r46viCfw7RBXj"
          width="100%"
          height="600"
        ></iframe>
      </div>

      <article className="w-full px-10 pb-10 overflow-y-auto max-w-[620px] mx-auto">
        <h2 className="mb-6 text-5xl font-bold">The Wanderland!</h2>
        <div className="post-content">
          <p className="text-lg text-gray-500">
            I didn't know I would love travelling so much until back in 2017
            December when I first decided to do a solo to Udaipur. It was my
            first time out alone and god I felt scared but excited at the same
            time. After that trip to Udaipur I realized how travelling can add
            to your life in terms of knowledge, meeting new people and
            perspective. You meet people, talk to them and share experiences,
            cultures, ideas which is a big thing.
          </p>
          <p>
            The other aspect of travelling that I love is capturing moments, and
            that helped me up my photography game a bit. You can head over to my <a href="https://instagram.com/thelifeofrishi">Instagram</a> or <a href="http://unsplash.com/@rishi">Unsplash</a> to check some of
            the photos I've taken while exploring beautiful destinations. Lakes,
            the mountains, greenery and the clouds in the sky, scenes that you
            don't get to see on a regular day is what I like to capture.
          </p>
          <p>
            I've created this page to visualize all the locations I've been so
            far.
          </p>
        </div>
      </article>
    </>
  );
}
