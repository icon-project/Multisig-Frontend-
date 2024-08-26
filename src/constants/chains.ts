export type cosmosChainDetails = {
  chainId: string;
  chainName: string;
  name: string;
  networkType: string;
};

const archwayRpcUrl = import.meta.env.VITE_APP_ARCHWAY_RPC_URL;
const injectiveRpcUrl = import.meta.env.VITE_APP_INJECTIVE_RPC_URL;
const neutronRpcUrl = import.meta.env.VITE_APP_NEUTRON_RPC_URL;

export const CosmosChains = {
  archway: {
    chainId: 'archway-1',
    chainName: 'archway',
    name: 'archway',
    networkType: 'mainnet',
    rpcUrl: archwayRpcUrl,
  },
  injective: {
    chainId: 'injective-1',
    chainName: 'injective',
    name: 'injective',
    networkType: 'mainnet',
    rpcUrl: injectiveRpcUrl,
  },
  neutron: {
    chainId: 'neutron-1',
    chainName: 'neturon',
    name: 'neturon',
    networkType: 'mainnet',
    rpcUrl: neutronRpcUrl,
  },
  archwaytestnet: {
    chainId: 'constantine-3',
    chainName: 'archwaytestnet',
    name: 'archway',
    networkType: 'testnet',
    rpcUrl: archwayRpcUrl,
  },
  injectivetestnet: {
    chainId: 'injective-888',
    chainName: 'injectivetestnet',
    name: 'injective',
    networkType: 'testnet',
    rpcUrl: injectiveRpcUrl,
  },
  neutrontestnet: {
    chainId: 'pion-1',
    chainName: 'neutrontestnet',
    name: 'neturon',
    networkType: 'testnet',
    rpcUrl: neutronRpcUrl,
  },
};

export const getCosmosChain = (chain: keyof typeof CosmosChains): cosmosChainDetails | undefined => {
  return CosmosChains[chain];
};

export type ethereumChainDetails = {
  chainId: string;
  chainName: string;
  name: string;
  networkType: string;
};

