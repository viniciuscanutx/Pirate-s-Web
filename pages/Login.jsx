import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 

import { auth } from '@/config/firebaseConfig';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import Head from 'next/head';
import Link from 'next/link';

import { FaGoogle } from 'react-icons/fa';

const Auth = () => {
  const router = useRouter(); 
  const [user, setUser] = useState(auth.currentUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(''); 
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/'); 
    }
  }, [user, router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setUser(auth.currentUser);
    } catch (error) {
      console.error('Error signing in with Google', error);
      setError('Erro ao autenticar com Google.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out', error);
      setError('Erro ao deslogar.');
    }
  };

  const handleEmailPasswordAuth = async () => {
    setError('');
    try {
      if (isSignup) {
        if (!nickname.trim()) {
          setError('O campo de nickname é obrigatório.');
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, {
          displayName: nickname,
        });

        setUser(auth.currentUser);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setUser(auth.currentUser);
      }
    } catch (error) {
      console.error('Error with email and password', error);
      setError('Erro ao autenticar com e-mail e senha.');
    }
  };

  return (
    <>
      <Head>
        <title>Pirates - Login</title>
        <link rel="icon" href="/icon.png" />
      </Head>

      <div className="mt-32 max-w-md mx-auto p-7 rounded shadow-lg bg-stone-900">
        {user ? (
          <div>
            <p className="text-white mb-5">Olá, {user.displayName || user.email}</p>
            <button
              onClick={handleSignOut}
              className="mt-2 px-4 py-2 bg-red-600 text-black rounded hover:bg-red-700 transition"
            >
              Sair
            </button>
            <Link
              href="/"
              className="mt-2 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition inline-block ml-2"
            >
              Home
            </Link>
          </div>
        ) : (
          <div>
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex justify-center mb-12">
              <img
                height="100"
                width="150"
                src="https://pt.boxcritters.wiki/images/3/38/Chap%C3%A9u_Pirata_%C3%ADcone.png"
                alt="Logo"
              />
            </div>

            {isSignup && (
              <div className="mb-4">
                <p className="text-center mb-2 text-white">Nickname:</p>
                <input
                  type="text"
                  className="w-full px-4 py-2 text-white bg-stone-950 rounded"
                  placeholder="..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            )}

            <div className="mb-4">
              <p className="text-center mb-2 text-white">Email:</p>
              <input
                type="email"
                className="w-full px-4 py-2 text-white bg-stone-950 rounded mb-4"
                placeholder="..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-center mb-2 text-white">Senha:</p>
              <input
                type="password"
                className="w-full px-4 py-2 text-white bg-stone-950 rounded mb-8"
                placeholder="..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={signInWithGoogle}
                className="flex items-center px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-600/90 transition transform hover:scale-105 shadow-md"
              >
                <FaGoogle className="mr-3 text-xl" />
                Entrar com Google
              </button>
            </div>

            <div className="flex justify-center mb-10">
              <button
                onClick={handleEmailPasswordAuth}
                className="flex items-center px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-600/90 transition transform hover:scale-105 shadow-md"
              >
                {isSignup ? 'Cadastrar' : 'Entrar'}
              </button>
            </div>

            <div className="mt-4 mb-3 text-center">
              <p>
                {isSignup ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-yellow-400 underline"
                >
                  {isSignup ? 'Fazer login' : 'Criar conta'}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Auth;
