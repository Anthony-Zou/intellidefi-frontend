import React, { useState, useRef, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';

// Define message types
type MessageType = 'text' | 'image' | 'chart' | 'code';

// Define message structure
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: MessageType;
  timestamp: Date;
}

// Sample response follow-up interface
interface FollowUp {
  content: string;
  type: string;
}

// Sample response interface
interface SampleResponse {
  trigger: string;
  response: string;
  type: string;
  followUp?: FollowUp;
}

// Sample responses for demo
const sampleResponses: SampleResponse[] = [
  {
    trigger: 'blockchain',
    response: "Blockchain technology is a decentralized, distributed ledger that records transactions across multiple computers. This ensures that the record cannot be altered retroactively without the alteration of all subsequent blocks. The most well-known application is cryptocurrency, but blockchain has many applications beyond that, including smart contracts, supply chain management, voting systems, and more.",
    type: 'text'
  },
  {
    trigger: 'ethereum',
    response: "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform. It's the second-largest cryptocurrency by market capitalization after Bitcoin. Ethereum is transitioning from a proof-of-work to a proof-of-stake consensus algorithm, which should significantly reduce its energy consumption.",
    type: 'text'
  },
  {
    trigger: 'nft',
    response: "NFTs or Non-Fungible Tokens are unique digital assets that represent ownership of a specific item or piece of content on the blockchain. Unlike cryptocurrencies such as Bitcoin, each NFT has a distinct value and cannot be exchanged on a one-to-one basis. NFTs have gained popularity in digital art, collectibles, gaming, and more.",
    type: 'text'
  },
  {
    trigger: 'chart',
    response: "https://www.coingecko.com/chart/bitcoin/usd/large.svg",
    type: 'image'
  },
  {
    trigger: 'price',
    response: "Here's a visualization of Bitcoin's price over the past year:",
    type: 'text',
    followUp: {
      content: "https://s3.coinmarketcap.com/generated/sparklines/web/365d/2781/1.svg",
      type: 'image'
    }
  },
  {
    trigger: 'code',
    response: `
// Smart contract example: Simple ERC-20 Token
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply);
    }
}`,
    type: 'code'
  },
  {
    trigger: 'defi',
    response: "DeFi (Decentralized Finance) refers to financial services built on blockchain technologies, primarily using smart contracts on blockchains like Ethereum. DeFi platforms allow people to lend or borrow funds, trade cryptocurrencies, get insurance, and earn interest in a decentralized manner without a central financial intermediary.",
    type: 'text'
  },
  {
    trigger: 'smart contract',
    response: "Smart contracts are self-executing contracts with the terms directly written into code. They automatically execute actions when predetermined conditions are met. Smart contracts run on blockchains, making them transparent, traceable, and irreversible. They're commonly used in DeFi applications, NFT marketplaces, and decentralized applications (dApps).",
    type: 'text'
  }
];

const ElizaChat: React.FC = () => {
  const { isConnected, connectWallet } = useWeb3();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Eliza, a blockchain multimodal AI assistant. I can help you with information about blockchain technology, cryptocurrencies, DeFi, NFTs, and more. I can also show charts, images, and code examples. How can I assist you today?",
      type: 'text',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Find sample response based on input
  const findSampleResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    return sampleResponses.find(
      response => lowerInput.includes(response.trigger)
    );
  };

  // Generate a demo response to user input
  const generateResponse = async (userMessage: Message) => {
    setIsLoading(true);
    
    // Add a delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find a matching sample response or use a default
    const sampleResponse = findSampleResponse(userMessage.content);
    let responseMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: sampleResponse 
        ? sampleResponse.response
        : "I don't have specific information about that topic yet. As a demo, I can respond to keywords like 'blockchain', 'ethereum', 'nft', 'defi', 'price', 'chart', 'code', and 'smart contract'.",
      type: sampleResponse ? sampleResponse.type as MessageType : 'text',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, responseMessage]);

    // If there's a follow-up response, add it after a delay
    if (sampleResponse && sampleResponse.followUp) {
      setTimeout(() => {
        const followUpMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: sampleResponse.followUp!.content,
          type: sampleResponse.followUp!.type as MessageType,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, followUpMessage]);
      }, 1000);
    }
    
    setIsLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageFile) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: imageFile ? 'image' : 'text',
      timestamp: new Date()
    };

    // Update chat with user message
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImageFile(null);
    setImagePreview(null);

    // Generate response
    await generateResponse(userMessage);
  };

  // Render message content based on message type
  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'text':
        return <p className="whitespace-pre-wrap">{message.content}</p>;
      case 'image':
        return (
          <img 
            src={message.content} 
            alt="AI Generated" 
            className="max-w-full h-auto rounded-lg max-h-80"
          />
        );
      case 'code':
        return (
          <div className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            <pre>{message.content}</pre>
          </div>
        );
      case 'chart':
        return (
          <div className="bg-white p-4 rounded-lg">
            <img 
              src={message.content} 
              alt="Chart" 
              className="max-w-full h-auto"
            />
          </div>
        );
      default:
        return <p>{message.content}</p>;
    }
  };

  // Render image preview before sending
  const renderImagePreview = () => {
    if (!imagePreview) return null;
    
    return (
      <div className="relative inline-block">
        <img 
          src={imagePreview} 
          alt="Upload preview" 
          className="max-h-24 rounded-lg mr-2"
        />
        <button
          onClick={handleRemoveImage}
          className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center"
        >
          ✕
        </button>
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Eliza AI Chat</h2>
          <p className="text-gray-600 mb-6">Connect your wallet to chat with Eliza, our blockchain multimodal AI assistant.</p>
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Eliza: Blockchain AI Assistant</h1>
              <p className="text-sm text-blue-100">Multimodal AI specialized in blockchain and finance</p>
            </div>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="h-[60vh] overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tl-xl rounded-br-xl rounded-bl-xl' 
                    : 'bg-white border border-gray-200 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm'
                } p-4`}>
                  {message.role === 'user' && message.type === 'image' && imagePreview && (
                    <div className="mb-2">
                      <img src={imagePreview} alt="User upload" className="max-w-full rounded-lg" />
                    </div>
                  )}
                  {renderMessageContent(message)}
                  <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mt-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input form */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            {renderImagePreview()}
            
            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Attach image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something about blockchain, DeFi, NFTs..."
                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              
              <button
                type="submit"
                disabled={(!input.trim() && !imageFile) || isLoading}
                className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            <p>This is a demo of Eliza, a blockchain multimodal AI assistant. Try asking about blockchain, ethereum, nft, defi, smart contracts, or request a chart/code.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">About Eliza: Blockchain Multimodal LLM</h2>
        <p className="text-gray-700 mb-4">
          Eliza is the first end-to-end Blockchain MM-LLM that perceives input and generates output in arbitrary combinations of text and images.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Features</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Multimodal capabilities (text + images)</li>
              <li>Specialized in blockchain and finance</li>
              <li>Token price chart visualization</li>
              <li>Smart contract code analysis</li>
              <li>Transaction and wallet data interpretation</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Capabilities</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Answer questions about blockchain concepts</li>
              <li>Analyze cryptocurrency trends</li>
              <li>Explain DeFi protocols and mechanisms</li>
              <li>Help with smart contract development</li>
              <li>Interpret blockchain-related images and charts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElizaChat;
