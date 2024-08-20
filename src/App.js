import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './screens/LandingPage';
import About from './screens/About';
import Services from './screens/Services';
import FAQ from './screens/FAQ';
import Contact from './screens/Contact';
import FunctionalPage from './screens/FunctionalPage'; // Import the new Functional Page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/functional-page" element={<FunctionalPage />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
}

export default App;
