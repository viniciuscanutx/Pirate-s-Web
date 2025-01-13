'use client'

import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import Head from 'next/head';

const VideoPlayer = ({ url, subtitleUrl }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const tracks = subtitleUrl
    ? [
        {
          kind: 'subtitles',
          src: subtitleUrl,
          srcLang: 'pt',
          label: 'Português',
          default: true,
        },
      ]
    : [];

  if (!isClient) {
    return null;
  }

  return (
    <>
    <Head>
        <link rel="icon" href="/favicon.png" />
    </Head>
    <div className="player-wrapper">
      <ReactPlayer
        url={url}
        playing
        controls
        width="100%"
        height="100%"
        config={{
          file: {
            attributes: {
              crossOrigin: 'anonymous',
            },
            tracks,
          },
        }}
      />
      <style jsx>{`
        .player-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
        }
      `}</style>
    </div>
    </>
  );
};

export default VideoPlayer;

