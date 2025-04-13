import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { createHashRouter, RouterProvider } from 'react-router-dom';

import LandingPage from './routes/LandingPage';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import MyCards from './routes/MyCards';
import Chat from './routes/Chat';
import MyDeals from './routes/MyDeals';

const router = createHashRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path: "/newsletter",
        element: <LandingPage/>
      },
      {
        index: true,
        element: <Home/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/signup",
        element: <Signup/>
      },
      {
        path: "/mycards",
        element: <MyCards/>
      },
      {
        path: "/chat",
        element: <Chat/>
      },
      {
        path: "/deals",
        element: <MyDeals/>
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