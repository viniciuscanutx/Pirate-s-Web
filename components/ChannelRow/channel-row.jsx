import React from 'react';
import Link from 'next/link';

export default function ChannelGrid({ title, channels }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}

function ChannelCard({ channel }) {
  return (
    <div className="bg-neutral-900 rounded-lg shadow-md overflow-hidden hover:border-2">
      <Link href={`/channels/${channel._id}`} className="block group/card">
        <div className="relative h-20">
          <img
            src={channel.logo}
            alt={channel.canal}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5">
          <h3 className="text-white font-semibold text-lg mb-4 truncate cursor-pointer">{channel.canal}</h3>
          <div className="flex items-center mt-2">
            <span className='text-white'>{channel.categoria}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
