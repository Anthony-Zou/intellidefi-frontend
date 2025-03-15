import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { WalletIcon, BarsIcon, TimesIcon } from '../../utils/icons';

const Navbar = () => {
  const { account, connectWallet, disconnectWallet, isConnected } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActiveLink = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">IntelliDeFi</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`${
                isActiveLink('/') 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-blue-600'
              } px-3 py-2 text-sm font-medium`}
            >
              Dashboard
            </Link>
            <Link
              to="/risk-assessment"
              className={`${
                isActiveLink('/risk-assessment')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              } px-3 py-2 text-sm font-medium`}
            >
              Risk Assessment
            </Link>
            <Link
              to="/create-portfolio"
              className={`${
                isActiveLink('/create-portfolio')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              } px-3 py-2 text-sm font-medium`}
            >
              Create Portfolio
            </Link>
            <Link
              to="/trading"
              className={`${
                isActiveLink('/trading')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              } px-3 py-2 text-sm font-medium`}
            >
              Trading
            </Link>

            <div className="ml-4">
              {isConnected ? (
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center">
                    <WalletIcon className="text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                    </span>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <WalletIcon className="mr-2" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-blue-600"
            >
              {isOpen ? <TimesIcon size={24} /> : <BarsIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`${
                isActiveLink('/')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              Dashboard
            </Link>
            <Link
              to="/risk-assessment"
              className={`${
                isActiveLink('/risk-assessment')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              Risk Assessment
            </Link>
            <Link
              to="/create-portfolio"
              className={`${
                isActiveLink('/create-portfolio')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              Create Portfolio
            </Link>
            <Link
              to="/trading"
              className={`${
                isActiveLink('/trading')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50'
              } block px-3 py-2 rounded-md text-base font-medium`}
            >
              Trading
            </Link>
            <div className="mt-4 px-3">
              {isConnected ? (
                <div className="space-y-2">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex items-center">
                      <WalletIcon className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <WalletIcon className="mr-2" />
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;