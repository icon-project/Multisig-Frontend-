import React from 'react';

interface NavbarProps {
  walletComponent: React.ReactNode;
  chainName: string;
  additionalId?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ walletComponent, chainName, additionalId }) => {
  return (
    <nav className="bg-white border-b-2 border-gray-800 shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <a href="/" className="font-bold text-lg text-gray-800">
            MultiChainGov
          </a>
          <div className="bg-[#66a7f9] text-white font-bold rounded text-center py-1 px-2 my-2">{chainName}</div>
        </div>

        <div className="flex items-center gap-3">
          {additionalId}
          {walletComponent}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
