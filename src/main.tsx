import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { chains as testnetChains, assets as testnetAssets } from 'chain-registry/testnet';
import { wallets } from '@cosmos-kit/keplr';
import { ThemeProvider } from '@interchain-ui/react';
import { AppProvider } from './context/AppContext.tsx';

import '@interchain-ui/react/styles';

const ENV = import.meta.env.VITE_APP_ENV;
const chainsInUse = ENV === 'prod' ? chains : testnetChains;
const assetsInUse = ENV === 'prod' ? assets : testnetAssets;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ChainProvider chains={chainsInUse} assetLists={assetsInUse} wallets={wallets}>
        <AppProvider>
          <App />
        </AppProvider>
      </ChainProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
