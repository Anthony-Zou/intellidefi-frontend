import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the interface for the Web3 context
export interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
}

// Create context with default values
const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  connectWallet: async () => {},
  disconnect: () => {},
});

// Provider component
export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async (): Promise<void> => {
    try {
      // This is a placeholder for actual wallet connection logic
      // In a real app, you would use ethers.js, web3.js, or a similar library
      console.log('Connecting wallet...');
      
      // Simulate successful connection
      setAccount('0xD42b...AC0f');
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnect = (): void => {
    // Disconnect wallet
    setAccount(null);
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    // Simulating an already connected wallet for demo purposes
    // In a real app, you would check if the user has already connected
    const checkConnection = async () => {
      // For demo, we'll assume no pre-existing connection
    };
    
    checkConnection();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected: !!account,
        connectWallet,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = (): Web3ContextType => useContext(Web3Context);
