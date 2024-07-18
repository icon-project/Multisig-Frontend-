import { useChain } from '@cosmos-kit/react';
import { StdFee } from '@cosmjs/stargate';
import { coins } from '@cosmjs/proto-signing';
import { Dec, IntPretty } from '@keplr-wallet/unit';
import { getCosmosContractByChain } from '../constants/contracts';
import { getKeplr } from '../utils/walletUtils';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { prependHttpsIfNeeded } from '../utils/chainUtils';

interface Msg {
  typeUrl: string;
  value: any;
}

interface TxOptions {
  fee?: StdFee | null;
  onSuccess?: () => void;
}

export enum TxStatus {
  Failed = 'Transaction Failed',
  Successful = 'Transaction Successful',
  Broadcasting = 'Transaction Broadcasting',
}

export const useTx = (chainName: string) => {
  const { address, chain } = useChain(chainName);

  const tx = async (msgs: Msg[], options: TxOptions) => {
    if (!address) {
      console.log('Wallet not connected. Please connect the wallet');
      return;
    }

    try {
      let fee: StdFee;
      const rpc_url = chain.apis?.rpc && chain.apis?.rpc[0].address;
      if (!rpc_url) throw new Error('No chain rpcUrl found.');
      const rpcUrl = prependHttpsIfNeeded(rpc_url);

      const contractAddress = getCosmosContractByChain(chain.chain_name);
      if (!contractAddress) throw new Error('No contract address details found.');
      const chainId = chain.chain_id;
      const { offlineSigner } = await getKeplr(chainId);

      const client = await SigningCosmWasmClient.connectWithSigner(rpcUrl, offlineSigner);

      if (options?.fee) {
        fee = options.fee;
      } else {
        const gasEstimated = await client.simulate(address, msgs, '');

        const chainFeeDetails = chain?.fees?.fee_tokens[0];
        fee = {
          amount: coins(chainFeeDetails?.average_gas_price || 0, chainFeeDetails?.denom || ''),
          gas: new IntPretty(new Dec(gasEstimated).mul(new Dec(1.3))).maxDecimals(0).locale(false).toString(),
        };
      }

      const result = await client.execute(address, contractAddress, msgs, fee, '');
      console.log('Transaction result:', result);

      if (result.transactionHash && options.onSuccess) {
        options.onSuccess();
      }
      return result.transactionHash;
    } catch (e: any) {
      console.error(e);
      return;
    }
  };

  return { tx };
};
