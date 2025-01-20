import Link from "next/link"
import Head from "next/head"
import { useState, useEffect, useMemo } from "react"

import Navbar from "@/components/Navbar/navbar"

import { fetchNMovies, fetchNSeries } from '@/pages/api/client'
import { FaTags, FaFilm, FaTv } from 'react-icons/fa6';

export default function Search() {
    
    const [searchTerm, setSearchTerm] = useState("");
    const [allContent, setAllContent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            setError(null);

            try {
                const moviesData = await fetchNMovies()
                const seriesData = await fetchNSeries()

                const processedMovies = Array.isArray(moviesData) ? moviesData.map(movie => ({
                    ...movie,
                    hasSubtitles: !!movie.legenda,
                    type: 'movie'
                })) : [];

                const processedSeries = Array.isArray(seriesData) ? seriesData.map(series => ({
                    ...series,
                    hasSubtitles: series.temporadas.some(temporada => temporada.episodios.some(episodio => !!episodio.legenda)),
                    type: 'series'
                })) : [];

                const allContent = [...processedMovies, ...processedSeries];
                setAllContent(allContent);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const filteredContent = useMemo(() => {
        if (!searchTerm.trim()) {
            return allContent;
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            return allContent.filter((item) =>
                item.titulo.toLowerCase().includes(lowercasedTerm)
            );
        }
    }, [searchTerm, allContent]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <Head>
                <title>Pirates - Search</title>
                <link rel="icon" href="/logo.png" />
            </Head>
            <div className="min-h-screen bg-black">
                <Navbar />
                <div className="relative z-10 mt-32 text-center">
                    <div className="mt-8 flex justify-center">
                        <input
                            className="p-3 w-96 bg-black border-white border-2 rounded-md text-center text-white placeholder-gray-500"
                            type="text"
                            placeholder="Nome do Filme ou Série"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {loading && <p className="text-white mt-8">Loading...</p>}

                    <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
                        {filteredContent.length > 0 ? (
                            filteredContent.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-stone-950 border-white/10 border-2 p-6 rounded-md shadow-lg max-w-xs mx-auto"
                                >
                                    <Link href={item.type === 'movie' ? `/movie/${item._id}` : `/series/${item._id}`} className="block group/card">
                                        <img
                                            src={item.poster || "/placeholder.svg"}
                                            alt={item.titulo}
                                            className="w-full h-50 object-cover rounded-md mb-4 group-hover/card:scale-105 transition duration-200"
                                        />
                                        <h2 className="text-lg font-bold text-white">{item.titulo}</h2>
                                        <p className="text-gray-400 text-sm mt-2 line-clamp-4">{item.sinopse}</p>
                                        <p className="text-gray-400 text-sm mt-2">Lançamento: {item.fulllancamento}</p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Gênero: {item.genero}
                                        </p>
                                        <div className="mt-5 flex justify-center items-center space-x-2">
                                            {item.hasSubtitles && (
                                                <span className="inline-flex items-center bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                                    <FaTags className="mr-1" />
                                                    CC
                                                </span>
                                            )}
                                            <span className="inline-flex items-center bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                                                {item.type === 'movie' ? <FaFilm className="mr-1" /> : <FaTv className="mr-1" />}
                                                {item.type === 'movie' ? 'Filme' : 'Série'}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            !loading && <p className="text-gray-400 mt-8">Nenhum Filme ou Série Encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

