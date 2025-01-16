import { useRouter } from 'next/router';
import Head from 'next/head';
import VideoPlayer from '@/components/VideoPlayer/playervideo';

export async function getServerSideProps(context) {
  const { channelId } = context.params;
  const channelURL = `https://web-films-api-test.vercel.app/channels/${channelId}`;

  try {
    const response = await fetch(channelURL);

    if (!response.ok) {
      console.error("Erro ao buscar o canal:", response.statusText);
      return {
        props: {
          channel: null,
        },
      };
    }

    const channel = await response.json();

    if (!channel || !channel.link) {
      console.error("Canal ou link de vídeo não encontrado.");
      return {
        props: {
          channel: null,
        },
      };
    }

    return {
      props: {
        channel,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar o canal:", error);
    return {
      props: {
        channel: null,
      },
    };
  }
}

export default function PlayerPage({ channel }) {
  const router = useRouter();

  if (!channel) {
    return <p className="text-center text-xl mt-4">Canal não encontrado.</p>;
  }

  const videoUrl = channel.link;

  return (
    <>
      <Head>
        <title>{`Pirates - ${channel.canal}`}</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <div className="relative">
        <VideoPlayer url={videoUrl} />
        <button
          onClick={() => router.push('/ChannelsList')}
          className="absolute top-4 left-4 z-[1001] px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Voltar
        </button>
      </div>
    </>
  );
}
