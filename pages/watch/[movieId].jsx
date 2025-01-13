import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer/playervideo'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-2xl">Carregando player...</div>
});

export async function getServerSideProps(context) {
  const { movieId } = context.params;
  const movieURL = `https://web-films-api-test.vercel.app/${movieId}`;

  try {
    const response = await fetch(movieURL);
    const movie = await response.json();

    if (!movie || !movie.link) {
      return { notFound: true };
    }

    return {
      props: { movie },
    };
  } catch (error) {
    console.error('Erro ao buscar o filme:', error);
    return { notFound: true };
  }
}

export default function PlayerPage({ movie }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!movie) {
    return <p className="text-center text-xl mt-4">Filme não encontrado.</p>;
  }

  const videoUrl = movie.link || null;
  const subtitleUrl = movie.legenda || null;

  if (!videoUrl) {
    return <p className="text-center text-xl mt-4">Link de vídeo não encontrado.</p>;
  }

  return (
    <>
      <Head>
        <title>{`Pirates - ${movie.titulo}`}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="relative">
        {isMounted && (
          <VideoPlayer key={videoUrl} url={videoUrl} subtitleUrl={subtitleUrl} />
        )}
        <button
          onClick={() => router.push(`/movie/${movie._id}`)}
          className="fixed top-4 left-4 z-[1001] px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Voltar
        </button>
      </div>
    </>
  );
}
