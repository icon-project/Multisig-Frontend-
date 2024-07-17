import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { wallets } from '@cosmos-kit/keplr';
import { ThemeProvider } from '@interchain-ui/react';

import '@interchain-ui/react/styles';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ChainProvider chains={chains} assetLists={assets} wallets={wallets}>
        <App />
      </ChainProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
