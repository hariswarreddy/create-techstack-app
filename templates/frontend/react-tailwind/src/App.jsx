import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600 mb-4">
          Welcome to {'{{projectName}}'}
        </h1>
        <p className="text-zinc-400 text-xl mb-8">
          Built with React + Vite + Tailwind CSS ⚡
        </p>
        
        <div className="bg-zinc-900/50 backdrop-blur-lg rounded-2xl p-8 border border-zinc-800 shadow-2xl">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-8 py-4 bg-white text-zinc-950 font-semibold rounded-xl 
                       hover:bg-zinc-200 transform hover:scale-105 transition-all duration-300
                       shadow-lg"
          >
            Count is {count}
          </button>
          <p className="mt-6 text-zinc-500">
            Edit <code className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">src/App.jsx</code> and save to test HMR
          </p>
        </div>

        <p className="mt-8 text-zinc-600">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
}

export default App;
