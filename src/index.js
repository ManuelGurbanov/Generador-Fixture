import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="flex items-start justify-center bg-slate-700 w-screen h-screen">
      <App />
    </div>
  </React.StrictMode>
);
