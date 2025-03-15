import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Define types for our Web3 context
interface Web3ContextType {
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

// Create a context with undefined default value
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Define Provider component props
interface Web3ProviderProps {
  children: ReactNode;
}

// Define the provider component
export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Connect wallet function
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Check if window.ethereum is available (MetaMask or similar provider)
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found. Please install MetaMask or similar wallet.");
      }
      
      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      
      // Get the signer
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      
      // Get the network information
      const network = await provider.getNetwork();
      
      // Update state
      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setChainId(network.chainId);
      
      // Set up listeners for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Save connection info to localStorage
      localStorage.setItem('walletConnected', 'true');
      
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
    
    // Clear state
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    
    // Remove from localStorage
    localStorage.removeItem('walletConnected');
  };
  
  // Handle account changes from MetaMask
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else if (accounts[0] !== account) {
      // Account changed
      setAccount(accounts[0]);
      
      // Update signer if provider exists
      if (provider) {
        const newSigner = provider.getSigner();
        setSigner(newSigner);
      }
    }
  };
  
  // Handle chain/network changes from MetaMask
  const handleChainChanged = (chainIdHex: string) => {
    // MetaMask recommends reloading the page on chain change
    window.location.reload();
  };
  
  // Try to restore connection on initial load
  useEffect(() => {
    const autoConnect = async () => {
      // Check if user was previously connected
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      
      if (wasConnected && window.ethereum) {
        try {
          // Check if already connected accounts exist
          const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            // User is still connected
            const signer = provider.getSigner();
            const network = await provider.getNetwork();
            
            setProvider(provider);
            setSigner(signer);
            setAccount(accounts[0]);
            setChainId(network.chainId);
            
            // Set up listeners
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
          }
        } catch (err) {
          console.error("Error auto-connecting:", err);
          localStorage.removeItem('walletConnected');
        }
      }
    };
    
    autoConnect();
    
    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);
  
  // The value that will be given to consumers of this context
  const contextValue: Web3ContextType = {
    account,
    provider,
    signer,
    chainId,
    connectWallet,
    disconnectWallet,
    isConnecting,
    isConnected: !!account,
    error
  };
  
  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  
  return context;
};

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
