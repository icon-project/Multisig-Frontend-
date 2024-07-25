import { BytesLike } from 'ethers';
import { ethers } from 'ethers';
import { abi } from '../abi/SAFE_ABI';

type Proposal = {
  proposal: string;
  to: string;
  value: number;
  data: string;
  operation: number;
  baseGas: number;
  gasPrice: number;
  gasToken: string;
  safeTxGas: number;
  refundReceiver: string;
  nonce: bigint;
  execute: boolean;
  abi: [];
  signatures: Array<BytesLike>;
  chain: string;
  remark: string;
};

export const createProposalData = async (
  signer: any,
  contractAddress: any,
  data: any,
  chain: any,
  functionAbi: string[],
  remark: string,
) => {
  try {
    if (!signer) throw Error('Connect Wallet first');

    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log('using proposal data service');
    // let contract = await getContract(contractAddress);

    const nonce = await contract.nonce();
    console.log(nonce.toString());
    console.log(data, 'input data');
    const txHash = await contract.getTransactionHash(
      data.to,
      data.value,
      data.data,
      data.operation,
      data.safeTxGas,
      data.baseGas,
      data.gasPrice,
      data.gasToken,
      data.refundReceiver,
      nonce,
    );
    console.log(txHash);
    const signatures: BytesLike[] = [];
    const proposalData = {
      proposal: txHash,
      ...data,
      nonce: nonce.toString(),
      execute: false,
      signatures: signatures,
      status: 'Open',
      chain: chain.toString(),
      abi: functionAbi,

      remark: remark,
    };
    return proposalData;
  } catch (e) {
    console.log('Error in creating proposal data', e);
    throw e;
  }
};

export const evmExecuteContractCall = async (signer: any, contractAddress: string, proposal: any) => {
  try {
    if (!signer) throw Error('Connect Wallet first');

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const encodedSignatures = ethers.utils.hexConcat(proposal.signatures);

    const tx = await contract.executeTransaction(
      proposal.to,
      proposal.value,
      proposal.data,
      proposal.operation,
      proposal.safeTxGas,
      proposal.baseGas,
      proposal.gasPrice,
      proposal.gasToken,
      proposal.refundReceiver,
      encodedSignatures,
      proposal.remark,
    );
    await tx.wait();

    //to call contract
  } catch (e) {
    console.log('Error in contract execution ', e);
    throw e;
  }
};

export const evmApproveContractCall = async (signer: any, contractAddress: string, hash: Proposal | string) => {
  try {
    let contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.approveHash(hash);
    await tx.wait();
  } catch (e) {
    console.log('Error:', e);
    throw e;
  }
};
