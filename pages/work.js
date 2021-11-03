import Head from "next/head";
import {WorkList} from "components";

export default function Home() {
  return (
    <>
      <Head>
        <title>Work – Rishi Mohan</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WorkList />
    </>
  );
}
