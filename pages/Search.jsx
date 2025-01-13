import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar/navbar";

import { FaTags } from 'react-icons/fa6';

export default function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const [allMovies, setAllMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://web-films-api-test.vercel.app/found`);

                if (!response.ok) {
                    throw new Error("Failed to fetch movies");
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    const movies = data.map(movie => ({
                        ...movie,
                        hasSubtitles: !!movie.legenda,
                    }));
                    setAllMovies(movies);
                    setFilteredMovies(movies); 
                } else {
                    setAllMovies([]);
                    setFilteredMovies([]);
                    setError("Unexpected response format.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredMovies(allMovies); 
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = allMovies.filter((movie) =>
                movie.titulo.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredMovies(filtered);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <>
            <Head>
                <title>Xerife TV - Search</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <div className="min-h-screen bg-black">
                <Navbar />
                <div className="relative z-10 mt-32 text-center">
                    <div className="mt-8 flex justify-center">
                        <input
                            className="p-3 w-96 bg-black border-white border-2 rounded-md text-center text-white placeholder-gray-500"
                            type="text"
                            placeholder="Nome do Filme"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="ml-4 p-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-600/90"
                            onClick={handleSearch}
                        >
                            Procurar
                        </button>
                    </div>

                    {loading && <p className="text-white mt-8">Loading...</p>}

                    <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
                        {filteredMovies.length > 0 ? (
                            filteredMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="bg-stone-950 border-white/10 border-2 p-6 rounded-md shadow-lg max-w-xs mx-auto"
                                >
                                    <Link href={`/movie/${movie._id}`} className="block group/card">
                                        <img
                                            src={movie.poster}
                                            alt={movie.titulo}
                                            className="w-full h-50 object-cover rounded-md mb-4 group-hover/card:scale-105 transition duration-200"
                                        />
                                        <h2 className="text-lg font-bold text-white">{movie.titulo}</h2>
                                        <p className="text-gray-400 text-sm mt-2 line-clamp-4">{movie.sinopse}</p>
                                        <p className="text-gray-400 text-sm mt-2">Lançamento: {movie.fulllancamento}</p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Gênero: {movie.genero}
                                        </p>
                                        {movie.hasSubtitles && (
                                            <span className="inline-flex items-center bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mt-5">
                                                <FaTags className="mr-1" />
                                                CC
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            ))
                        ) : (
                            !loading && <p className="text-gray-400 mt-8">Nenhum Filme Encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
