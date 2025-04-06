import React from 'react';
import { IconType } from 'react-icons';
import { FaWallet, FaChartLine, FaExchangeAlt, FaBars, FaTimes, FaRobot, FaImage, FaCode } from 'react-icons/fa';

interface IconProps {
  className?: string;
  size?: number;
}

// Helper function for creating icon components
const createIconComponent = (Icon: IconType) => {
  return function IconComponent({ className, size }: IconProps) {
    return React.createElement(Icon as React.ComponentType<any>, { className, size });
  };
};

export const WalletIcon = createIconComponent(FaWallet);
export const ChartLineIcon = createIconComponent(FaChartLine);
export const ExchangeAltIcon = createIconComponent(FaExchangeAlt);
export const BarsIcon = createIconComponent(FaBars);
export const TimesIcon = createIconComponent(FaTimes);
export const RobotIcon = createIconComponent(FaRobot);
export const ImageIcon = createIconComponent(FaImage);
export const CodeIcon = createIconComponent(FaCode);