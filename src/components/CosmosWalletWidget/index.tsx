import { useChain } from '@cosmos-kit/react';
import { CosmosChains } from '../../constants/chains';
import { ChangeEvent, useEffect, useState } from 'react';

interface CosmosWalletWidgetProps {
  chainName: string;
}

const CosmosWalletWidget = ({ chainName }: CosmosWalletWidgetProps) => {
  const [activeChain, setActiveChain] = useState(chainName);
  const { connect, openView, address } = useChain(chainName);

  const handleActiveChainChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setActiveChain(event.target.value);
    localStorage.setItem('cosmos-active-chain', event.target.value);
  };

  useEffect(() => {
    const activeCosmosChain = localStorage.getItem('cosmos-active-chain');
    if (activeCosmosChain) {
      setActiveChain(activeCosmosChain);
    }
  }, []);

  return (
    <div className="cosmos-wallet-widget">
      {address ? (
        <div className="flex gap-3">
          <select
            id="cosmos-chains"
            className="bg-[#2d3748] text-white text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={activeChain}
            onChange={handleActiveChainChange}
          >
            {Object.keys(CosmosChains).map((chain: string, index) => (
              <option value={chain} key={index}>
                {chain}
              </option>
            ))}
          </select>
          <div className="flex-shrink-0">
            <button
              onClick={openView}
              className="bg-[#2d3748] text-white font-semibold py-1 px-3 rounded cursor-pointer h-full min-h-[40px]"
            >
              View Cosmos Wallet
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={connect}
          className="bg-[#2d3748] text-white font-semibold py-1 px-3 rounded cursor-pointer h-full min-h-[40px]"
        >
          Connect Cosmos Wallet
        </button>
      )}
    </div>
  );
};

export default CosmosWalletWidget;
