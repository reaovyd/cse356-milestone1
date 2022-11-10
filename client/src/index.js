import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './home';
import {
    HashRouter as Router,
    Routes, Route
} from 'react-router-dom'
import Editor from './Editor';
import Login from './login';
import Signup from './signup';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
        <Route path="/Home" element={<Home />}/> 
        <Route path="/edit/:id" element={<Editor />}/> 
        <Route path = "/" element={<Login />}/>
        <Route path = "/signup" element={<Signup />}/>
    </Routes>
  </Router>
);
  
