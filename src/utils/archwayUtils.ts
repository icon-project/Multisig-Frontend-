import { getKeplr } from './walletUtils';
import { SigningArchwayClient } from '@archwayhq/arch3.js';

const RPC_URL = 'https://rpc.constantine.archway.io:443'; // Update

export const executeArchwayContractCall = async (
  chainId: string,
  contractAddress: string,
  txMsg: any,
): Promise<string | undefined> => {
  try {
    const { key, offlineSigner } = await getKeplr(chainId);
    const walletAddress = key.bech32Address;
    const signingClient = await SigningArchwayClient.connectWithSigner(RPC_URL, offlineSigner);

    const txResponse = await signingClient.execute(walletAddress, contractAddress, txMsg, 'auto');
    console.log(txResponse);
    if (!txResponse.transactionHash) {
      throw new Error('No transaction hash!');
    }

    return txResponse.transactionHash;
  } catch (error) {
    console.log('ERROR:', error);
  }
};
