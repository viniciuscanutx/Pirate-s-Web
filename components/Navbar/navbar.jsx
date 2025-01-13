import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, User, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';

import { auth } from '@/config/firebaseConfig'

import { FaUser } from 'react-icons/fa6';




export default function Navbar() {
    const [user, setUser] = useState(null)
    const [showLogout, setShowLogout] = useState(false)
    const [showCategories, setShowCategories] = useState(false)
    const router = useRouter()
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser)
      });
  
      return () => unsubscribe();
    }, []);
  
    const handleLogout = async () => {
      try {
        await signOut(auth)
        router.push('/')
      } catch (error) {
        console.error("Error signing out", error)
      }
    };
  
    return (
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-12">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <img
                  height="80"
                  width="80"
                  src="https://pt.boxcritters.wiki/images/3/38/Chap%C3%A9u_Pirata_%C3%ADcone.png"
                  alt="Logo"
                />
              </Link>
              <div className="hidden md:block">
                <div className="flex items-center space-x-6">
                  <div
                    className="relative"
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}
                  >
                    <span className="text-white hover:text-gray-300 cursor-pointer">
                      Categorias
                    </span>
                    {showCategories && (
                      <div className="absolute -right-20  py-2 w-48 bg-stone-900 rounded-md shadow-xl z-20">
                        <Link href="/MoviesCategory">
                          <div className="block px-4 py-2 text-sm capitalize text-white hover:bg-red-700">
                            Filmes
                          </div>
                        </Link>
                        <Link href="/SeriesCategory">
                          <div className="block px-4 py-2 text-sm capitalize text-white hover:bg-red-700">
                            Series
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link href="/channels" className="text-white hover:text-gray-300">
                    Canais
                  </Link>
                  <Link href="/about" className="text-white hover:text-gray-300">
                    Sobre
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-white hover:text-gray-300 mr-5 ">
                <Search className="text-white h-5 w-5 hover:text-gray-300"  />
              </Link>
              {user ? (
                <div
                  className="relative mt-1 hover:text-gray-300"
                  onMouseLeave={() => setShowLogout(false)}
                >
                  <span
                    className="text-white cursor-pointer hover:text-gray-300"
                    onMouseEnter={() => setShowLogout(true)}
                  >
                    {user.displayName || user.email}
                  </span>
                  {showLogout && (
                    <div className="absolute -left-24 mt-0 py-2 w-52 bg-stone-900 rounded-md shadow-xl z-20">
                      <Link href="/favorites">
                        <button className="block px-4 py-2 text-sm capitalize text-white hover:bg-red-700 w-full text-left">
                          <FaUser className="inline-block h-5 w-5 mr-5" />
                          Perfil
                        </button>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm capitalize text-white hover:bg-red-700 w-full text-left"
                      >
                        <LogOut className="inline-block h-5 w-5 mr-5" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="text-white hover:text-gray-300">
                  <User className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
}
  
