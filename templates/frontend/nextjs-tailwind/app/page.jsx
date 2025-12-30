'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
          Welcome to {{projectName}}
        </h1>
        <p className="text-gray-300 text-xl mb-12">
          Built with Next.js 15 + Tailwind CSS ▲
        </p>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl mb-12">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl 
                       hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300
                       shadow-xl hover:shadow-purple-500/30"
          >
            Count is {count}
          </button>
          <p className="mt-8 text-gray-400">
            Edit <code className="bg-gray-800/50 px-3 py-1 rounded-lg text-purple-400 font-mono">app/page.jsx</code> and save to see your changes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="https://nextjs.org/docs"
            className="group p-8 bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
              Docs →
            </h2>
            <p className="text-gray-400">
              Find in-depth information about Next.js features and API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="group p-8 bg-white/5 backdrop-blur rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
              Learn →
            </h2>
            <p className="text-gray-400">
              Learn about Next.js in an interactive course.
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
