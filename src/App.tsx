import CosmosWalletWidget from './components/CosmosWalletWidget';
import { CosmosChains } from './constants/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { config } from './config';
import { Landing } from './components/Landing';

import EVMManagerPage from './pages/EVMManagerPage';

const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID;

function App() {
  const queryClient = new QueryClient();

  // const config = getDefaultConfig({
  //   appName: 'IBC',
  //   projectId: WALLET_CONNECT_PROJECT_ID,
  //   chains: [sepolia, baseSepolia],
  //   ssr: false,
  // });

  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <div className="app pt-5 pl-32">
              <h3 className="text-lg font-bold">IBC</h3>

              <div>
                <div className="w-[400px]">
                  <CosmosWalletWidget chain={CosmosChains.archway} />
                </div>

                <EVMManagerPage />
              </div>
            </div>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
