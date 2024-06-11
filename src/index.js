import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import os from 'os-browserify/browser';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="flex items-start justify-center w-screen h-screen bg-slate-700">
      <App />
    </div>
  </React.StrictMode>
);
