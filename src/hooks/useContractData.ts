import { useChain } from '@cosmos-kit/react';
import { getCosmosContractByChain } from '../constants/contracts';
import { getKeplr } from '../utils/walletUtils';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { prependHttpsIfNeeded } from '../utils/chainUtils';

export const useContractData = (chainName: string) => {
  const { address, chain } = useChain(chainName);

  const getContractData = async (msgs: { [key: string]: Record<string, never> }) => {
    if (!address) {
      console.log('Wallet not connected. Please connect the wallet');
      return;
    }

    try {
      const rpc_url = chain.apis?.rpc && chain.apis?.rpc[0].address;
      if (!rpc_url) throw new Error('No chain rpcUrl found.');
      const rpcUrl = prependHttpsIfNeeded(rpc_url);

      const contractAddress = getCosmosContractByChain(chain.chain_name);
      if (!contractAddress) throw new Error('No contract address details found.');
      const chainId = chain.chain_id;
      const { offlineSigner } = await getKeplr(chainId);

      const client = await SigningCosmWasmClient.connectWithSigner(rpcUrl, offlineSigner);
      const result = await client.queryContractSmart(contractAddress, msgs);
      return result;
    } catch (e: any) {
      console.error(e);
      return;
    }
  };

  return { getContractData };
};
