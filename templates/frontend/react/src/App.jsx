import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to {{projectName}}</h1>
        <p>Built with React + Vite ⚡</p>
        
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
        
        <footer className="footer">
          Built by <a href="https://harib.vercel.app" target="_blank" rel="noopener noreferrer">hariswarreddy</a>
        </footer>
      </header>
    </div>
  );
}

export default App;
