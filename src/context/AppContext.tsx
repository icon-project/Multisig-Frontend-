import React, { createContext, useContext, useReducer, Dispatch, ReactNode } from 'react';
import { ActionTypes } from './ActionTypes';
import { CosmosChains, cosmosChainDetails } from '../constants/chains';

const ENV = import.meta.env.VITE_APP_ENV;
const NETWORK_TYPE = ENV === 'prod' ? 'mainnet' : 'testnet';

interface State {
  activeCosmosChain: cosmosChainDetails;
}

type Action = { type: ActionTypes.SET_ACTIVE_COSMOS_CHAIN; payload: cosmosChainDetails };

const defaultChain = Object.values(CosmosChains).find((chain) => chain.networkType === NETWORK_TYPE);
const initialState: State = {
  activeCosmosChain: { chainId: defaultChain!.chainId, chainName: defaultChain!.chainName },
};

interface ContextType {
  state: State;
  dispatch: Dispatch<Action>;
}
const AppContext = createContext<ContextType | undefined>(undefined);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_COSMOS_CHAIN:
      return { ...state, activeCosmosChain: action.payload };
    default:
      throw new Error('Unhandled action type');
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
