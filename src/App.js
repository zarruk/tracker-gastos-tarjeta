import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExternalForm from './components/ExternalForm';
import InternalForm from './components/InternalForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExternalForm />} />
        <Route path="/interno" element={<InternalForm />} />
      </Routes>
    </Router>
  );
}

export default App; 