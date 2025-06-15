import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import AppInitializer from './app/AppInitializer';
import '@/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppInitializer>
      <RouterProvider router={router} />
    </AppInitializer>
  </React.StrictMode>
);