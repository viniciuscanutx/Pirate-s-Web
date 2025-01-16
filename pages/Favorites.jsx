import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Head from "next/head";

import { ref, onValue } from "firebase/database";
import { db } from "@/config/firebaseConfig";
import { getAuth, signOut } from "firebase/auth";

const { fetchNMovies, fetchNSeries } = require('@/pages/api/client');

import Navbar from "@/components/Navbar/navbar";
import MovieRow from "@/components/MovieRow/movie-row";

const Favorites = () => {
    const [likedContent, setLikedContent] = useState([]);
    const [user, setUser ] = useState(null);
    const [allContent, setAllContent] = useState([]);
    const [allSeries, setAllSeries] = useState([]); 
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser ) => {
            if (currentUser ) {
                setUser (currentUser );
            } else {
                router.push("/Login");
            }
        });

        return () => unsubscribeAuth();
    }, [router]);

    useEffect(() => {
        if (!user) return;

        const likedContentRef = ref(db, `like`);
        const unsubscribe = onValue(likedContentRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const userLikedContent = Object.entries(data).flatMap(([contentId, users]) =>
                    users[user.uid] ? [contentId] : []
                );
                setLikedContent(userLikedContent);
            } else {
                setLikedContent([]);
            }
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await fetchNMovies()

                const allMovies = data.map((movie) => ({
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
                }));
                setAllContent(allMovies);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar conteúdo:", error);
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const favoriteContent = allContent.filter((item) => likedContent.includes(item.id));

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const data = await fetchNSeries()

                const allSeries = data.map((series) => ({
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
                    hasSubtitles: !!series.temporadas.some(temporada => temporada.episodios.length > 0),
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
                setAllSeries(allSeries);
            } catch (error) {
                console.error("Erro ao buscar séries:", error);
            }
        };

        fetchSeries();
    }, []);

    const favoriteSeries = allSeries.filter((item ) => likedContent.includes(item.id));

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                console.log("Usuário deslogado");
                router.push("/");
            })
            .catch((error) => {
                console.error("Erro ao deslogar:", error);
            });
    };

    return (
        <>
        <Head>
            <title>Seus Favoritos</title>
            <link rel="icon" href="/icon.png" />
        </Head>
            <Navbar />
            <div className="mt-72 relative">
                {user && (
                    <button
                        onClick={handleLogout}
                        className="absolute top-4 -mt-52 right-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                    >
                        Deslogar
                    </button>
                )}
                <h2 className="text-3xl font-bold mb-4 ml-8">
                    {user ? (
                        <>Olá, <span className="text-yellow-400">{user.displayName || user.email || "Usuário"}</span></>
                    ) : (
                        "Olá, Usuário"
                    )}
                </h2>
                <h3 className="ml-8">Sua sessão de filmes curtidos:</h3>
                {loading ? (
                    <div className="text-center">
                        <p>Carregando filmes...</p>
                    </div>
                ) : favoriteContent.length > 0 ? (
                    <div className="relative z-10">
                        <MovieRow movies={favoriteContent} />
                    </div>
                ) : (
                    <p className="text-gray-400 mt-2 ml-8">Você ainda não curtiu nenhum filme.</p>
                )}

                <h3 className="ml-8 mt-8">Sua sessão de séries curtidas:</h3>
                {loading ? (
                    <div className="text-center">
                        <p>Carregando séries...</p>
                    </div>
                ) : favoriteSeries.length > 0 ? (
                    <div className="relative z-10">
                        <MovieRow movies={favoriteSeries} />
                    </div>
                ) : (
                    <p className="text-gray-400 mt-2 ml-8">Você ainda não curtiu nenhuma série.</p>
                )}
            </div>
        </>
    );
};

export default Favorites;