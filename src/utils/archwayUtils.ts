import { CosmosChains } from '../constants/chains';
import { getKeplr } from './walletUtils';
import { SigningArchwayClient } from '@archwayhq/arch3.js';

export const executeArchwayContractCall = async (
  chainId: string,
  contractAddress: string,
  txMsg: any,
): Promise<string | undefined> => {
  try {
    const { key, offlineSigner } = await getKeplr(chainId);
    const rpcUrl = Object.values(CosmosChains).filter((chain) => chain.chainId === chainId)[0].rpcUrl;
    const walletAddress = key.bech32Address;
    const signingClient = await SigningArchwayClient.connectWithSigner(rpcUrl, offlineSigner);

    const txResponse = await signingClient.execute(walletAddress, contractAddress, txMsg, 'auto');
    console.log(txResponse);
    if (!txResponse.transactionHash) {
      throw new Error('No transaction hash!');
    }

    return txResponse.transactionHash;
  } catch (error) {
    console.log('ERROR:', error);
    throw error;
  }
};
