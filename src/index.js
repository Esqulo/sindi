import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LandingPage from './routes/LandingPage';
import Home from './routes/Home';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path: "/newsletter",
        element: <LandingPage/>
      },
      {
        path: "/",
        element: <Home/>
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);