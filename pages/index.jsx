import Head from 'next/head';
import { useEffect, useState } from 'react';

import Navbar from '@/components/Navbar/navbar';
import HeroBanner from '@/components/HeroBanner/hero-banner';
import MovieRow from '@/components/MovieRow/movie-row';

import { parseFullReleaseDate, formatToFullReleaseDate } from '@/utils/dateUtils';
import cleanDuration from '@/utils/cleanDuration';
const { fetchNMovies, fetchNSeries } = require('@/pages/api/client');

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { db } from '@/config/firebaseConfig';

export async function getServerSideProps() {
  try {

    const moviesData = await fetchNMovies();
    
    const allMovies = moviesData.map((movie) => ({
      id: movie._id,
      imdbid: movie.imdbid,
      titulo: movie.titulo,
      sinopse: movie.sinopse,
      duracao: cleanDuration(movie.duracao),
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
      fulllancamento: formatToFullReleaseDate(parseFullReleaseDate(movie.fulllancamento)),
      hasSubtitles: !!movie.legenda,
      isDubbed: false,
    }));

    const moviesByReleaseYear = allMovies.reduce((acc, movie) => {
      const releaseYear = movie.lancamento;
      if (!acc[releaseYear]) {
        acc[releaseYear] = [];
      }
      acc[releaseYear].push(movie);
      acc[releaseYear].sort((a, b) => new Date(b.fulllancamento) - new Date(a.fulllancamento));  // Sort by fullRelease date
      return acc;
    }, {});

    const sortedMovies = allMovies.sort((a, b) => b.lancamento - a.lancamento);

    const topRatedMovies = allMovies
      .filter((movie) => !isNaN(parseFloat(movie.nota)))
      .sort((a, b) => parseFloat(b.nota) - parseFloat(a.nota))
      .slice(0, 15);

    const comedyMovies = allMovies.filter(movie => movie.genero === "Comedy");

    const fetchSeries = async () => {
      try {
        const seriesData = await fetchNSeries();

        const allSeries = seriesData.map((series) => ({
          id: series._id,
          imdbid: series.imdbid,
          titulo: series.titulo,
          sinopse: series.sinopse,
          lancamento: series.lancamento,
          genero: series.genero,
          nota: series.avaliacao,
          parentalRating: series.parentalRating,
          poster: series.poster,
          banner: series.banner,
          hasSubtitles: series.temporadas.some(temporada => temporada.episodios.length > 0),
          isDubbed: false,
          seasons: series.temporadas.map(temporada => ({
            number: temporada.numero,
            episodes: temporada.episodios.map(episodio => ({
              number: episodio.numero,
              title: episodio.titulo,
              link: episodio.link,
              subtitles: episodio.legenda,
            })),
          })),
        }));

        return allSeries;
      } catch (error) {
        console.error("Erro ao buscar séries:", error);
        return [];
      }
    };

    const allSeries = await fetchSeries();

    return {
      props: {
        allMovies: sortedMovies,
        featuredMovie: sortedMovies[10],
        moviesByReleaseYear,
        topRatedMovies,
        comedyMovies,
        allSeries,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        allMovies: [],
        featuredMovie: null,
        moviesByReleaseYear: {},
        topRatedMovies: [],
        comedyMovies: [],
        allSeries: [],
      },
    };
  }
}

export default function Home({ featuredMovie, topRatedMovies, moviesByReleaseYear, comedyMovies, allMovies, allSeries }) {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteSeries, setFavoriteSeries] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLikedMovies, setUserLikedMovies] = useState([]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);

        const likedMoviesRef = ref(db, `like`);
        onValue(likedMoviesRef, (snapshot) => {
          const data = snapshot.val();

          if (data) {
            const likedMovies = Object.entries(data)
              .flatMap(([contentId, users]) =>
                users[user.uid] ? [contentId] : []
              );

            setUserLikedMovies(likedMovies);

            const favoriteMovies = allMovies.filter((movie) =>
              likedMovies.includes(movie.id)
            );

            setFavoriteMovies(favoriteMovies);
          } else {
            setFavoriteMovies([]);
            setUserLikedMovies([]);
          }
        });

        const fetchFavoriteSeries = () => {
          const favoriteSeries = allSeries.filter((series) =>
            userLikedMovies.includes(series.id)
          );
          setFavoriteSeries(favoriteSeries);
        };

        fetchFavoriteSeries();
      } else {
        setIsAuthenticated(false);
        setFavoriteMovies([]);
        setFavoriteSeries([]);
      }
    });

    return () => unsubscribe();
  }, [allMovies, userLikedMovies, allSeries]);

  return (
    <>
      <Head>
        <title>Pirates - Home</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen bg-black">
        <Navbar />
        <HeroBanner movie={featuredMovie} />
        <div className="relative z-10 space-y-8 -mt-32">
          {isAuthenticated && favoriteMovies.length > 0 && (
            <MovieRow title="Seus Filmes Favoritos" movies={favoriteMovies} />
          )}
          {isAuthenticated && favoriteSeries.length > 0 && (
            <MovieRow title="Suas Séries Favoritas" movies={favoriteSeries} isSeries={true} />
          )}
          <MovieRow title="Lançamentos" movies={moviesByReleaseYear[2024] || []} />
          <MovieRow title="Séries" movies={allSeries} isSeries={true} />
          <MovieRow title="Top 15 Melhores Avaliados" movies={topRatedMovies} />
          <MovieRow title="Para Rir" movies={comedyMovies} />
        </div>
      </div>
    </>
  );
}
