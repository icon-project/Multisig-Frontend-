import { http, createConfig } from '@wagmi/core';
import {
  mainnet,
  sepolia,
  avalancheFuji,
  optimismSepolia,
  arbitrumSepolia,
  baseSepolia,
  avalanche,
  arbitrum,
  optimism,
  base,
} from '@wagmi/core/chains';

export const config = createConfig({
  chains: [
    mainnet,
    sepolia,
    avalancheFuji,
    optimism,
    arbitrum,
    avalanche,
    optimismSepolia,
    arbitrumSepolia,
    baseSepolia,
    base,
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [avalancheFuji.id]: http(),
    [avalanche.id]: http(),
    [optimismSepolia.id]: http(),
    [optimism.id]: http(),
    [arbitrumSepolia.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});
