import Head from "next/head"

import Navbar from "@/components/Navbar/navbar"
import ChannelGrid from "@/components/ChannelRow/channel-row"

import { fetchChannels } from "./api/client"

export async function getServerSideProps() {
    const channels = await fetchChannels()

    return {
      props: {
        channels,
      },
    };
} 

export default function Home({ channels }) {
  return (
    <>
      <Head>
        <title>Xerife TV - Canais</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="relative z-10 mt-40 bg-black">
          <ChannelGrid title="Channels" channels={channels} />
        </div>
      </div>
    </>
  );
}
