import { getKeplr } from './walletUtils';
import { TxRaw, CosmosTxV1Beta1Tx, BroadcastModeKeplr, TxRestClient } from '@injectivelabs/sdk-ts';
import { TransactionException } from '@injectivelabs/exceptions';
import {
  MsgExecuteContract,
  BaseAccount,
  ChainRestAuthApi,
  createTransaction,
  ChainRestTendermintApi,
  getTxRawFromTxRawOrDirectSignResponse,
} from '@injectivelabs/sdk-ts';
import { getStdFee, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from '@injectivelabs/utils';
// import { ChainId } from '@injectivelabs/ts-types';
import { BigNumberInBase } from '@injectivelabs/utils';
import { SignDoc } from '@keplr-wallet/types';
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';

const ENV = import.meta.env.VITE_APP_ENV;
const NetworkType = ENV === 'prod' ? Network.Mainnet : Network.Testnet;

const broadcastTx = async (chainId: string, txRaw: TxRaw) => {
  const { offlineSigner } = await getKeplr(chainId);
  const result = await offlineSigner.keplr.sendTx(
    chainId,
    CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
    BroadcastModeKeplr.Sync,
  );

  if (!result || result.length === 0) {
    throw new TransactionException(new Error('Transaction failed to be broadcasted'), { contextModule: 'Keplr' });
  }

  return Buffer.from(result).toString('hex');
};

export const executeInjectiveContractCall = async (
  chainId: string,
  contractAddress: string,
  txMsg: any,
): Promise<string | undefined> => {
  try {
    const { key, offlineSigner } = await getKeplr(chainId);
    const pubKey = Buffer.from(key.pubKey).toString('base64');
    const injectiveAddress = key.bech32Address;
    const endpoints = getNetworkEndpoints(NetworkType);
    const restEndpoint = endpoints.rest;

    /** Account Details **/
    const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(injectiveAddress);
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
    const latestHeight = latestBlock.header.height;
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(DEFAULT_BLOCK_TIMEOUT_HEIGHT);

    /** Preparing the transaction */
    const msg = MsgExecuteContract.fromJSON({
      sender: injectiveAddress,
      contractAddress: contractAddress,
    //   contract: contractAddress,
      msg: txMsg,
    });

    /** Prepare the Transaction **/
    const { signDoc } = createTransaction({
      message: msg,
      memo: '',
      fee: getStdFee({}),
      pubKey: pubKey,
      sequence: baseAccount.sequence,
      timeoutHeight: timeoutHeight.toNumber(),
      accountNumber: baseAccount.accountNumber,
      chainId: chainId,
    });

    const directSignResponse = await offlineSigner.signDirect(injectiveAddress, signDoc as unknown as SignDoc);
    const txRaw = getTxRawFromTxRawOrDirectSignResponse(directSignResponse);
    const txHash = await broadcastTx(chainId, txRaw);
    const response = await new TxRestClient(restEndpoint).fetchTxPoll(txHash);
    console.log(response);
    return response.txHash;
  } catch (error) {
    console.log('ERROR:', error);
    throw error;
  }
};
