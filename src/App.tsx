import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { mainconfig, testconfig } from './config';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import CosmosLayoutPage from './pages/CosmosLayoutPage';
import EVMLayoutPage from './pages/EVMLayoutPage';

const APP_ENV = import.meta.env.VITE_APP_ENV;

// const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID;

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <WagmiProvider config={APP_ENV == 'prod' ? mainconfig : testconfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme()}>
            <div className="app min-h-[100vh] bg-gradient-to-b from-blue-400 to-blue-200">
              <Router>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/cosmos/*" element={<CosmosLayoutPage />} />
                  <Route path="/evm/*" element={<EVMLayoutPage />} />
                  <Route path="/evm/proposals/:id" element={<EVMLayoutPage />} />
                </Routes>
              </Router>
            </div>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
