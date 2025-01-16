import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer/playervideo'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-2xl">Carregando player...</div>
});

export async function getServerSideProps(context) {
  const { serieId, episodeId, season } = context.params;
  const seriesURL = `https://web-films-api-test.vercel.app/series/${serieId}`;

  try {
    const response = await fetch(seriesURL);
    const seriesData = await response.json();

    const seasonData = seriesData.temporadas.find(seasonData => seasonData.numero == season);

    if (!seasonData) {
      return { notFound: true };
    }


    const episode = seasonData.episodios.find(ep => ep.numero.toString() === episodeId);

    if (!episode || !episode.link) {
      return { notFound: true };
    }

    return {
      props: { episode, serieId, season },
    };
  } catch (error) {
    console.error('Erro ao buscar os dados da série:', error);
    return { notFound: true };
  }
}

export default function SeriesPlayerPage({ episode, serieId, }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!episode) {
    return <p className="text-center text-xl mt-4">Episódio não encontrado.</p>;
  }

  const videoUrl = episode.link || null;
  const subtitleUrl = episode.legenda || null;

  if (!videoUrl) {
    return <p className="text-center text-xl mt-4">Link de vídeo não encontrado.</p>;
  }

  return (
    <>
      <Head>
        <title>{`Pirates - ${episode.titulo}`}</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <div className="relative">
        {isMounted && (
          <VideoPlayer key={videoUrl} url={videoUrl} subtitleUrl={subtitleUrl} />
        )}
        <button
          onClick={() => router.push(`/series/${serieId}`)}
          className="fixed top-4 left-4 z-[1001] px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Voltar
        </button>
      </div>
    </>
  );
}
