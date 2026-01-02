'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600 mb-4">
          Welcome to {'{{projectName}}'}
        </h1>
        <p className="text-zinc-400 text-xl mb-12">
          Built with Next.js 15 + Tailwind CSS ▲
        </p>
        
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-10 border border-zinc-800 shadow-2xl mb-12">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-10 py-5 bg-white text-zinc-950 font-bold text-lg rounded-2xl 
                       hover:bg-zinc-200 transform hover:scale-105 transition-all duration-300
                       shadow-xl"
          >
            Count is {count}
          </button>
          <p className="mt-8 text-zinc-500">
            Edit <code className="bg-zinc-800/50 px-3 py-1 rounded-lg text-zinc-300 font-mono">app/page.jsx</code> and save to see your changes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="https://nextjs.org/docs"
            className="group p-8 bg-zinc-900/50 backdrop-blur rounded-2xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-zinc-300 transition-colors">
              Docs →
            </h2>
            <p className="text-zinc-500">
              Find in-depth information about Next.js features and API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="group p-8 bg-zinc-900/50 backdrop-blur rounded-2xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-zinc-300 transition-colors">
              Learn →
            </h2>
            <p className="text-zinc-500">
              Learn about Next.js in an interactive course.
            </p>
          </a>
        </div>

        <footer className="mt-12 text-zinc-700 text-sm">
          Built by <a href="https://harib.vercel.app" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">hariswarreddy</a>
        </footer>
      </div>
    </main>
  );
}
