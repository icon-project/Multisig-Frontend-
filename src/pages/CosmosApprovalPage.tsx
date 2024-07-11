import { useState } from 'react';
import { CosmosChains } from '../constants/chains';
import { executeContractCall } from '../utils/injectiveUtils';
import { CosmosContracts } from '../constants/contracts';

const CosmosApprovalPage = () => {
  const [proposalInput, setProposalInput] = useState('');
  const [txnHash, setTxnHash] = useState('');

  const handleSubmit = async () => {
    const contractAddress = CosmosContracts.injective;
    const chainId = CosmosChains.injective;
    const voteValue = 'yes';
    const txMsg = {
      vote: {
        proposal_id: proposalInput,
        vote: voteValue,
      },
    };
    const res = await executeContractCall(chainId, contractAddress, txMsg);
    if (res) {
      console.log('Transaction Success. TxHash', res);
      setTxnHash(res);
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg">Cosmos Approval</h3>
      <div className="approval-submit-section flex gap-2">
        <input
          value={proposalInput}
          onChange={(e) => setProposalInput(e.target.value)}
          placeholder="Proposal ID"
          className="bg-gray-200 p-2 rounded hover:outline-none focus:outline-none"
        />
        <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded font-bold">
          Approve Proposal
        </button>
      </div>
      {txnHash && <div>Transaction hash: {txnHash}</div>}
    </div>
  );
};

export default CosmosApprovalPage;
