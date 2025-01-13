import Navbar from "@/components/Navbar/navbar"

import Head from "next/head"

export default function About() {
    return (
        <>
        <Head>
            <title>Xerife TV - Sobre</title>
            <link rel="icon" href="/favicon.png" />
        </Head>
        <div className="mt-48 bg-black">
            <Navbar />
            <div className="relative z-10 mt-32">
                <h1 className="text-5xl text-center font-bold">Sobre nós</h1>
                <p className="text-xl text-center mt-10 mb-32">Nosso website é um agregador de conteúdo.</p>
                <p className="text-lg text-center -mt-28">Não hosteamos qualquer link.</p>
            </div>
            <div className="relative z-10 mt-32">
                <h1 className="text-5xl text-center font-bold">Contribuição</h1>
                <p className="text-xl text-center mt-10 mb-32 text-red-600">Pirate's Team</p>
                <img
                className=" -mt-20 mx-auto "
                height="100"
                width="100"
                src="https://pt.boxcritters.wiki/images/3/38/Chap%C3%A9u_Pirata_%C3%ADcone.png"
                alt="Logo"
              />
            </div>
        </div>
        </>
    )
}