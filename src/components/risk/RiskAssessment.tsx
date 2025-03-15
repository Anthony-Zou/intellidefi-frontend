import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale
);

// Define risk levels
const RISK_LEVELS = {
  LOW: 'Low Risk',
  MEDIUM: 'Medium Risk',
  HIGH: 'High Risk'
};

// Define question types
type QuestionType = {
  id: number;
  text: string;
  options: {
    text: string;
    score: number;
  }[];
};

// Define risk profile type
type RiskProfileType = {
  riskScore: number;
  riskLevel: string;
  description: string;
  recommendation: string;
  portfolioAllocation: {
    name: string;
    percentage: number;
    color: string;
  }[];
  riskMetrics: {
    factor: string;
    score: number;
    maxScore: number;
  }[];
};

const RiskAssessment = () => {
  const { isConnected, connectWallet } = useWeb3();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [riskProfile, setRiskProfile] = useState<RiskProfileType | null>(null);
  const [loading, setLoading] = useState(false);

  // Questions for risk assessment
  const questions: QuestionType[] = [
    {
      id: 1,
      text: "What is your primary goal for investing in cryptocurrencies?",
      options: [
        { text: "Capital preservation - I want to maintain the value of my investment with minimal risk", score: 1 },
        { text: "Income generation - I want steady returns with moderate growth", score: 2 },
        { text: "Balanced growth - I want a mix of growth and income", score: 3 },
        { text: "Capital appreciation - I want my investment to grow significantly over time", score: 4 },
        { text: "Aggressive growth - I want maximum growth potential", score: 5 }
      ]
    },
    {
      id: 2,
      text: "How long do you plan to keep your money invested?",
      options: [
        { text: "Less than 1 year", score: 1 },
        { text: "1-2 years", score: 2 },
        { text: "3-5 years", score: 3 },
        { text: "5-10 years", score: 4 },
        { text: "More than 10 years", score: 5 }
      ]
    },
    {
      id: 3,
      text: "If your cryptocurrency investment dropped 20% in value over a short period, what would you do?",
      options: [
        { text: "Sell all my investment to prevent further losses", score: 1 },
        { text: "Sell a portion of my investment", score: 2 },
        { text: "Hold my investment and wait to recover", score: 3 },
        { text: "Buy more if I have additional funds available", score: 4 },
        { text: "Significantly increase my position to take advantage of lower prices", score: 5 }
      ]
    },
    {
      id: 4,
      text: "What percentage of your total investable assets are you planning to allocate to cryptocurrencies?",
      options: [
        { text: "Less than 5%", score: 1 },
        { text: "5-10%", score: 2 },
        { text: "10-20%", score: 3 },
        { text: "20-30%", score: 4 },
        { text: "More than 30%", score: 5 }
      ]
    },
    {
      id: 5,
      text: "How experienced are you with cryptocurrency investments?",
      options: [
        { text: "No experience", score: 1 },
        { text: "Limited experience (just started learning)", score: 2 },
        { text: "Some experience (made a few investments)", score: 3 },
        { text: "Experienced (regularly invest in cryptocurrencies)", score: 4 },
        { text: "Very experienced (active trader or professional in the field)", score: 5 }
      ]
    },
    {
      id: 6,
      text: "Which statement best describes your attitude towards cryptocurrency volatility?",
      options: [
        { text: "I'm very uncomfortable with volatility and prefer stability", score: 1 },
        { text: "I can tolerate some volatility but it concerns me", score: 2 },
        { text: "I understand volatility is normal in crypto markets", score: 3 },
        { text: "I'm comfortable with volatility and see it as an opportunity", score: 4 },
        { text: "I actively seek highly volatile assets for maximum returns", score: 5 }
      ]
    },
    {
      id: 7,
      text: "How important is liquidity to you?",
      options: [
        { text: "Extremely important - I need to be able to access my funds immediately", score: 1 },
        { text: "Very important - I prefer assets I can quickly convert to cash", score: 2 },
        { text: "Moderately important - Some of my investments can be less liquid", score: 3 },
        { text: "Somewhat important - I can lock up most investments for higher returns", score: 4 },
        { text: "Not important - I'm willing to lock up funds long-term for maximum growth", score: 5 }
      ]
    },
  ];

  // Calculate risk profile based on answers
  const calculateRiskProfile = (scores: number[]) => {
    setLoading(true);
    
    // Calculate total score
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = questions.length * 5;
    const scorePercentage = (totalScore / maxPossibleScore) * 100;
    
    // Determine risk level
    let riskLevel = RISK_LEVELS.LOW;
    let description = '';
    let recommendation = '';
    let portfolioAllocation = [];
    
    if (scorePercentage < 40) {
      riskLevel = RISK_LEVELS.LOW;
      description = "You have a conservative approach to investing. Capital preservation is important to you, and you prefer stability over high returns.";
      recommendation = "A low-risk portfolio focused on stablecoins and established cryptocurrencies like Bitcoin and Ethereum with automated yield farming for consistent returns.";
      portfolioAllocation = [
        { name: "Stablecoins (USDT, USDC)", percentage: 70, color: "#4CAF50" },
        { name: "Bitcoin (BTC)", percentage: 20, color: "#FFA726" },
        { name: "Ethereum (ETH)", percentage: 10, color: "#42A5F5" }
      ];
    } else if (scorePercentage < 70) {
      riskLevel = RISK_LEVELS.MEDIUM;
      description = "You have a balanced approach to risk. You're willing to accept some volatility for growth potential, but still value stability.";
      recommendation = "A medium-risk portfolio with a mix of stablecoins and established cryptocurrencies, plus some exposure to altcoins for growth.";
      portfolioAllocation = [
        { name: "Stablecoins (USDT, USDC)", percentage: 40, color: "#4CAF50" },
        { name: "Bitcoin (BTC)", percentage: 25, color: "#FFA726" },
        { name: "Ethereum (ETH)", percentage: 20, color: "#42A5F5" },
        { name: "Large Cap Altcoins", percentage: 15, color: "#AB47BC" }
      ];
    } else {
      riskLevel = RISK_LEVELS.HIGH;
      description = "You have an aggressive approach to investing. You're comfortable with significant volatility and prioritize growth potential.";
      recommendation = "A high-risk, high-reward portfolio with significant exposure to altcoins and emerging cryptocurrencies for maximum growth potential.";
      portfolioAllocation = [
        { name: "Stablecoins (USDT, USDC)", percentage: 10, color: "#4CAF50" },
        { name: "Bitcoin (BTC)", percentage: 20, color: "#FFA726" },
        { name: "Ethereum (ETH)", percentage: 25, color: "#42A5F5" },
        { name: "Large Cap Altcoins", percentage: 30, color: "#AB47BC" },
        { name: "Small Cap Altcoins", percentage: 15, color: "#EF5350" }
      ];
    }

    // Calculate individual risk factors
    const riskMetrics = [
      { factor: "Investment Horizon", score: scores[1], maxScore: 5 },
      { factor: "Market Volatility Tolerance", score: scores[2], maxScore: 5 },
      { factor: "Crypto Allocation", score: scores[3], maxScore: 5 },
      { factor: "Experience Level", score: scores[4], maxScore: 5 },
      { factor: "Volatility Attitude", score: scores[5], maxScore: 5 },
      { factor: "Liquidity Needs", score: scores[6], maxScore: 5 },
    ];
    
    // Set risk profile
    setRiskProfile({
      riskScore: Math.round(scorePercentage),
      riskLevel,
      description,
      recommendation,
      portfolioAllocation,
      riskMetrics
    });
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  // Handle answer selection
  const handleAnswerSelect = (optionScore: number) => {
    const newAnswers = [...answers, optionScore];
    setAnswers(newAnswers);
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateRiskProfile(newAnswers);
      setCurrentStep(questions.length); // Move to results page
    }
  };

  // Reset assessment
  const resetAssessment = () => {
    setCurrentStep(0);
    setAnswers([]);
    setRiskProfile(null);
  };

  // Create portfolio
  const createPortfolio = () => {
    // This would connect to your smart contract
    alert(`Creating a ${riskProfile?.riskLevel} portfolio`);
    // Navigation would happen here
  };

  // Prepare chart data for doughnut chart
  const doughnutData = {
    labels: riskProfile?.portfolioAllocation.map(item => item.name) || [],
    datasets: [
      {
        data: riskProfile?.portfolioAllocation.map(item => item.percentage) || [],
        backgroundColor: riskProfile?.portfolioAllocation.map(item => item.color) || [],
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for radar chart
  const radarData = {
    labels: riskProfile?.riskMetrics.map(metric => metric.factor) || [],
    datasets: [
      {
        label: 'Your Risk Profile',
        data: riskProfile?.riskMetrics.map(metric => metric.score) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Display if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Risk Assessment</h2>
          <p className="text-gray-600 mb-6">Connect your wallet to access the risk assessment tool.</p>
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Risk Assessment</h1>
        
        {/* Progress indicator */}
        {currentStep < questions.length && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round((currentStep / questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(currentStep / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Questions */}
        {currentStep < questions.length && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">{questions[currentStep].text}</h2>
            <div className="space-y-3">
              {questions[currentStep].options.map((option, index) => (
                <button
                  key={index}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  onClick={() => handleAnswerSelect(option.score)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {currentStep === questions.length && loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg text-gray-600">Analyzing your risk profile...</p>
          </div>
        )}
        
        {/* Results */}
        {currentStep === questions.length && !loading && riskProfile && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`py-4 px-6 text-white ${
              riskProfile.riskLevel === RISK_LEVELS.LOW ? 'bg-green-600' :
              riskProfile.riskLevel === RISK_LEVELS.MEDIUM ? 'bg-yellow-600' :
              'bg-red-600'
            }`}>
              <h2 className="text-2xl font-bold">Your Risk Profile: {riskProfile.riskLevel}</h2>
              <p className="text-sm opacity-90">Risk Score: {riskProfile.riskScore}/100</p>
            </div>
            
            <div className="p-6">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Risk Profile Description</h3>
                <p className="text-gray-700">{riskProfile.description}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Portfolio Recommendation</h3>
                <p className="text-gray-700 mb-4">{riskProfile.recommendation}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-medium mb-3">Recommended Allocation</h4>
                    <div className="h-64">
                      <Doughnut 
                        data={doughnutData} 
                        options={{
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-3">Risk Factor Breakdown</h4>
                    <div className="h-64">
                      <Radar data={radarData} options={radarOptions} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={resetAssessment}
                  className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Retake Assessment
                </button>
                <button 
                  onClick={createPortfolio}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create This Portfolio
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Information about the assessment */}
        {currentStep === 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mt-8">
            <p className="text-blue-700">This assessment helps us understand your investment goals and risk tolerance to recommend the most suitable portfolio for you. Your answers will be used to create a personalized investment strategy.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAssessment;