import CosmosApprovalPage from './pages/CosmosApprovalPage';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import CreateProposal from './pages/CreateProposal';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { mainconfig, testconfig } from './config';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import EVMManagerPage from './pages/EVMManagerPage';

const APP_ENV = import.meta.env.VITE_APP_ENV;

// const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID;

function App() {
  const queryClient = new QueryClient();

  console.log('the app is running on mode:', APP_ENV);

  console.log(APP_ENV === 'dev');
  const DefaultRoute = () => (
    <>
      <CosmosApprovalPage />
      <EVMManagerPage />
    </>
  );

  return (
    <>
      <WagmiProvider config={APP_ENV == 'dev' ? testconfig : mainconfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme()}>
            <Router>
              <div className="app min-h-[100vh] bg-gradient-to-b from-blue-400 to-blue-200">
                <h3 className="text-4xl text-center font-bold py-6">IBC</h3>

                <Routes>
                  <Route path="/" element={<DefaultRoute />} />
                  <Route path="/evm/create-proposal" element={<CreateProposal />} />
                </Routes>
              </div>
            </Router>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
