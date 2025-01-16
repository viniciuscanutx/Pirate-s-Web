import Head from 'next/head';
import Navbar from '@/components/Navbar/navbar';
import MovieRow from '@/components/MovieRow/movie-row';

import { fetchNSeries } from '@/pages/api/client'

export async function getServerSideProps() {
  
    const seriesData = await fetchNSeries();

    const seriesByGenre = seriesData.reduce((acc, series) => {
      const genreName = series.genero
      if (!acc[genreName]) {
        acc[genreName] = [];
      }
      acc[genreName].push({
        ...series,
        id: series._id,
        titulo: series.titulo,
        nota: series.avaliacao,
        lancamento: series.lancamento,
        hasSubtitles: series.temporadas.some(temporada => temporada.episodios.length > 0),
        isDubbed: false, 
      });
      return acc;
    }, {});

    return {
      props: {
        seriesByGenre, 
      },
    };
  } 

export default function Series({ seriesByGenre = {} }) {
  if (!seriesByGenre || Object.keys(seriesByGenre).length === 0) {
    return <div>Sem séries disponíveis nas categorias.</div>;
  }

  return (
    <>
      <Head>
        <title>Pirates - Séries</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="relative z-10 mt-32">
          {Object.entries(seriesByGenre)
            .sort(([a], [b]) => a.localeCompare(b)) 
            .map(([genre, series]) => (
              <MovieRow key={genre} title={genre} movies={series} isSeries={true} />
            ))}
        </div>
      </div>
    </>
  );
}