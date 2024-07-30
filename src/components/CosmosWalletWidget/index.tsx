import { useChain } from '@cosmos-kit/react';
import { CosmosChains, getCosmosChain } from '../../constants/chains';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ActionTypes } from '../../context/ActionTypes';

const ENV = import.meta.env.VITE_APP_ENV;
const NETWORK_TYPE = ENV === 'prod' ? 'mainnet' : 'testnet';

const CosmosWalletWidget = () => {
  const { state, dispatch } = useAppContext();
  const chainName = state.activeCosmosChain.chainName;
  const [activeChain, setActiveChain] = useState('');
  const { connect, openView, address } = useChain(chainName);

  const AvailableChainOptions = Object.values(CosmosChains).filter((chain) => chain.networkType === NETWORK_TYPE);

  const handleActiveChainChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const cosmosChain = getCosmosChain(selectedValue as keyof typeof CosmosChains);
    if (cosmosChain) {
      dispatch({ type: ActionTypes.SET_ACTIVE_COSMOS_CHAIN, payload: cosmosChain });
    }
  };

  useEffect(() => {
    setActiveChain(state.activeCosmosChain.chainName);
  }, [state.activeCosmosChain.chainName]);

  return (
    <div className="cosmos-wallet-widget">
      <div className="flex gap-3">
        <select
          id="cosmos-chains"
          className="bg-[#2d3748] text-white text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={activeChain}
          onChange={handleActiveChainChange}
        >
          {AvailableChainOptions.map((chain: any, index) => (
            <option value={chain.chainName} key={index}>
              {chain.name}
            </option>
          ))}
        </select>
        {address ? (
          <div className="flex-shrink-0">
            <button
              onClick={openView}
              className="bg-[#2d3748] text-white font-semibold py-1 px-3 rounded cursor-pointer h-full min-h-[40px]"
            >
              View Cosmos Wallet
            </button>
          </div>
        ) : (
          <div className="flex-shrink-0">
            <button
              onClick={connect}
              className="bg-[#2d3748] text-white font-semibold py-1 px-3 rounded cursor-pointer h-full min-h-[40px]"
            >
              Connect Cosmos Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CosmosWalletWidget;
