import Head from 'next/head';
import Navbar from '@/components/Navbar/navbar';
import MovieRow from '@/components/MovieRow/movie-row';

import { fetchNMovies } from '@/pages/api/client'

export async function getServerSideProps() {

    const moviesData = await fetchNMovies();

    const allMovies = moviesData.map((movie) => ({
      ...movie,
      id: movie._id,
      titulo: movie.titulo,
      sinopse: movie.sinopse,
      duracao: movie.duracao,
      lancamento: movie.lancamento,
      genero: movie.genero,
      diretor: movie.diretor,
      atores: movie.atores,
      nota: movie.nota,
      metacritic: movie.metacritic,
      rottentomatoes: movie.rottentomatoes,
      poster: movie.poster,
      banner: movie.banner,
      fulllancamento: movie.fulllancamento,
      hasSubtitles: !!movie.legenda,
      isDubbed: false,
    }));

    const moviesByCategory = allMovies.reduce((acc, movie) => {
      const genre = movie.genero;
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(movie);
      return acc;
    }, {});

    return {
      props: {
        allMovies,
        moviesByCategory, 
      },
    };
  } 

export default function Categories({ moviesByCategory = {} }) {
  if (!moviesByCategory || Object.keys(moviesByCategory).length === 0) {
    return <div>Sem filmes disponíveis nas categorias.</div>;
  }

  return (
    <>
      <Head>
        <title>Pirates - Categorias</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="relative z-10 mt-24">
          {Object.entries(moviesByCategory)
            .sort(([a], [b]) => a.localeCompare(b)) 
            .map(([category, movies]) => (
              <MovieRow key={category} title={category} movies={movies} />
            ))}
        </div>
      </div>
    </>
  );
}
