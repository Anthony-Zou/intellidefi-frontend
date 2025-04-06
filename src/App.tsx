import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import RiskAssessment from './components/risk/RiskAssessment';
import PortfolioCreation from './components/portfolio/PortfolioCreation';
import Trading from './components/trading/Trading';
import ElizaChat from './components/eliza/ElizaChat';
import HomePage from './pages/HomePage';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
    <p className="text-xl text-gray-600">Page Not Found</p>
  </div>
);

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/risk-assessment" element={<RiskAssessment />} />
              <Route path="/create-portfolio" element={<PortfolioCreation />} />
              <Route path="/trading" element={<Trading />} />
              <Route path="/eliza" element={<ElizaChat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
