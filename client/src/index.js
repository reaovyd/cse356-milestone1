import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    HashRouter as Router,
    Routes, Route
} from 'react-router-dom'
import Editor from './Editor';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
       <Route path="/" element={<App />}/> 
       <Route path="/:id" element={<Editor />}/> 
    </Routes>
  </Router>
);
