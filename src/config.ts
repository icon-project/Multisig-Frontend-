import { http, createConfig } from '@wagmi/core';

import {
  mainnet,
  sepolia,
  avalanche,
  avalancheFuji,
  optimism,
  optimismSepolia,
  arbitrum,
  arbitrumSepolia,
  baseSepolia,
  base,
} from '@wagmi/core/chains';

export const mainconfig = createConfig({
  chains: [mainnet, optimism, arbitrum, avalanche, base],
  transports: {
    [mainnet.id]: http(),

    [avalanche.id]: http(),

    [optimism.id]: http(),

    [arbitrum.id]: http(),
    [base.id]: http(),
  },
});
export const testconfig = createConfig({
  chains: [baseSepolia, optimismSepolia, sepolia, avalancheFuji],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [avalancheFuji.id]: http(),

    [optimismSepolia.id]: http(),

    [arbitrumSepolia.id]: http(),
  },
});
