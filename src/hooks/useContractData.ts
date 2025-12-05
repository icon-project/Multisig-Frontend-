import { useChain } from '@cosmos-kit/react';
import { getCosmosContractByChain } from '../constants/contracts';
import { getKeplr } from '../utils/walletUtils';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { prependHttpsIfNeeded } from '../utils/chainUtils';

export const useContractData = (chainName: string) => {
  const { address, chain, getCosmWasmClient } = useChain(chainName);

  const getContractData = async (msgs: { [key: string]: any }, customRpcUrl: string = '') => {

    try {
      const contractAddress = getCosmosContractByChain(chain.chain_name);
      if (!contractAddress) throw new Error('No contract address details found.');

      let client;
      if (address) {
        let rpc_url: string;
        if (customRpcUrl) {
          rpc_url = customRpcUrl;
        } else {
          rpc_url =
            (chain.apis?.rpc &&
              chain.apis?.rpc.length > 0 &&
              chain.apis.rpc[Math.floor(Math.random() * chain.apis.rpc.length)].address) ||
            '';
        }
        if (!rpc_url) throw new Error('No chain rpcUrl found.');
        const rpcUrl = prependHttpsIfNeeded(rpc_url);

        const chainId = chain.chain_id;
        const { offlineSigner } = await getKeplr(chainId);
        client = await SigningCosmWasmClient.connectWithSigner(rpcUrl, offlineSigner);
      } else {
        client = await getCosmWasmClient();
      }

      const result = await client.queryContractSmart(contractAddress, msgs);
      return result;
    } catch (e: any) {
      console.error(e);
      return;
    }
  };

  return { getContractData };
};
