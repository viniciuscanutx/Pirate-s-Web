import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

import Navbar from "@/components/Navbar/navbar";
import Comments from "@/components/Comments/comments";
import LikeButton from "@/components/LikeButton/likebutton";
import ParentalRating from "@/components/ParentalRating/parentalrating";
import MovieRow from "@/components/MovieRow/movie-row";

const { fetchNSeries, fetchNSeriesforID } = require('@/pages/api/client');

import { FaStar, FaTags } from 'react-icons/fa6';

export const getServerSideProps = async (context) => {
        const id = context.params.serieId;
        const seriesData = await fetchNSeriesforID(id)
        const allSeriesData = await fetchNSeries()


        const series = {
            id: seriesData._id,
            imdbid: seriesData.imdbid,
            titulo: seriesData.titulo,
            sinopse: seriesData.sinopse,
            lancamento: seriesData.lancamento,
            genero: seriesData.genero,
            avaliacao: seriesData.avaliacao,
            parentalRating: seriesData.parentalRating,
            poster: seriesData.poster,
            banner: seriesData.banner,
            hasSubtitles: seriesData.temporadas.some(temporada => temporada.episodios.length >= 1),
            isDubbed: false, 
            seasons: seriesData.temporadas.map(temporada => ({
                number: temporada.numero,
                episodes: temporada.episodios.map(episodio => ({
                    number: episodio.numero,
                    title: episodio.titulo,
                    link: episodio.link,
                    subtitles: episodio.legenda,
                })),
            })),
        };

        const allSeries = allSeriesData.map((serie) => ({
            id: serie._id,
            imdbid: serie.imdbid,
            titulo: serie.titulo,
            sinopse: serie.sinopse,
            lancamento: serie.lancamento,
            genero: serie.genero,
            nota: serie.avaliacao,
            parentalRating: serie.parentalRating,
            poster: serie.poster,
            banner: serie.banner,
            hasSubtitles: !!serie.legenda,
            isDubbed: false,
        }));

        return {
            props: {
                series: series || null,
                allSeries: allSeries || [],
            },
        };
} 

const SeriesDetail = ({ series, allSeries }) => {
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(series?.seasons[0]?.episodes[0]);

    useEffect(() => {
        setSelectedEpisode(series?.seasons[selectedSeason - 1]?.episodes[0]);
    }, [selectedSeason, series]);

    if (!series) {
        return <p className="text-center text-xl mt-4">Série não encontrada.</p>;
    }

    const handleSeasonChange = (season) => {
        setSelectedSeason(season);
    };

    const handleEpisodeChange = (episodeIndex) => {
        setSelectedEpisode(series.seasons[selectedSeason - 1]?.episodes[episodeIndex]);
    };

    const seasonEpisodes = series.seasons[selectedSeason - 1]?.episodes || [];

    return (
        <>
            <Head>
                <title>{`Pirates - ${series.title}`}</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Navbar />
            <div
                className="fixed top-0 left-0 w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95)), url(${series.banner})`,
                }}
            ></div>
            <div className="relative z-10 flex flex-col items-center py-32 px-8">
                <div className="flex flex-wrap justify-center items-start gap-8 w-full max-w-6xl">
                    <div className="text-center max-w-xs flex-1 relative">
                        <ParentalRating rating={series.parentalRating} />
                        <Image
                            src={series.poster}
                            width={280}
                            height={450}
                            alt={series.titulo}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="flex-2 max-w-lg">
                        <h3 className="text-3xl font-bold mb-2 text-white">{series.titulo}</h3>
                        <h4 className="text-md text-gray-100 mb-6 flex items-center">
                            {series.hasSubtitles ? (
                                <span className="bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold flex items-center">
                                    <FaTags className="mr-1" />
                                    CC
                                </span>
                            ) : (
                                <span className="bg-yellow-400 text-black px-1 rounded text-xs font-bold flex items-center">
                                    <FaTags className="mr-1" />
                                    DUB
                                </span>
                            )}
                        </h4>
                        <p className="text-md text-gray-300 mt-3 mb-2">{series.genero}</p>
                        <h4 className="text-md text-gray-100 mb-6 flex items-center">
                            {series.lancamento}
                        </h4>
                        <h2 className="text-xl flex items-center mb-6 text-yellow-300 font-bold">
                            <FaStar className="mr-2" /> {series.avaliacao}
                        </h2>
                        <div className="mb-8">
                            <p className="text-justify text-gray-100 leading-relaxed">{series.sinopse}</p>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-xl font-bold mb-4 text-white">Selecione uma temporada:</h4>
                            <select
                                className="w-full p-2 bg-stone-900 text-white rounded"
                                onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
                                value={selectedSeason}
                            >
                                {series.seasons.map((season, index) => (
                                    <option key={season.number} value={index + 1}>
                                        Temporada {season.number}
                                    </option>
                                ))}
                            </select>
                            <h4 className="text-xl font-bold mb-4 text-white mt-4">Selecione um episódio:</h4>
                            <select
                                className="w-full p-2 bg-stone-900 text-white rounded"
                                onChange={(e) => handleEpisodeChange(parseInt(e.target.value))}
                                value={selectedEpisode ? seasonEpisodes.indexOf(selectedEpisode) : 0}
                            >
                                {seasonEpisodes.length > 0 ? (
                                    seasonEpisodes.map((episode, index) => (
                                        <option key={episode.number} value={index}>
                                            Episódio {episode.number}: {episode.title}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Nenhum episódio disponível</option>
                                )}
                            </select>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <Link
                                href={`/watchseries/${series.id}/${selectedSeason}/${selectedEpisode?.number}`}
                                className="px-6 py-3 bg-white text-black uppercase rounded-md shadow-md hover:bg-yellow-300 transition"
                            >
                                Assistir Episódio
                            </Link>
                            <LikeButton movieId={series.id.toString()} />
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-6xl mt-8">
                    <Comments movieId={series.id.toString()} />
                </div>
                <div className="w-full max-w-6xl mt-24 mr-20">
                    <MovieRow
                        title="Séries Relacionadas"
                        movies={allSeries || []} 
                        isSeries={true}
                    />
                </div>
            </div>
        </>
    );
};

export default SeriesDetail;
