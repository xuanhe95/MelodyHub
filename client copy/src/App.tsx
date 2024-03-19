import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import logo from './logo.svg';
import './App.css';
import SignInSide from './SignInSide';
import HomePage from './HomePage';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/testLogin' element={<Navigate to='/login'/> }/>
        <Route path = '/login' element = {<SignInSide/>} />
        <Route path = '/home' element = {<HomePage/>} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
