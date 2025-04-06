import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

const HomePage: React.FC = () => {
  const { account, disconnect } = useWeb3();
  const [activeTimeframe, setActiveTimeframe] = useState<string>('1D');
  
  // Truncate wallet address for display
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="text-2xl font-bold text-blue-600">IntelliDeFi</div>
        {/* <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-800 font-medium">Dashboard</Link>
          <Link to="/risk-assessment" className="text-gray-600 hover:text-gray-800">Risk Assessment</Link>
          <Link to="/create-portfolio" className="text-gray-600 hover:text-gray-800">Create Portfolio</Link>
          <Link to="/trading" className="text-gray-600 hover:text-gray-800">Trading</Link>
          <Link to="/eliza" className="text-gray-600 hover:text-gray-800">Eliza AI</Link>
        </nav> */}
        <div className="flex items-center space-x-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">New</span>
          <div className="bg-gray-100 py-1 px-3 rounded-full flex items-center">
            <span className="text-sm font-medium mr-2">{account ? truncateAddress(account) : 'Not connected'}</span>
            {account && (
              <button onClick={disconnect} className="text-xs text-gray-500 hover:text-red-500">
                Disconnect
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-8 text-white flex flex-col md:flex-row items-center">
        <div className="md:w-3/4 mb-6 md:mb-0">
          <h1 className="text-3xl font-bold mb-2">Meet Eliza: Your Blockchain AI Assistant</h1>
          <p className="text-blue-100 mb-4">
            Eliza is our new multimodal AI assistant specialized in blockchain and finance. 
            Ask questions, get market insights, analyze contracts, and more - all through a natural conversation.
          </p>
          <Link 
            to="/eliza" 
            className="bg-white text-blue-700 px-6 py-2 rounded-lg font-medium inline-flex items-center hover:bg-blue-50"
          >
            Chat with Eliza
            <span className="ml-2 text-xl">🤖</span>
          </Link>
        </div>
        <div className="md:w-1/4 md:flex justify-end">
          {/* Placeholder for an illustration if needed */}
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 mb-2">Total Balance</div>
          <div className="text-3xl font-bold mb-2">1,500 USDT</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 mb-2">Total Profit/Loss</div>
          <div className="text-3xl font-bold text-green-500 mb-2">+5.4%</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 mb-2">Active Positions</div>
          <div className="text-3xl font-bold mb-2">7</div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Performance</h2>
          <div className="flex space-x-2">
            {['1D', '1W', '1M', '3M', 'YTD', '1Y'].map((timeframe) => (
              <button
                key={timeframe}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeTimeframe === timeframe 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTimeframe(timeframe)}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
          {/* Performance chart would go here */}
          <p className="text-gray-400">Performance Chart Visualization ({activeTimeframe})</p>
        </div>
      </div>

      {/* Portfolios and Transactions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Portfolios Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Your Portfolios</h2>
          
          <div className="space-y-4">
            {/* Low Risk Portfolio */}
            <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Low Risk Portfolio</h3>
                <div className="flex space-x-2">
                  <button className="text-blue-600 text-sm hover:underline">View Details</button>
                  <button className="text-blue-600 text-sm hover:underline">Rebalance</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-gray-500 text-xs">Balance</div>
                  <div className="font-medium">1000 USDT</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Performance</div>
                  <div className="font-medium text-green-500">+2.5%</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Assets</div>
                  <div className="font-medium">4</div>
                </div>
              </div>
            </div>

            {/* Medium Risk Portfolio */}
            <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Medium Risk Portfolio</h3>
                <div className="flex space-x-2">
                  <button className="text-blue-600 text-sm hover:underline">View Details</button>
                  <button className="text-blue-600 text-sm hover:underline">Rebalance</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-gray-500 text-xs">Balance</div>
                  <div className="font-medium">500 USDT</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Performance</div>
                  <div className="font-medium text-green-500">+8.3%</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Assets</div>
                  <div className="font-medium">3</div>
                </div>
              </div>
            </div>

            {/* Create New Portfolio Button */}
            <div className="flex justify-center p-4">
              <Link 
                to="/create-portfolio" 
                className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <span className="text-xl">+</span>
                <span className="font-medium">Create New Portfolio</span>
              </Link>
            </div>
            <p className="text-center text-sm text-gray-500">
              Build a customized portfolio based on your risk profile
            </p>
            <div className="flex justify-center mt-2">
              <Link 
                to="/create-portfolio" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
          </div>
          
          <div className="space-y-4">
            {/* Transaction 1 */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <div className="bg-green-100 text-green-800 rounded px-2 py-1 text-xs mr-3">Buy</div>
                <div>
                  <div className="text-sm text-gray-500">2025-03-12</div>
                  <div className="font-medium">ETH</div>
                </div>
              </div>
              <div className="font-medium">0.5 ETH</div>
            </div>

            {/* Transaction 2 */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <div className="bg-red-100 text-red-800 rounded px-2 py-1 text-xs mr-3">Sell</div>
                <div>
                  <div className="text-sm text-gray-500">2025-03-10</div>
                  <div className="font-medium">BTC</div>
                </div>
              </div>
              <div className="font-medium">0.02 BTC</div>
            </div>

            {/* Transaction 3 */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs mr-3">Rebalance</div>
                <div>
                  <div className="text-sm text-gray-500">2025-03-08</div>
                  <div className="font-medium">Portfolio #1</div>
                </div>
              </div>
              <div></div>
            </div>

            <div className="flex justify-center mt-4">
              <Link to="/transactions" className="text-blue-600 hover:underline text-sm">
                View All Transactions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/deposit" 
            className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all"
          >
            <span className="font-medium">Deposit Funds</span>
            <span className="text-gray-500">→</span>
          </Link>
          
          <Link 
            to="/create-portfolio" 
            className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all"
          >
            <span className="font-medium">Create New Portfolio</span>
            <span className="text-gray-500">→</span>
          </Link>
          
          <Link 
            to="/risk-assessment" 
            className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all"
          >
            <span className="font-medium">View Risk Assessment</span>
            <span className="text-gray-500">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
