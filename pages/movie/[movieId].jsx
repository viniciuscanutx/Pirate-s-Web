import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

import Navbar from "@/components/Navbar/navbar";
import Comments from "@/components/Comments/comments";
import LikeButton from "@/components/LikeButton/likebutton";
import ParentalRating from "@/components/ParentalRating/parentalrating";
import MovieRow from "@/components/MovieRow/movie-row";

const { fetchNMovies, fetchNMoviesforID } = require('@/pages/api/client');

import convertMinutesToHours from "@/utils/convertDuration";
import cleanDuration from "@/utils/cleanDuration";

import { FaStar, FaTags } from "react-icons/fa6";


export const getServerSideProps = async (context) => {
    const id = context.params.movieId;
    const movieData = await fetchNMoviesforID(id)
    const moviesData = await fetchNMovies()

    const allMovies = moviesData.map((movie) => ({
      id: movie._id,
      imdbid: movie.imdbid,
      titulo: movie.titulo,
      sinopse: movie.sinopse,
      duracao: movie.duracao,
      lancamento: movie.lancamento,
      genero: movie.genero,
      diretor: movie.diretor,
      atores: movie.atores,
      renda: movie.renda,
      nota: movie.nota,
      metacritic: movie.metacritic,
      rottentomatoes: movie.rottentomatoes,
      poster: movie.poster,
      link: movie.link,
      legenda: movie.legenda,
      banner: movie.banner,
      fullRelease: movie.fulllancamento,
      hasSubtitles: !!movie.legenda,
      isDubbed: false,
      ParentalRating: movie.parentalRating || null,
    }));

    const movie = {
      id: movieData._id,
      imdbid: movieData.imdbid,
      titulo: movieData.titulo,
      sinopse: movieData.sinopse,
      duracao: cleanDuration(movieData.duracao),
      lancamento: movieData.lancamento,
      genero: movieData.genero,
      diretor: movieData.diretor,
      atores: movieData.atores,
      renda: movieData.renda,
      nota: movieData.nota,
      metacritic: movieData.metacritic,
      rottentomatoes: movieData.rottentomatoes,
      poster: movieData.poster,
      link: movieData.link,
      legenda: movieData.legenda,
      banner: movieData.banner,
      fulllancamento: movieData.fulllancamento,
      hasSubtitles: !!movieData.legenda,
      isDubbed: false,
      ParentalRating: movieData.parentalRating || null,
    };

    let similarMovies = allMovies.filter((m) => m.genero === movie.genero && m.id !== movie.id);
    similarMovies = similarMovies.slice(0, 8);

    return {
      props: {
        movie: movie || null,
        similarMovies: similarMovies.length >= 3 ? similarMovies : [],
      },
    };
} 

const Movie = ({ movie, similarMovies }) => {
  if (!movie) {
    return <p className="text-center text-xl mt-4">Filme não encontrado.</p>;
  }

  return (
    <>
      <Head>
        <title>{`Xerife TV - ${movie.title}`}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95)), url(${movie.banner})`,
        }}
      ></div>
      <div className="relative z-10 flex flex-col items-center py-32 px-8">
        <div className="flex flex-wrap justify-center items-start gap-8 w-full max-w-6xl">
          <div className="text-center max-w-xs flex-1 relative">
            <ParentalRating rating={movie.ParentalRating} />
            <Image
              src={movie.poster}
              width={280}
              height={450}
              alt={movie.title}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="flex-2 max-w-lg">
            <h3 className="text-3xl font-bold mb-2 text-white">{movie.titulo}</h3>
            <h4 className="text-md text-gray-100 mb-6 flex items-center">
              {movie.hasSubtitles ? (
                <span className="bg-yellow-500 text-black px-1 rounded text-xs font-bold flex items-center">
                  <FaTags className="mr-1" />
                  CC
                </span>
              ) : (
                <span className="bg-blue-500 text-white px-1 rounded text-xs font-bold flex items-center">
                  <FaTags className="mr-1" />
                  DUB
                </span>
              )}
            </h4>
            <p className="text-md text-gray-300 mt-3 mb-4">{movie.genero}</p>
            <h4 className="text-md text-gray-100 mb-6 flex items-center">
              {movie.lancamento} • {convertMinutesToHours(movie.duracao)}
            </h4>
            <h2 className="text-xl flex items-center mb-6 text-yellow-300 font-bold">
              <FaStar className="mr-2" /> {movie.nota}
            </h2>
            <div className="mb-8">
              <p className="text-justify text-gray-100 leading-relaxed">{movie.sinopse}</p>
            </div>
            <div className="flex gap-4 mb-8">
              <Link
                href={movie.id ? `/watch/${movie.id}` : '#'}
                className="px-6 py-3 bg-white text-black uppercase rounded-md shadow-md hover:bg-yellow-300 transition"
              >
                Assistir
              </Link>
              <LikeButton movieId={movie.id.toString()} />
            </div>
          </div>
        </div>
        <div className="w-full max-w-6xl mt-8">
          <Comments movieId={movie.id.toString()} />
        </div>
        {similarMovies.length >= 3 && (
          <div className="w-full max-w-6xl mt-40 mr-8">
            <MovieRow title="Filmes Similares" movies={similarMovies} />
          </div>
        )}
      </div>
    </>
  );
};

export default Movie;
