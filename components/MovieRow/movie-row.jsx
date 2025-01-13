'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { FaTags } from 'react-icons/fa6'

export default function MovieRow({ title, movies, isSeries = false }) {
  const rowRef = useRef(null)

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-2 py-4">
      <h2 className="text-xl font-semibold text-white px-8">{title}</h2>
      <div className="group relative">
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-40 h-9 w-9 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-scroll scrollbar-hide px-8 pb-4"
        >
          {movies.map((movie) => {
            const linkHref = isSeries ? `/series/${movie.id}` : `/movie/${movie.id}`

            return (
              <div key={movie.id} className="flex-none w-[200px]">
                <Link href={linkHref} className="block group/card">
                  <div className="relative aspect-[2/3] rounded-md overflow-hidden">
                    <Image
                      src={movie.poster}
                      alt={movie.titulo}
                      fill
                      className="object-cover group-hover/card:scale-105 transition duration-200"
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <h3 className="text-white font-medium truncate">{movie.titulo}</h3>
                    <div className="flex items-center justify-start space-x-2">
                      {movie.hasSubtitles && (
                        <span className="bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold flex items-center">
                          <FaTags className="mr-1" />
                          CC
                        </span>
                      )}
                      {movie.isDubbed && (
                        <span className="bg-blue-500 text-white px-1 rounded text-xs font-bold flex items-center">
                          <FaTags className="mr-1" />
                          DUB
                        </span>
                      )}
                    </div>
                    <h4 className="text-gray-300 font-light truncate">{movie.lancamento}</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-red-600 fill-red-600" />
                      <span className="text-white/90">{movie.nota}</span>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-40 h-9 w-9 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  )
}
