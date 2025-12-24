import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress specific Recharts warnings about initial dimensions
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const suppressRechartsWarning = (args: any[]) => {
  const msg = args[0];
  if (typeof msg === 'string' && (
    msg.includes('The width(-1) and height(-1) of chart should be greater than 0') ||
    msg.includes('The width(0) and height(0) of chart should be greater than 0')
  )) {
    return true;
  }
  return false;
};

console.error = (...args) => {
  if (suppressRechartsWarning(args)) return;
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (suppressRechartsWarning(args)) return;
  originalConsoleWarn(...args);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);