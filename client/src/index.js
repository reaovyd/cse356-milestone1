import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    HashRouter as Router,
    Routes, Route
} from 'react-router-dom'
import Editor from './Editor';
import login from './login';
import signup from './signup';
import home from './home'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
       <Route path="/" element={<App />}/> 
       <Route path="/:id" element={<Editor />}/> 
       <Route path = "/login" element={<login />}/>
       <Route path = "/signup" element={<signup />}/>
       <Route path = "/home" element={<home />}/>
    </Routes>
  </Router>
);
