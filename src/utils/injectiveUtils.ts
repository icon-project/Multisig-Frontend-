import { MsgExecuteContractCompat } from '@injectivelabs/sdk-ts';
import { WalletStrategy } from '@injectivelabs/wallet-strategy';
import { MsgBroadcaster } from '@injectivelabs/wallet-core';
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';
import { ChainId as InjectiveChainId } from '@injectivelabs/ts-types';
import { Wallet } from '@injectivelabs/wallet-base';

const ENV = import.meta.env.VITE_APP_ENV;
const NetworkType = ENV === 'prod' ? Network.Mainnet : Network.Testnet;

/**
 * Universal Injective contract call supporting:
 *  - Keplr
 *  - Ledger via Keplr (EIP-712)
 *  - Ledger native
 *  - MetaMask
 *  - Any wallet supported by WalletStrategy
 */
export const executeInjectiveContractCall = async (
  chainId: string,
  contractAddress: string,
  txMsg: any
): Promise<string> => {

  try {
    /** 1. Init wallet strategy (auto-detects actual wallet type) */
    const walletStrategy = new WalletStrategy({
      chainId: InjectiveChainId.Mainnet,  
      strategies: {}            // example: 'injective-1' or 'injective-888'
    });

    walletStrategy.setWallet(Wallet.Keplr);

    /** 2. Init broadcaster */
    const endpoints = getNetworkEndpoints(NetworkType);

    const msgBroadcaster = new MsgBroadcaster({
      walletStrategy,
      network: NetworkType,
      endpoints,
      simulateTx: true,              // auto gas estimation
    });

    /** 3. Get Injective address from active wallet */
    const injectiveAddress = (await walletStrategy.getAddresses())[0];

    console.log('Injective address:', injectiveAddress);

    /** 4. Build ExecuteContract message */
    const msgExec = MsgExecuteContractCompat.fromJSON({
      sender: injectiveAddress,
      contractAddress,
      msg: txMsg,
      funds: [],
    });

    /** 5. Broadcast (handles Ledger, Keplr, EIP-712, gas, nonce, timeout, etc.) */
    const txHash = await msgBroadcaster.broadcast({
      msgs: msgExec,
      injectiveAddress: (await walletStrategy.getAddresses())[0],
    });

    console.log('Transaction hash:', txHash);

    return "txhash"
  } catch (error) {
    console.error('Contract execution error:', error);
    throw error;
  }
};
