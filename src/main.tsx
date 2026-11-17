import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import { PRODUCTS, Product } from './lib/store-logic.ts';
import './index.css';

declare global {
  interface Window {
    __INITIAL_PRODUCTS__?: Product[];
  }
}

const rootElement = document.getElementById('root')!;
const initialProducts =
  typeof window !== 'undefined' && Array.isArray(window.__INITIAL_PRODUCTS__)
    ? window.__INITIAL_PRODUCTS__
    : PRODUCTS;

if (rootElement.firstElementChild) {
  hydrateRoot(rootElement, <App initialProducts={initialProducts} />);
} else {
  createRoot(rootElement).render(<App initialProducts={initialProducts} />);
}
