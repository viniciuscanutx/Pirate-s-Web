import Image from 'next/image';
import Link from 'next/link';

import convertMinutesToHours from '@/utils/convertDuration';

export default function HeroBanner({ movie }) {
  if (!movie) return null;

  return (
    <div className="relative h-[80vh] w-full mb-32">
      <Image
        src={movie.banner || movie.poster}
        alt={movie.titulo || 'Filme'}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {movie.titulo || 'Título Desconhecido'}
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mb-2">
        {movie.parentalRating} • {movie.lancamento || 'Ano Desconhecido'} • {movie.duracao ? convertMinutesToHours(movie.duracao) : 'Duração Desconhecida'}
        </p>
        <p className="text-lg text-white/90 max-w-2xl mb-3">
          {movie.genero ? (movie.genero) : 'Gênero Desconhecido'}
        </p>
        <h2 className="text-base flex items-center mb-6 text-white/90">
          {movie.sinopse || 'Sinopse indisponível'}
        </h2>
        <div className="flex gap-4">
          <Link
            href={movie.id ? `/watch/${movie.id}` : '#'}
            target="_blank"
            className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-600/90"
          >
            Play
          </Link>
          <Link
            href={`/movie/${movie.id || '#'}`}
            className="bg-white/90 text-black px-6 py-2 rounded font-semibold hover:bg-gray-300"
          >
            Info
          </Link>
        </div>
      </div>
    </div>
  );
}