// https://keplr-chain-registry.vercel.app/api/chains
export const CosmosChainsDetails = [
  {
    bech32Config: {
      bech32PrefixAccAddr: 'archway',
      bech32PrefixAccPub: 'archwaypub',
      bech32PrefixConsAddr: 'archwayvalcons',
      bech32PrefixConsPub: 'archwayvalconspub',
      bech32PrefixValAddr: 'archwayvaloper',
      bech32PrefixValPub: 'archwayvaloperpub',
    },
    bip44: {
      coinType: 118,
    },
    chainId: 'archway-1',
    chainName: 'Archway',
    chainSymbolImageUrl:
      'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/archway/chain.png',
    currencies: [
      {
        coinDecimals: 18,
        coinDenom: 'ARCH',
        coinGeckoId: 'archway',
        coinMinimalDenom: 'aarch',
        coinImageUrl: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/archway/aarch.png',
      },
    ],
    features: ['cosmwasm'],
    feeCurrencies: [
      {
        coinDecimals: 18,
        coinDenom: 'ARCH',
        coinGeckoId: 'archway',
        coinMinimalDenom: 'aarch',
        gasPriceStep: {
          low: 140000000000,
          average: 196000000000,
          high: 225400000000,
        },
        coinImageUrl: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/archway/aarch.png',
      },
    ],
    rest: 'https://api.mainnet.archway.io',
    rpc: 'https://rpc.mainnet.archway.io',
    stakeCurrency: {
      coinDecimals: 18,
      coinDenom: 'ARCH',
      coinGeckoId: 'archway',
      coinMinimalDenom: 'aarch',
      coinImageUrl: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/archway/aarch.png',
    },
    nodeProvider: {
      name: 'Phi Labs',
      email: 'support@philabs.xyz',
      website: 'https://philabs.xyz',
    },
  },
  {
    rpc: 'https://rpc-injective.keplr.app',
    rest: 'https://lcd-injective.keplr.app',
    chainId: 'injective-1',
    chainName: 'Injective',
    chainSymbolImageUrl:
      'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/chain.png',
    bech32Config: {
      bech32PrefixAccPub: 'injpub',
      bech32PrefixValPub: 'injvaloperpub',
      bech32PrefixAccAddr: 'inj',
      bech32PrefixConsPub: 'injvalconspub',
      bech32PrefixValAddr: 'injvaloper',
      bech32PrefixConsAddr: 'injvalcons',
    },
    bip44: {
      coinType: 60,
    },
    stakeCurrency: {
      coinDenom: 'INJ',
      coinDecimals: 18,
      coinMinimalDenom: 'inj',
      coinGeckoId: 'injective-protocol',
      coinImageUrl: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/inj.png',
    },
    currencies: [
      {
        coinDenom: 'INJ',
        coinDecimals: 18,
        coinMinimalDenom: 'inj',
        coinGeckoId: 'injective-protocol',
        coinImageUrl: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/inj.png',
      },
      {
        coinDenom: 'NINJA',
        coinDecimals: 6,
        coinMinimalDenom: 'factory/inj1xtel2knkt8hmc9dnzpjz6kdmacgcfmlv5f308w/ninja',
        coinGeckoId: 'dog-wif-nuchucks',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/ninja.png',
      },
      {
        coinDenom: 'Talis',
        coinDecimals: 6,
        coinMinimalDenom: 'factory/inj1maeyvxfamtn8lfyxpjca8kuvauuf2qeu6gtxm3/Talis',
        coinGeckoId: 'talis-protocol',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/factory/inj1maeyvxfamtn8lfyxpjca8kuvauuf2qeu6gtxm3/talis.png',
      },
      {
        coinDenom: 'HAVA',
        coinMinimalDenom: 'factory/inj1h0ypsdtjfcjynqu3m75z2zwwz5mmrj8rtk2g52/uhava',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/factory/inj1h0ypsdtjfcjynqu3m75z2zwwz5mmrj8rtk2g52/hava.png',
      },
      {
        coinDenom: 'KIRA',
        coinDecimals: 6,
        coinMinimalDenom: 'factory/inj1xy3kvlr4q4wdd6lrelsrw2fk2ged0any44hhwq/KIRA',
        coinGeckoId: 'kira-the-injective-cat',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/factory/inj1xy3kvlr4q4wdd6lrelsrw2fk2ged0any44hhwq/KIRA.png',
      },
      {
        coinDenom: 'HDRO',
        coinMinimalDenom: 'factory/inj1etz0laas6h7vemg3qtd67jpr6lh8v7xz7gfzqw/hdro',
        coinDecimals: 6,
        coinGeckoId: 'hydro-protocol-2',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/factory/inj1etz0laas6h7vemg3qtd67jpr6lh8v7xz7gfzqw/hdro.png',
      },
      {
        coinDenom: 'QUNT',
        coinDecimals: 6,
        coinMinimalDenom: 'factory/inj127l5a2wmkyvucxdlupqyac3y0v6wqfhq03ka64/qunt',
        coinGeckoId: 'injective-quants',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/factory/inj127l5a2wmkyvucxdlupqyac3y0v6wqfhq03ka64/QUNT.png',
      },
      {
        coinDenom: 'HOUND',
        coinDecimals: 6,
        coinMinimalDenom: 'factory/inj1nccncwqx5q22lf4uh83dhe89e3f0sh8kljf055/HOUND',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/factory/inj1nccncwqx5q22lf4uh83dhe89e3f0sh8kljf055/HOUND.png',
      },
      {
        coinDenom: 'bINJ',
        coinDecimals: 18,
        coinMinimalDenom: 'factory/inj1dxp690rd86xltejgfq2fa7f2nxtgmm5cer3hvu/bINJ',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/factory/inj1dxp690rd86xltejgfq2fa7f2nxtgmm5cer3hvu/bINJ.png',
      },
      {
        coinDenom: 'SYN',
        coinDecimals: 6,
        coinMinimalDenom: 'factory/inj1a6xdezq7a94qwamec6n6cnup02nvewvjtz6h6e/SYN',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/factory/inj1a6xdezq7a94qwamec6n6cnup02nvewvjtz6h6e/syn.png',
      },
      {
        coinDenom: 'ashSYN',
        coinMinimalDenom: 'factory/inj1ej2f3lmpxj4djsmmuxvnfuvplrut7zmwrq7zj8/syn.ash',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/factory/inj1ej2f3lmpxj4djsmmuxvnfuvplrut7zmwrq7zj8/syn.ash.png',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'INJ',
        coinDecimals: 18,
        coinMinimalDenom: 'inj',
        coinGeckoId: 'injective-protocol',
        coinImageUrl: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective/inj.png',
        gasPriceStep: {
          low: 500000000,
          average: 1000000000,
          high: 1500000000,
        },
      },
    ],
    features: ['eth-address-gen', 'eth-key-sign', 'cosmwasm'],
  },
  {
    rpc: 'https://rpc-neutron.keplr.app',
    rest: 'https://lcd-neutron.keplr.app',
    chainId: 'neutron-1',
    chainName: 'Neutron',
    chainSymbolImageUrl:
      'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/chain.png',
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'neutron',
      bech32PrefixAccPub: 'neutronpub',
      bech32PrefixValAddr: 'neutronvaloper',
      bech32PrefixValPub: 'neutronvaloperpub',
      bech32PrefixConsAddr: 'neutronvalcons',
      bech32PrefixConsPub: 'neutronvalconspub',
    },
    currencies: [
      {
        coinDenom: 'NTRN',
        coinMinimalDenom: 'untrn',
        coinDecimals: 6,
        coinGeckoId: 'neutron-3',
        coinImageUrl: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/untrn.png',
      },
      {
        coinDenom: 'wstETH',
        coinMinimalDenom: 'factory/neutron1ug740qrkquxzrk2hh29qrlx3sktkfml3je7juusc2te7xmvsscns0n2wry/wstETH',
        coinDecimals: 18,
        coinGeckoId: 'wrapped-steth',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1ug740qrkquxzrk2hh29qrlx3sktkfml3je7juusc2te7xmvsscns0n2wry/wstETH.png',
      },
      {
        coinDenom: 'NEWT',
        coinMinimalDenom: 'factory/neutron1p8d89wvxyjcnawmgw72klknr3lg9gwwl6ypxda/newt',
        coinDecimals: 6,
        coinGeckoId: 'newt',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1p8d89wvxyjcnawmgw72klknr3lg9gwwl6ypxda/newt.png',
      },
      {
        coinDenom: 'ECLIP',
        coinMinimalDenom: 'factory/neutron10sr06r3qkhn7xzpw3339wuj77hu06mzna6uht0/eclip',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron10sr06r3qkhn7xzpw3339wuj77hu06mzna6uht0/eclip.png',
      },
      {
        coinDenom: 'BAD',
        coinMinimalDenom: 'factory/neutron143wp6g8paqasnuuey6zyapucknwy9rhnld8hkr/bad',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron143wp6g8paqasnuuey6zyapucknwy9rhnld8hkr/bad.png',
      },
      {
        coinDenom: 'DSR',
        coinMinimalDenom: 'factory/neutron1guar6dc2scpxtmmq8reh0q5cv2l37vs0uyfdru/dinosaur',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1guar6dc2scpxtmmq8reh0q5cv2l37vs0uyfdru/dinosaur.png',
      },
      {
        coinDenom: 'NTRL',
        coinMinimalDenom: 'factory/neutron1ume2n42r5j0660gegrr28fzdze7aqf7r5cd9y6/newtroll',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1ume2n42r5j0660gegrr28fzdze7aqf7r5cd9y6/newtroll.png',
      },
      {
        coinDenom: 'RETRO',
        coinMinimalDenom: 'factory/neutron1t24nc7whl77relnu3taxyg3p66pjyuk82png2y/uretro',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1t24nc7whl77relnu3taxyg3p66pjyuk82png2y/retro.png',
      },
      {
        coinDenom: 'CIRCUS',
        coinMinimalDenom: 'factory/neutron170v88vrtnedesyfytuku257cggxc79rd7lwt7q/ucircus',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron170v88vrtnedesyfytuku257cggxc79rd7lwt7q/ucircus.png',
      },
      {
        coinDenom: 'GODRD',
        coinMinimalDenom: 'factory/neutron1t5qrjtyryh8gzt800qr5vylhh2f8cmx4wmz9mc/ugoddard',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1t5qrjtyryh8gzt800qr5vylhh2f8cmx4wmz9mc/ugoddard.png',
      },
      {
        coinDenom: 'GDD',
        coinMinimalDenom: 'factory/neutron1yqj9vcc0y73xfxjzegaj4v8q0zefevnlpuh4rj/GODDARD',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1yqj9vcc0y73xfxjzegaj4v8q0zefevnlpuh4rj/gdd.png',
      },
      {
        coinDenom: 'APOLLO',
        coinMinimalDenom: 'factory/neutron154gg0wtm2v4h9ur8xg32ep64e8ef0g5twlsgvfeajqwghdryvyqsqhgk8e/APOLLO',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron154gg0wtm2v4h9ur8xg32ep64e8ef0g5twlsgvfeajqwghdryvyqsqhgk8e/apollo.png',
      },
      {
        coinDenom: 'ROOM',
        coinMinimalDenom: 'factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/ROOM',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/room.png',
      },
      {
        coinDenom: 'GOP',
        coinMinimalDenom: 'factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/GOP',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/GOP.png',
      },
      {
        coinDenom: 'BOY',
        coinMinimalDenom: 'neutron1uqvse8fdrd9tam47f2jhy9m6al6xxtqpc83f9pdnz5gdle4swc0spfnctv',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1uqvse8fdrd9tam47f2jhy9m6al6xxtqpc83f9pdnz5gdle4swc0spfnctv/boy.png',
      },
      {
        coinDenom: 'CARTEL',
        coinMinimalDenom: 'factory/neutron1w0pz4mjw7n96kkragj8etgfgakg5vw9lzg77wq/cartel',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1w0pz4mjw7n96kkragj8etgfgakg5vw9lzg77wq/cartel.png',
      },
      {
        coinDenom: 'MOO',
        coinMinimalDenom: 'factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/MOO',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/MOO.png',
      },
      {
        coinDenom: 'SCRAP',
        coinMinimalDenom: 'factory/neutron1qm224945hrkwc5qze40tau499n46ydmulpeagscmsuyxfrds02usf7mnpu/scrap',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1qm224945hrkwc5qze40tau499n46ydmulpeagscmsuyxfrds02usf7mnpu/SCRAP.png',
      },
      {
        coinDenom: 'WEIRD',
        coinMinimalDenom: 'factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/WEIRD',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/WEIRD.png',
      },
      {
        coinDenom: 'SIN',
        coinMinimalDenom: 'factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/sin',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron133xakkrfksq39wxy575unve2nyehg5npx75nph/sinToken.png',
      },
      {
        coinDenom: 'dATOM',
        coinMinimalDenom: 'factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/udatom',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/neutron/factory/neutron1k6hr0f83e7un2wjf29cspk7j69jrnskk65k3ek2nj9dztrlzpj6q00rtsa/datom.png',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'NTRN',
        coinMinimalDenom: 'untrn',
        coinDecimals: 6,
        coinGeckoId: 'neutron-3',
        gasPriceStep: {
          low: 0.0053,
          average: 0.0053,
          high: 0.0053,
        },
      },
      {
        coinDenom: 'ATOM',
        coinMinimalDenom: 'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.0008,
          average: 0.0008,
          high: 0.0008,
        },
      },
      {
        coinDenom: 'USDC',
        coinMinimalDenom: 'ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349',
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.008,
          average: 0.008,
          high: 0.008,
        },
      },
      {
        coinDenom: 'wstETH',
        coinMinimalDenom: 'factory/neutron1ug740qrkquxzrk2hh29qrlx3sktkfml3je7juusc2te7xmvsscns0n2wry/wstETH',
        coinDecimals: 18,
        gasPriceStep: {
          low: 2903231.6597,
          average: 2903231.6597,
          high: 2903231.6597,
        },
      },
      {
        coinDenom: 'DYDX',
        coinMinimalDenom: 'ibc/2CB87BCE0937B1D1DFCEE79BE4501AAF3C265E923509AEAC410AD85D27F35130',
        coinDecimals: 18,
        gasPriceStep: {
          low: 2564102564.1026,
          average: 2564102564.1026,
          high: 2564102564.1026,
        },
      },
      {
        coinDenom: 'TIA',
        coinMinimalDenom: 'ibc/773B4D0A3CD667B2275D5A4A7A2F0909C0BA0F4059C0B9181E680DDF4965DCC7',
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.0004,
          average: 0.0004,
          high: 0.0004,
        },
      },
      {
        coinDenom: 'stATOM',
        coinMinimalDenom: 'ibc/B7864B03E1B9FD4F049243E92ABD691586F682137037A9F3FCA5222815620B3C',
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.0006,
          average: 0.0006,
          high: 0.0006,
        },
      },
    ],
    features: ['cosmwasm'],
  },

  {
    bech32Config: {
      bech32PrefixAccAddr: 'archway',
      bech32PrefixAccPub: 'archwaypub',
      bech32PrefixConsAddr: 'archwayvalcons',
      bech32PrefixConsPub: 'archwayvalconspub',
      bech32PrefixValAddr: 'archwayvaloper',
      bech32PrefixValPub: 'archwayvaloperpub',
    },
    bip44: {
      coinType: 118,
    },
    chainId: 'constantine-3',
    chainName: 'Archway (Testnet)',
    chainSymbolImageUrl:
      'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/constantine/chain.png',
    currencies: [
      {
        coinDecimals: 18,
        coinDenom: 'CONST',
        coinMinimalDenom: 'aconst',
      },
    ],
    features: ['cosmwasm'],
    feeCurrencies: [
      {
        coinDecimals: 18,
        coinDenom: 'CONST',
        coinMinimalDenom: 'aconst',
        gasPriceStep: {
          low: 140000000000,
          average: 196000000000,
          high: 225400000000,
        },
      },
    ],
    rest: 'https://api.constantine.archway.io',
    rpc: 'https://rpc.constantine.archway.io',
    stakeCurrency: {
      coinDecimals: 18,
      coinDenom: 'CONST',
      coinMinimalDenom: 'aconst',
    },
    nodeProvider: {
      name: 'Phi Labs',
      email: 'support@philabs.xyz',
      website: 'https://philabs.xyz',
    },
  },
  {
    rpc: 'https://testnet.sentry.tm.injective.network',
    rest: 'https://testnet.sentry.lcd.injective.network',
    chainId: 'injective-888',
    chainName: 'Injective (Testnet)',
    nodeProvider: {
      name: 'Injective',
      email: 'contact@injectivelabs.org',
    },
    chainSymbolImageUrl:
      'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective-888/chain.png',
    bech32Config: {
      bech32PrefixAccPub: 'injpub',
      bech32PrefixValPub: 'injvaloperpub',
      bech32PrefixAccAddr: 'inj',
      bech32PrefixConsPub: 'injvalconspub',
      bech32PrefixValAddr: 'injvaloper',
      bech32PrefixConsAddr: 'injvalcons',
    },
    bip44: {
      coinType: 60,
    },
    stakeCurrency: {
      coinDenom: 'INJ (Testnet)',
      coinDecimals: 18,
      coinMinimalDenom: 'inj',
      coinImageUrl:
        'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective-888/inj.png',
    },
    currencies: [
      {
        coinDenom: 'INJ (Testnet)',
        coinDecimals: 18,
        coinMinimalDenom: 'inj',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective-888/inj.png',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'INJ (Testnet)',
        coinDecimals: 18,
        coinMinimalDenom: 'inj',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/injective-888/inj.png',
        gasPriceStep: {
          low: 500000000,
          average: 1000000000,
          high: 1500000000,
        },
      },
    ],
    features: ['eth-address-gen', 'eth-key-sign', 'cosmwasm'],
  },
  {
    rpc: 'https://rpc-palvus.pion-1.ntrn.tech',
    rest: 'https://rest-palvus.pion-1.ntrn.tech',
    chainId: 'pion-1',
    chainName: 'Neutron Testnet',
    chainSymbolImageUrl: 'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/pion/chain.png',
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'neutron',
      bech32PrefixAccPub: 'neutronpub',
      bech32PrefixValAddr: 'neutronvaloper',
      bech32PrefixValPub: 'neutronvaloperpub',
      bech32PrefixConsAddr: 'neutronvalcons',
      bech32PrefixConsPub: 'neutronvalconspub',
    },
    currencies: [
      {
        coinDenom: 'NTRN',
        coinMinimalDenom: 'untrn',
        coinDecimals: 6,
      },
      {
        coinDenom: 'amATOM',
        coinMinimalDenom: 'factory/neutron15lku24mqhvy4v4gryrqs4662n9v9q4ux9tayn89cmdzldjcgawushxvm76/amatom',
        coinDecimals: 6,
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/pion/factory/neutron15lku24mqhvy4v4gryrqs4662n9v9q4ux9tayn89cmdzldjcgawushxvm76/amATOM.png',
      },
      {
        coinDenom: 'dATOM',
        coinMinimalDenom: 'factory/neutron16l0qfrrahy5mve5x9nnw6zs9vv30k7rk55h6aaypq88ljwg57uxsxcg6y6/udatom',
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'NTRN',
        coinMinimalDenom: 'untrn',
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.02,
          average: 0.02,
          high: 0.02,
        },
      },
    ],
    features: [],
  },
];
