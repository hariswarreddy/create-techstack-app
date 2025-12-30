import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mb-4">
          Welcome to {{projectName}}
        </h1>
        <p className="text-gray-300 text-xl mb-8">
          Built with React + Vite + Tailwind CSS ⚡
        </p>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl 
                       hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                       shadow-lg hover:shadow-pink-500/25"
          >
            Count is {count}
          </button>
          <p className="mt-6 text-gray-400">
            Edit <code className="bg-gray-800 px-2 py-1 rounded text-pink-400">src/App.jsx</code> and save to test HMR
          </p>
        </div>

        <p className="mt-8 text-gray-500">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
}

export default App;
