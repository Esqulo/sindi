import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LandingPage from './routes/LandingPage';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import ForgotPassword from './routes/ForgotPassword';
import SetNewPassword from './routes/SetNewPassord';
import MyCards from './routes/MyCards';
import Chat from './routes/Chat';
import MyDeals from './routes/MyDeals';
import Profile from './routes/Profile';
import Settings from './routes/Settings';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path: "newsletter",
        element: <LandingPage/>
      },
      {
        index: true,
        element: <Home/>
      },
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "signup",
        element: <Signup/>
      },
      {
        path: "forgotpassword",
        element: <ForgotPassword/>
      },
      {
        path: "mycards",
        element: <MyCards/>
      },
      {
        path: "chat",
        element: <Chat/>
      },
      {
        path: "deals",
        element: <MyDeals/>
      },
      {
        path: "profile/:user_id?",
        element: <Profile/>
      },
      {
        path: "settings",
        element: <Settings/>
      },
      {
        path: "setpassword",
        element: <SetNewPassword/>
      },
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);