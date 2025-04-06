import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { WalletIcon, ChartLineIcon, ExchangeAltIcon, RobotIcon } from '../../utils/icons';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register the chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { account, isConnected, connectWallet } = useWeb3();
  const [portfolios, setPortfolios] = useState<{ id: number; name: string; balance: string; performance: string; assets: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<{ id: number; type: string; asset: string; amount: string; date: string; status: string }[]>([]);
  const [timeframe, setTimeframe] = useState('1W');

  // Chart data
  const chartData = {
    labels: ['6 Days Ago', '5 Days Ago', '4 Days Ago', '3 Days Ago', '2 Days Ago', 'Yesterday', 'Today'],
    datasets: [
      {
        label: 'Portfolio Value (USDT)',
        data: [1350, 1400, 1390, 1420, 1480, 1450, 1500],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 14,
          weight: 'bold' as const, // Fix: use 'bold' as const instead of just a string
        },
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6B7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6B7280',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const, // Fix: add type assertion here
    },
  };

  useEffect(() => {
    if (isConnected) {
      // Simulate loading
      setLoading(true);
      setTimeout(() => {
        setPortfolios([
          { id: 1, name: 'Low Risk Portfolio', balance: '1000 USDT', performance: '+2.5%', assets: 4 },
          { id: 2, name: 'Medium Risk Portfolio', balance: '500 USDT', performance: '+8.3%', assets: 3 }
        ]);
        
        setTransactions([
          { id: 1, type: 'Buy', asset: 'ETH', amount: '0.5 ETH', date: '2025-03-12', status: 'Completed' },
          { id: 2, type: 'Sell', asset: 'BTC', amount: '0.02 BTC', date: '2025-03-10', status: 'Completed' },
          { id: 3, type: 'Rebalance', asset: 'Portfolio #1', amount: '', date: '2025-03-08', status: 'Completed' },
        ]);
        
        setLoading(false);
      }, 1000);
    }
  }, [isConnected, account]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to IntelliDeFi</h2>
          <p className="text-gray-600 mb-6">Connect your wallet to view your portfolios and start investing.</p>
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* New Eliza AI Feature Callout */}
      {isConnected && !loading && (
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-md overflow-hidden">
          <div className="md:flex items-center">
            <div className="px-6 py-8 md:w-2/3">
              <div className="flex items-center mb-4">
                <RobotIcon className="text-white text-2xl mr-3" />
                <h3 className="text-xl font-bold text-white">Meet Eliza: Your Blockchain AI Assistant</h3>
              </div>
              <p className="text-blue-100 mb-4">Eliza is our new multimodal AI assistant specialized in blockchain and finance. Ask questions, get market insights, analyze contracts, and more - all through a natural conversation.</p>
              <Link 
                to="/eliza-ai"
                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Chat with Eliza
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="md:w-1/3 bg-blue-800 bg-opacity-30 p-6 hidden md:flex justify-center items-center">
              <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <span className="text-5xl">🤖</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <WalletIcon className="text-blue-600 text-2xl mr-4" />
            <div>
              <p className="text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold">1,500 USDT</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <ChartLineIcon className="text-green-600 text-2xl mr-4" />
            <div>
              <p className="text-gray-500">Total Profit/Loss</p>
              <p className="text-2xl font-bold text-green-600">+5.4%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center">
            <ExchangeAltIcon className="text-purple-600 text-2xl mr-4" />
            <div>
              <p className="text-gray-500">Active Positions</p>
              <p className="text-2xl font-bold">7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 transition-all hover:shadow-lg">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 md:mb-0">Performance</h3>
          <div className="flex flex-wrap gap-2">
            {['1D', '1W', '1M', '3M', 'YTD', '1Y'].map((option) => (
              <button
                key={option}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  timeframe === option
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setTimeframe(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72 w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Portfolios and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portfolios Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Your Portfolios</h2>
          {portfolios.length === 0 ? (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-blue-700">You don't have any portfolios yet. Create one in the "Create Portfolio" section.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolios.map(portfolio => (
                <div key={portfolio.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{portfolio.name}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance</span>
                        <span className="font-medium">{portfolio.balance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Performance</span>
                        <span className={`font-medium ${portfolio.performance.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolio.performance}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assets</span>
                        <span className="font-medium">{portfolio.assets}</span>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-2">
                      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      <button className="bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                        Rebalance
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Create New Portfolio Card */}
              <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-blue-600 text-2xl">+</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create New Portfolio</h3>
                  <p className="text-gray-500 mb-4">Build a customized portfolio based on your risk profile</p>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Recent Transactions */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>
            <div className="bg-white rounded-xl shadow-md">
              {transactions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No transactions found
                </div>
              ) : (
                <div className="divide-y">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between mb-1">
                        <span className={`font-medium ${
                          tx.type === 'Buy' ? 'text-green-600' : 
                          tx.type === 'Sell' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {tx.type}
                        </span>
                        <span className="text-gray-500 text-sm">{tx.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{tx.asset}</span>
                        <span>{tx.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="p-4 border-t">
                <button className="w-full text-blue-600 text-center py-2 hover:text-blue-800">
                  View All Transactions
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center justify-between w-full bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="font-medium text-blue-700">Deposit Funds</span>
                  <span className="text-lg">→</span>
                </button>
                <button className="flex items-center justify-between w-full bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="font-medium text-green-700">Create New Portfolio</span>
                  <span className="text-lg">→</span>
                </button>
                <button className="flex items-center justify-between w-full bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors">
                  <span className="font-medium text-purple-700">View Risk Assessment</span>
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;