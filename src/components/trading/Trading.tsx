import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define Asset type
type Asset = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  imageUrl: string;
};

// Define Order type
type Order = {
  id: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  assetSymbol: string;
  amount: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'canceled';
  date: string;
};

const Trading = () => {
  // Remove 'account' from destructuring since it's not used
  const { isConnected, connectWallet } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [timeframe, setTimeframe] = useState('1D');
  const [balances, setBalances] = useState<{[key: string]: number}>({
    'USDT': 10000,
    'BTC': 0.5,
    'ETH': 5.2,
    'SOL': 20,
  });

  // Fix TypeScript error by properly typing the chart data
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Price (USD)',
        data: [] as number[],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  });

  // Chart options
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
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `$${value.toLocaleString()}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  // Load initial data
  useEffect(() => {
    if (isConnected) {
      setLoading(true);
      
      // Simulate API call for assets
      setTimeout(() => {
        const mockAssets: Asset[] = [
          {
            id: 'bitcoin',
            symbol: 'BTC',
            name: 'Bitcoin',
            price: 66724.12,
            change24h: 2.3,
            imageUrl: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          },
          {
            id: 'ethereum',
            symbol: 'ETH',
            name: 'Ethereum',
            price: 3422.87,
            change24h: 1.5,
            imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          },
          {
            id: 'solana',
            symbol: 'SOL',
            name: 'Solana',
            price: 182.34,
            change24h: 3.7,
            imageUrl: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
          },
        ];
        
        setAssets(mockAssets);
        setSelectedAsset(mockAssets[0]);
        setPrice(mockAssets[0].price.toString());

        // Generate mock orders
        generateMockOrders();
        
        // Generate chart data
        generateChartData();
        
        setLoading(false);
      }, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  // Update chart when asset or timeframe changes
  useEffect(() => {
    if (selectedAsset) {
      generateChartData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset, timeframe, tradeType]); // Added tradeType as dependency since it affects chart colors

  // Generate mock orders
  const generateMockOrders = () => {
    // Active orders
    const mockActiveOrders: Order[] = [
      {
        id: '1',
        type: 'limit',
        side: 'buy',
        assetSymbol: 'BTC',
        amount: 0.1,
        price: 65000,
        total: 6500,
        status: 'pending',
        date: '2023-05-01'
      },
      {
        id: '2',
        type: 'limit',
        side: 'sell',
        assetSymbol: 'ETH',
        amount: 2,
        price: 3500,
        total: 7000,
        status: 'pending',
        date: '2023-05-02'
      }
    ];
    
    // Order history
    const mockOrderHistory: Order[] = [
      {
        id: '3',
        type: 'market',
        side: 'buy',
        assetSymbol: 'BTC',
        amount: 0.2,
        price: 64000,
        total: 12800,
        status: 'completed',
        date: '2023-04-28'
      },
      {
        id: '4',
        type: 'market',
        side: 'sell',
        assetSymbol: 'SOL',
        amount: 10,
        price: 180,
        total: 1800,
        status: 'completed',
        date: '2023-04-26'
      },
      {
        id: '5',
        type: 'limit',
        side: 'buy',
        assetSymbol: 'ETH',
        amount: 1.5,
        price: 3300,
        total: 4950,
        status: 'completed',
        date: '2023-04-25'
      }
    ];
    
    setActiveOrders(mockActiveOrders);
    setOrderHistory(mockOrderHistory);
  };

  // Generate chart data
  const generateChartData = () => {
    if (!selectedAsset) return;
    
    const basePrice = selectedAsset.price;
    const volatility = basePrice * 0.05;
    
    let dataPoints = 24;
    let labelFormat = '';
    
    if (timeframe === '1D') {
      dataPoints = 24;
      labelFormat = 'hour';
    } else if (timeframe === '1W') {
      dataPoints = 7;
      labelFormat = 'day';
    } else if (timeframe === '1M') {
      dataPoints = 30;
      labelFormat = 'day';
    }
    
    const labels: string[] = Array.from({ length: dataPoints }).map((_, i) => {
      if (labelFormat === 'hour') return `${i}:00`;
      if (labelFormat === 'day') return `Day ${i+1}`;
      return `Point ${i+1}`;
    });
    
    const data: number[] = Array.from({ length: dataPoints }).map((_, i) => {
      // Create some trend in the data
      const trend = Math.sin(i / (dataPoints / 3)) * volatility;
      // Add some randomness
      const random = (Math.random() - 0.5) * volatility;
      return basePrice + trend + random;
    });
    
    setChartData({
      labels,
      datasets: [
        {
          ...chartData.datasets[0],
          data,
          borderColor: tradeType === 'buy' ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
          backgroundColor: tradeType === 'buy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        }
      ]
    });
  };

  // Handle asset change
  const handleAssetChange = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      setPrice(asset.price.toString());
    }
  };

  // Handle order placement
  const handlePlaceOrder = () => {
    if (!selectedAsset || !amount) return;
    
    const parsedAmount = parseFloat(amount);
    const parsedPrice = orderType === 'market' ? selectedAsset.price : parseFloat(price);
    const total = parsedAmount * parsedPrice;
    
    // Check if user has enough balance
    if (tradeType === 'buy') {
      if (balances['USDT'] < total) {
        alert('Insufficient USDT balance');
        return;
      }
    } else {
      if ((balances[selectedAsset.symbol] || 0) < parsedAmount) {
        alert(`Insufficient ${selectedAsset.symbol} balance`);
        return;
      }
    }
    
    // Update balances for market orders
    if (orderType === 'market') {
      const newBalances = { ...balances };
      
      if (tradeType === 'buy') {
        newBalances['USDT'] -= total;
        newBalances[selectedAsset.symbol] = (newBalances[selectedAsset.symbol] || 0) + parsedAmount;
      } else {
        newBalances[selectedAsset.symbol] -= parsedAmount;
        newBalances['USDT'] += total;
      }
      
      setBalances(newBalances);
      
      // Add to history
      const newOrder: Order = {
        id: Date.now().toString(),
        type: 'market',
        side: tradeType,
        assetSymbol: selectedAsset.symbol,
        amount: parsedAmount,
        price: parsedPrice,
        total,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
      };
      
      setOrderHistory([newOrder, ...orderHistory]);
      alert(`${tradeType.toUpperCase()} order executed successfully!`);
    } else {
      // Add limit order to active orders
      const newOrder: Order = {
        id: Date.now().toString(),
        type: 'limit',
        side: tradeType,
        assetSymbol: selectedAsset.symbol,
        amount: parsedAmount,
        price: parsedPrice,
        total,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      };
      
      setActiveOrders([newOrder, ...activeOrders]);
      alert('Limit order placed successfully!');
    }
    
    // Reset form
    setAmount('');
  };

  // Handle order cancellation
  const handleCancelOrder = (orderId: string) => {
    setActiveOrders(activeOrders.filter(order => order.id !== orderId));
    alert('Order canceled successfully');
  };

  // Calculate percentage of balance
  const calculatePercentageAmount = (percentage: number) => {
    if (!selectedAsset) return;
    
    if (tradeType === 'buy') {
      const maxBuyAmount = balances['USDT'] / selectedAsset.price;
      setAmount((maxBuyAmount * percentage / 100).toFixed(8));
    } else {
      const maxSellAmount = balances[selectedAsset.symbol] || 0;
      setAmount((maxSellAmount * percentage / 100).toFixed(8));
    }
  };

  // Format number with proper decimals
  const formatNumber = (num: number, decimals = 2) => {
    if (num < 0.01) return num.toFixed(8);
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Trading Dashboard</h2>
          <p className="text-gray-600 mb-6">Connect your wallet to access the trading interface.</p>
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
      <h1 className="text-3xl font-bold mb-6">Trading Dashboard</h1>
      
      {/* Main trading interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left section: Price chart and asset selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset selector and chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              {/* Asset selector */}
              <div className="flex items-center mb-4 sm:mb-0">
                {selectedAsset && (
                  <div className="flex items-center">
                    <img 
                      src={selectedAsset.imageUrl}
                      alt={selectedAsset.name}
                      className="w-10 h-10 mr-3"
                    />
                    <div>
                      <h2 className="text-xl font-bold">{selectedAsset.name}</h2>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold mr-2">
                          ${formatNumber(selectedAsset.price)}
                        </span>
                        <span className={`text-sm ${
                          selectedAsset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <select
                  value={selectedAsset?.id}
                  onChange={(e) => handleAssetChange(e.target.value)}
                  className="ml-4 bg-gray-100 px-3 py-2 rounded-lg"
                >
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.symbol}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Timeframe selector */}
              <div className="flex space-x-2">
                {['1D', '1W', '1M', '3M', 'ALL'].map((option) => (
                  <button
                    key={option}
                    className={`px-3 py-1 text-sm rounded ${
                      timeframe === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setTimeframe(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price chart */}
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
          
          {/* Active orders */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
            {activeOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active orders</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Asset</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activeOrders.map((order) => (
                      <tr key={order.id}>
                        <td className={`px-4 py-3 ${order.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                          {order.type.toUpperCase()} {order.side.toUpperCase()}
                        </td>
                        <td className="px-4 py-3">{order.assetSymbol}</td>
                        <td className="px-4 py-3">{formatNumber(order.amount, 5)}</td>
                        <td className="px-4 py-3">${formatNumber(order.price)}</td>
                        <td className="px-4 py-3">${formatNumber(order.total)}</td>
                        <td className="px-4 py-3">{order.date}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Order history */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            {orderHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No order history</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Asset</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderHistory.map((order) => (
                      <tr key={order.id}>
                        <td className={`px-4 py-3 ${order.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                          {order.type.toUpperCase()} {order.side.toUpperCase()}
                        </td>
                        <td className="px-4 py-3">{order.assetSymbol}</td>
                        <td className="px-4 py-3">{formatNumber(order.amount, 5)}</td>
                        <td className="px-4 py-3">${formatNumber(order.price)}</td>
                        <td className="px-4 py-3">${formatNumber(order.total)}</td>
                        <td className="px-4 py-3">{order.date}</td>
                        <td className="px-4 py-3 capitalize">{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Right section: Trading form and wallet */}
        <div className="space-y-6">
          {/* Trading form */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex border-b mb-4">
              <button
                className={`pb-2 px-4 text-center ${
                  tradeType === 'buy' 
                    ? 'text-green-600 border-b-2 border-green-600 font-semibold' 
                    : 'text-gray-500'
                }`}
                onClick={() => setTradeType('buy')}
              >
                Buy
              </button>
              <button
                className={`pb-2 px-4 text-center ${
                  tradeType === 'sell' 
                    ? 'text-red-600 border-b-2 border-red-600 font-semibold' 
                    : 'text-gray-500'
                }`}
                onClick={() => setTradeType('sell')}
              >
                Sell
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-gray-600 text-sm">Order Type</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`px-4 py-2 rounded text-center ${
                    orderType === 'market' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setOrderType('market')}
                >
                  Market
                </button>
                <button
                  className={`px-4 py-2 rounded text-center ${
                    orderType === 'limit' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setOrderType('limit')}
                >
                  Limit
                </button>
              </div>
            </div>
            
            {orderType === 'limit' && (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <label className="text-gray-600 text-sm">Price (USDT)</label>
                  <span className="text-gray-500 text-sm">
                    Market: ${formatNumber(selectedAsset?.price || 0)}
                  </span>
                </div>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  step="0.01"
                  min="0"
                />
              </div>
            )}
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label className="text-gray-600 text-sm">
                  Amount ({selectedAsset?.symbol})
                </label>
                <span className="text-gray-500 text-sm">
                  {tradeType === 'buy' 
                    ? `Balance: ${formatNumber(balances['USDT'] || 0)} USDT`
                    : `Balance: ${formatNumber(balances[selectedAsset?.symbol || ''] || 0)} ${selectedAsset?.symbol}`
                  }
                </span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                step="0.00000001"
                min="0"
              />
              
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[25, 50, 75, 100].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => calculatePercentageAmount(percent)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 text-sm rounded"
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 text-sm">Total (USDT)</span>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 font-medium">
                ${formatNumber(
                  parseFloat(amount || '0') * (
                    orderType === 'limit' 
                      ? parseFloat(price || '0') 
                      : (selectedAsset?.price || 0)
                  )
                )}
              </div>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              className={`w-full py-3 px-4 rounded-lg font-medium ${
                tradeType === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset?.symbol}
            </button>
          </div>
          
          {/* Wallet balances */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Wallet</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full mr-3 flex items-center justify-center text-yellow-800 font-bold">$</div>
                  <span>USDT</span>
                </div>
                <span className="font-medium">{formatNumber(balances['USDT'] || 0)}</span>
              </div>
              
              {assets.map(asset => (
                <div key={asset.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={asset.imageUrl} alt={asset.name} className="w-8 h-8 mr-3" />
                    <span>{asset.symbol}</span>
                  </div>
                  <span className="font-medium">{formatNumber(balances[asset.symbol] || 0, 8)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Deposit Funds
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;