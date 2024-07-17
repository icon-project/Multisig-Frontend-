import { useState } from 'react';
import { getCosmosContractByChain } from '../constants/contracts';
import { executeInjectiveContractCall } from '../utils/injectiveUtils';
import { useChain } from '@cosmos-kit/react';
import { useTx } from '../hooks/useTx';
import CosmosWalletWidget from '../components/CosmosWalletWidget';
import { useAppContext } from '../context/AppContext';

const CosmosApprovalPage = () => {
  const { state } = useAppContext();
  const chainName = state.activeCosmosChain.chainName;
  const contractAddress = getCosmosContractByChain(chainName);
  const { address, isWalletConnected, connect } = useChain(chainName);
  const [proposalInput, setProposalInput] = useState('');
  const [txnHash, setTxnHash] = useState('');
  const { tx } = useTx(chainName);

  const handleInjectiveApprove = async () => {
    const chainId = state.activeCosmosChain.chainId;
    if (!contractAddress) {
      console.log('No contract address found.');
      return;
    }
    const voteValue = 'yes';
    const txMsg = {
      vote: {
        proposal_id: proposalInput,
        vote: voteValue,
      },
    };
    const res = await executeInjectiveContractCall(chainId, contractAddress, txMsg);
    if (res) {
      console.log('Transaction Success. TxHash', res);
      setTxnHash(res);
    }
  };

  const handleApprove = async () => {
    const voteValue = 'yes';
    const txMsg = {
      vote: {
        proposal_id: Number(proposalInput),
        vote: voteValue,
      },
    };

    const encodedMsg = {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: {
        sender: address,
        contract: contractAddress,
        msg: Buffer.from(JSON.stringify(txMsg)),
      },
    };

    const res = await tx([encodedMsg], {
      onSuccess: () => {
        console.log('Transaction Success!');
      },
    });
    if (res) {
      console.log('Transaction Success. TxHash', res);
      setTxnHash(res);
    }
  };

  const handleApproveClick = () => {
    if (!isWalletConnected) {
      connect();
      return;
    }
    const chain_name = state.activeCosmosChain.name;
    if (chain_name === 'injective') {
      handleInjectiveApprove();
    } else {
      handleApprove();
    }
  };

  return (
    <div className="cosmos-approval-page max-w-[600px] w-full m-auto bg-[rgba(255,255,255,0.5)] p-4 rounded flex flex-col items-center">
      <CosmosWalletWidget />

      <h3 className="font-bold text-lg mt-4 mb-3">Cosmos Approval</h3>
      <div className="approval-submit-section flex gap-2">
        <input
          value={proposalInput}
          onChange={(e) => setProposalInput(e.target.value)}
          placeholder="Proposal ID"
          className="bg-gray-200 p-2 rounded hover:outline-none focus:outline-none"
        />
        <button onClick={handleApproveClick} className="bg-blue-600 text-white p-2 rounded font-bold">
          Approve Proposal
        </button>
      </div>
      {txnHash && <div>Transaction hash: {txnHash}</div>}
    </div>
  );
};

export default CosmosApprovalPage;
