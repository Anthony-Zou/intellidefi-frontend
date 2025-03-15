import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define types
type Asset = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  image: string;
};

type PortfolioSettings = {
  name: string;
  initialInvestment: number;
  riskLevel: 'low' | 'medium' | 'high' | 'custom';
  rebalancingFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  targetReturn: number;
  maxDrawdown: number;
};

type AssetAllocation = {
  assetId: string;
  percentage: number;
};

const PortfolioCreation = () => {
  const { isConnected, connectWallet } = useWeb3();
  const [currentStep, setCurrentStep] = useState(1);
  const [settings, setSettings] = useState<PortfolioSettings>({
    name: '',
    initialInvestment: 1000,
    riskLevel: 'medium',
    rebalancingFrequency: 'monthly',
    targetReturn: 10,
    maxDrawdown: 20,
  });
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<AssetAllocation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Load available assets
  useEffect(() => {
    // Simulated assets data
    const mockAssets: Asset[] = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 66724.12, change24h: 2.3, marketCap: 1312047928374, volume: 35729483927, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3422.87, change24h: 1.5, marketCap: 411237483924, volume: 15729483922, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
      { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1.00, change24h: 0.1, marketCap: 92837483924, volume: 75729483922, image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
      { id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.05, marketCap: 32837483924, volume: 25729483922, image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png' },
      { id: 'bnb', symbol: 'BNB', name: 'BNB', price: 563.27, change24h: -1.2, marketCap: 86437483924, volume: 5729483922, image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
      { id: 'solana', symbol: 'SOL', name: 'Solana', price: 182.34, change24h: 3.7, marketCap: 77837483924, volume: 6729483922, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
      { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.46, change24h: -0.8, marketCap: 16437483924, volume: 1729483922, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
      { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', price: 36.29, change24h: 1.9, marketCap: 13237483924, volume: 1529483922, image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },
      { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7.42, change24h: -0.5, marketCap: 9437483924, volume: 729483922, image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
      { id: 'polygon', symbol: 'MATIC', name: 'Polygon', price: 0.61, change24h: 2.1, marketCap: 5837483924, volume: 529483922, image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png' },
    ];
    
    setAvailableAssets(mockAssets);
    
    // Initialize with default allocations for the selected risk level
    setSelectedAssetsBasedOnRisk('medium');
  }, []);

  // Set selectedAssets based on risk level
  const setSelectedAssetsBasedOnRisk = (riskLevel: 'low' | 'medium' | 'high' | 'custom') => {
    if (riskLevel === 'custom') {
      return; // Leave current allocations for custom
    }
    
    let defaultAllocations: AssetAllocation[] = [];
    
    if (riskLevel === 'low') {
      defaultAllocations = [
        { assetId: 'tether', percentage: 50 },
        { assetId: 'usdc', percentage: 20 },
        { assetId: 'bitcoin', percentage: 20 },
        { assetId: 'ethereum', percentage: 10 },
      ];
    } else if (riskLevel === 'medium') {
      defaultAllocations = [
        { assetId: 'tether', percentage: 30 },
        { assetId: 'bitcoin', percentage: 30 },
        { assetId: 'ethereum', percentage: 25 },
        { assetId: 'solana', percentage: 15 },
      ];
    } else if (riskLevel === 'high') {
      defaultAllocations = [
        { assetId: 'bitcoin', percentage: 30 },
        { assetId: 'ethereum', percentage: 30 },
        { assetId: 'solana', percentage: 20 },
        { assetId: 'polygon', percentage: 10 },
        { assetId: 'avalanche', percentage: 10 },
      ];
    }
    
    setSelectedAssets(defaultAllocations);
  };

  // Handle form updates for settings
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'riskLevel' && (value === 'low' || value === 'medium' || value === 'high')) {
      setSelectedAssetsBasedOnRisk(value as 'low' | 'medium' | 'high' | 'custom');
    }
    
    setSettings({
      ...settings,
      [name]: name === 'initialInvestment' || name === 'targetReturn' || name === 'maxDrawdown' 
        ? parseFloat(value) 
        : value
    });
  };

  // Handle asset selection
  const handleAssetSelect = (assetId: string) => {
    const isAlreadySelected = selectedAssets.some(item => item.assetId === assetId);
    
    if (isAlreadySelected) {
      setSelectedAssets(selectedAssets.filter(item => item.assetId !== assetId));
    } else {
      // When adding a new asset, give it an equal weight with others
      const totalAssets = selectedAssets.length + 1;
      const newPercentage = Math.floor(100 / totalAssets);
      
      const updatedAssets = selectedAssets.map(asset => ({
        ...asset,
        percentage: newPercentage
      }));
      
      setSelectedAssets([...updatedAssets, { assetId, percentage: newPercentage }]);
    }
    
    // Set risk level to custom when manually selecting assets
    setSettings({
      ...settings,
      riskLevel: 'custom'
    });
  };

  // Handle allocation percentage change
  const handleAllocationChange = (assetId: string, newPercentage: number) => {
    // Make sure percentage is between 0 and 100
    const percentage = Math.max(0, Math.min(100, newPercentage));
    
    setSelectedAssets(selectedAssets.map(asset => 
      asset.assetId === assetId ? { ...asset, percentage } : asset
    ));
  };

  // Calculate total allocation percentage
  const totalAllocation = selectedAssets.reduce((sum, asset) => sum + asset.percentage, 0);

  // Validate form before advancing to next step
  const validateStep = () => {
    const errors: {[key: string]: string} = {};
    
    if (currentStep === 1) {
      if (!settings.name.trim()) {
        errors.name = 'Portfolio name is required';
      }
      
      if (settings.initialInvestment <= 0) {
        errors.initialInvestment = 'Initial investment must be greater than 0';
      }
    }
    
    if (currentStep === 2) {
      if (selectedAssets.length === 0) {
        errors.assets = 'Please select at least one asset';
      }
      
      if (totalAllocation !== 100) {
        errors.allocation = `Total allocation must equal 100% (currently ${totalAllocation}%)`;
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigate between steps
  const goToNextStep = () => {
    if (validateStep()) {
      if (currentStep === 2) {
        generatePortfolioPreview();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Generate portfolio preview
  const generatePortfolioPreview = () => {
    setLoading(true);
    
    // Simulate API call for portfolio projection
    setTimeout(() => {
      // Historical performance simulation
      const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Generate data based on risk level
      let volatilityFactor = 1;
      if (settings.riskLevel === 'low') volatilityFactor = 0.5;
      if (settings.riskLevel === 'high') volatilityFactor = 2;
      
      const projected = labels.map((_, index) => {
        const randomFactor = 1 + ((Math.random() - 0.5) * 0.1 * volatilityFactor);
        return settings.initialInvestment * Math.pow(1 + (settings.targetReturn / 100 / 12), index) * randomFactor;
      });
      
      const benchmark = labels.map((_, index) => {
        return settings.initialInvestment * Math.pow(1.07, index / 12);
      });
      
      // Risk metrics based on risk level
      const riskMetrics = {
        sharpeRatio: settings.riskLevel === 'low' ? 1.2 : settings.riskLevel === 'medium' ? 1.8 : 2.4,
        volatility: settings.riskLevel === 'low' ? 5 : settings.riskLevel === 'medium' ? 12 : 25,
        maxDrawdown: settings.riskLevel === 'low' ? 8 : settings.riskLevel === 'medium' ? 15 : 30,
        expectedReturn: settings.targetReturn,
      };
      
      setPreviewData({
        performance: {
          labels,
          datasets: [
            {
              label: 'Projected Portfolio Value',
              data: projected,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Market Benchmark',
              data: benchmark,
              borderColor: 'rgb(156, 163, 175)',
              backgroundColor: 'rgba(156, 163, 175, 0.1)',
              fill: false,
              borderDash: [5, 5],
              tension: 0.4,
            }
          ]
        },
        allocation: {
          labels: selectedAssets.map(item => {
            const asset = availableAssets.find(a => a.id === item.assetId);
            return asset ? asset.name : item.assetId;
          }),
          datasets: [
            {
              label: 'Allocation',
              data: selectedAssets.map(item => item.percentage),
              backgroundColor: [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(251, 191, 36)',
                'rgb(239, 68, 68)',
                'rgb(139, 92, 246)',
                'rgb(236, 72, 153)',
                'rgb(245, 158, 11)',
                'rgb(6, 182, 212)',
                'rgb(248, 113, 113)',
                'rgb(124, 58, 237)',
              ],
              borderWidth: 1,
            },
          ],
        },
        riskMetrics,
        initialInvestment: settings.initialInvestment,
        projectedEndValue: projected[projected.length - 1],
      });
      
      setCurrentStep(3);
      setLoading(false);
    }, 1500);
  };

  // Create Portfolio
  const createPortfolio = () => {
    setLoading(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      alert('Portfolio created successfully!');
      // Redirect to portfolio dashboard or another page
      window.location.href = '/';
    }, 2000);
  };

  // Filter assets based on search term
  const filteredAssets = availableAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get asset by ID
  const getAssetById = (id: string) => availableAssets.find(asset => asset.id === id);

  // Display if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Portfolio</h2>
          <p className="text-gray-600 mb-6">Connect your wallet to create a customized portfolio.</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Your Portfolio</h1>
        
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <div className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Portfolio Settings
            </div>
            <div className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Asset Selection
            </div>
            <div className={currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
              Review & Create
            </div>
          </div>
        </div>
        
        {/* Step 1: Portfolio Settings */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6">Portfolio Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Portfolio Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={settings.name}
                    onChange={handleSettingsChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="My Portfolio"
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Initial Investment (USDT)
                  </label>
                  <input
                    type="number"
                    name="initialInvestment"
                    value={settings.initialInvestment}
                    onChange={handleSettingsChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      validationErrors.initialInvestment ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    min="0"
                    step="100"
                  />
                  {validationErrors.initialInvestment && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.initialInvestment}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Rebalancing Frequency
                  </label>
                  <select
                    name="rebalancingFrequency"
                    value={settings.rebalancingFrequency}
                    onChange={handleSettingsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Risk Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['low', 'medium', 'high'].map((risk) => (
                      <label 
                        key={risk}
                        className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
                          settings.riskLevel === risk 
                            ? 'bg-blue-100 border-blue-500 text-blue-700' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        } cursor-pointer transition-colors`}
                      >
                        <input
                          type="radio"
                          name="riskLevel"
                          value={risk}
                          checked={settings.riskLevel === risk}
                          onChange={handleSettingsChange}
                          className="sr-only"
                        />
                        <span className="capitalize">{risk}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {settings.riskLevel === 'low' && 'Conservative strategy with lower risk and returns.'}
                    {settings.riskLevel === 'medium' && 'Balanced approach with moderate risk and returns.'}
                    {settings.riskLevel === 'high' && 'Aggressive strategy with higher risk and potential returns.'}
                    {settings.riskLevel === 'custom' && 'Custom asset allocation based on your preferences.'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Target Annual Return (%)
                  </label>
                  <input
                    type="number"
                    name="targetReturn"
                    value={settings.targetReturn}
                    onChange={handleSettingsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Maximum Drawdown (%)
                  </label>
                  <input
                    type="number"
                    name="maxDrawdown"
                    value={settings.maxDrawdown}
                    onChange={handleSettingsChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    step="1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum loss you're willing to accept from peak to trough.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Asset Selection */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-semibold mb-4">Asset Selection</h2>
              <p className="text-gray-600 mb-4">
                Select assets to include in your portfolio and adjust allocation percentages.
                {settings.riskLevel !== 'custom' && ` We've pre-selected assets based on your ${settings.riskLevel} risk profile.`}
              </p>
              
              {validationErrors.assets && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                  {validationErrors.assets}
                </div>
              )}
              
              {validationErrors.allocation && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                  {validationErrors.allocation}
                </div>
              )}
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Available Assets */}
              <div className="border-r md:col-span-2">
                <div className="p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-700">Available Assets</h3>
                </div>
                <div className="h-96 overflow-y-auto p-2">
                  {filteredAssets.length === 0 ? (
                    <p className="text-center p-4 text-gray-500">No assets found matching "{searchTerm}"</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredAssets.map((asset) => {
                        const isSelected = selectedAssets.some(item => item.assetId === asset.id);
                        return (
                          <div 
                            key={asset.id}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' 
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => handleAssetSelect(asset.id)}
                          >
                            <div className="w-8 h-8 mr-3 flex-shrink-0">
                              <img 
                                src={asset.image} 
                                alt={asset.name} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">{asset.symbol}</div>
                                <div className={`text-sm ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                                </div>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <div className="text-gray-500">{asset.name}</div>
                                <div>${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Selected Assets & Allocation */}
              <div>
                <div className="p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-700">Portfolio Allocation</h3>
                  <div className={`text-sm mt-1 ${totalAllocation === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    Total: {totalAllocation}% {totalAllocation === 100 ? '✓' : '(should be 100%)'}
                  </div>
                </div>
                
                <div className="p-4">
                  {selectedAssets.length === 0 ? (
                    <p className="text-center text-gray-500">No assets selected</p>
                  ) : (
                    <div className="space-y-4">
                      {selectedAssets.map((allocation) => {
                        const asset = getAssetById(allocation.assetId);
                        if (!asset) return null;
                        
                        return (
                          <div key={allocation.assetId} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-6 h-6 mr-2 flex-shrink-0">
                                  <img 
                                    src={asset.image} 
                                    alt={asset.name} 
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="font-medium">{asset.symbol}</div>
                              </div>
                              <button 
                                onClick={() => handleAssetSelect(allocation.assetId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={allocation.percentage}
                                onChange={(e) => handleAllocationChange(allocation.assetId, parseInt(e.target.value))}
                                className="flex-grow mr-2"
                              />
                              <div className="w-16">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={allocation.percentage}
                                  onChange={(e) => handleAllocationChange(allocation.assetId, parseInt(e.target.value))}
                                  className="w-full px-2 py-1 text-center border border-gray-300 rounded"
                                />
                              </div>
                              <div className="w-8 text-center">%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Review & Create */}
        {currentStep === 3 && previewData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Portfolio Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Portfolio Preview</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500">Initial Investment</div>
                    <div className="text-2xl font-bold">${settings.initialInvestment.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500">Projected End Value</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${Math.round(previewData.projectedEndValue).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Projected Performance</h3>
                  <div className="h-72 w-full">
                    <Line 
                      data={previewData.performance}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                          },
                          tooltip: {
                            mode: 'index' as const,
                            intersect: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            ticks: {
                              callback: function(value) {
                                return '$' + value.toLocaleString();
                              }
                            }
                          }
                        },
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Portfolio Allocation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64">
                      <Pie 
                        data={previewData.allocation}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'right' as const,
                            }
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Asset</th>
                            <th className="text-right py-2">Allocation</th>
                            <th className="text-right py-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAssets.map((allocation) => {
                            const asset = getAssetById(allocation.assetId);
                            if (!asset) return null;
                            const amount = (settings.initialInvestment * allocation.percentage / 100).toFixed(2);
                            
                            return (
                              <tr key={allocation.assetId} className="border-b">
                                <td className="py-2 flex items-center">
                                  <div className="w-5 h-5 mr-2">
                                    <img 
                                      src={asset.image} 
                                      alt={asset.name} 
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  {asset.symbol}
                                </td>
                                <td className="text-right py-2">{allocation.percentage}%</td>
                                <td className="text-right py-2">${amount}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Risk Metrics & Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Risk Metrics</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-gray-600">Expected Annual Return</div>
                      <div className="font-medium text-green-600">{previewData.riskMetrics.expectedReturn}%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(previewData.riskMetrics.expectedReturn, 30)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-gray-600">Volatility</div>
                      <div className="font-medium">{previewData.riskMetrics.volatility}%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(previewData.riskMetrics.volatility, 30)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-gray-600">Max Drawdown</div>
                      <div className="font-medium text-red-600">{previewData.riskMetrics.maxDrawdown}%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(previewData.riskMetrics.maxDrawdown, 30)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-gray-600">Sharpe Ratio</div>
                      <div className="font-medium">{previewData.riskMetrics.sharpeRatio.toFixed(2)}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(previewData.riskMetrics.sharpeRatio * 25, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-lg mb-4">Portfolio Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Portfolio Name</span>
                    <span className="font-medium">{settings.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level</span>
                    <span className="font-medium capitalize">{settings.riskLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assets</span>
                    <span className="font-medium">{selectedAssets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rebalancing</span>
                    <span className="font-medium capitalize">{settings.rebalancingFrequency}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
                  <div className="text-sm text-blue-800">
                    <p className="mb-2">
                      <strong>Note:</strong> Past performance is not indicative of future results.
                    </p>
                    <p>
                      This portfolio will be automatically rebalanced on a {settings.rebalancingFrequency} 
                      basis to maintain the target allocation.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={createPortfolio}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Creating Portfolio...' : 'Create Portfolio'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {currentStep > 1 ? (
            <button
              onClick={goToPreviousStep}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < 3 && (
            <button
              onClick={goToNextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === 2 ? 'Generate Preview' : 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCreation;