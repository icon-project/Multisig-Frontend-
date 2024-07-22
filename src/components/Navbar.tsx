import React from 'react';

interface NavbarProps {
  walletComponent: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ walletComponent }) => {
  return (
    <nav className="bg-white border-b-2 border-gray-800 shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-4">
        <a href="/" className="font-bold text-lg text-gray-800">
          MultiChainGov
        </a>
        <div className="flex items-center">{walletComponent}</div>
      </div>
    </nav>
  );
};

export default Navbar;