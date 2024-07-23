import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getCosmosContractByChain, getCosmosMultiSigMemberContractByChain } from '../../constants/contracts';
import useToast from '../../hooks/useToast';
import { CosmosChains } from '../../constants/chains';
import { archwayExecuteContractUpgrade, archwayExecuteMemberManagement } from '../../services/archwayServices';

const ProposalTypes = {
  MemberManagement: 'member-management',
  ContractUpgrade: 'contract-upgrade',
};

const CosmosCreateProposalPage = () => {
  const [proposalType, setProposalType] = useState(ProposalTypes.MemberManagement);
  const [newThreshold, setNewThreshold] = useState('');
  const [upgradingContractAddress, setUpgradingContractAddress] = useState('');
  const [newCodeId, setNewCodeId] = useState('');
  const [membersToAdd, setMembersToAdd] = useState('');
  const [membersToRemove, setMembersToRemove] = useState('');
  const [membersToAddList, setMembersToAddList] = useState<string[]>([]);
  const [membersToRemoveList, setMembersToRemoveList] = useState<string[]>([]);
  const { state } = useAppContext();
  const { toast, ToastContainer } = useToast();

  const handleAddMember = () => {
    if (membersToAdd.trim() !== '') {
      setMembersToAddList([...membersToAddList, membersToAdd.trim()]);
      setMembersToAdd('');
    }
  };

  const handleRemoveMember = () => {
    if (membersToRemove.trim() !== '') {
      setMembersToRemoveList([...membersToRemoveList, membersToRemove.trim()]);
      setMembersToRemove('');
    }
  };

  const handleMemberMgmtProposal = async () => {
    const chainId = state.activeCosmosChain.chainId;
    const chainName = state.activeCosmosChain.chainName;
    const contractAddress = getCosmosContractByChain(chainName);
    const multiSigMemberContract = getCosmosMultiSigMemberContractByChain(chainName);
    if (!contractAddress || !multiSigMemberContract) {
      console.log('No contract address or multi-sig member contract address found.');
      return;
    }

    try {
      let res;
      const chain_name = state.activeCosmosChain.name;
      if (chain_name === CosmosChains.archway.name) {
        res = await archwayExecuteMemberManagement(
          chainId,
          contractAddress,
          multiSigMemberContract,
          'Member management and Threshold updates',
          'Add/Remove Members and Update Threshold',
          Number(newThreshold),
          membersToAddList,
          membersToRemoveList,
        );
      }
      if (res) {
        console.log('Transaction Success. TxHash', res);
        toast(`Execute Success. TxHash: ${res}`, 'success');
      }
    } catch (err) {
      toast(`Execute Failed: ${err}`, 'error');
    }
  };

  const handleUpgradeContractProposal = async () => {
    const chainId = state.activeCosmosChain.chainId;
    const chainName = state.activeCosmosChain.chainName;
    const contractAddress = getCosmosContractByChain(chainName);
    const multiSigMemberContract = getCosmosMultiSigMemberContractByChain(chainName);
    if (!contractAddress || !multiSigMemberContract) {
      console.log('No contract address or multi-sig member contract address found.');
      return;
    }

    try {
      let res;
      const chain_name = state.activeCosmosChain.name;
      if (chain_name === CosmosChains.archway.name) {
        res = await archwayExecuteContractUpgrade(
          chainId,
          contractAddress,
          'Contract upgrade',
          'Upgrade Contract',
          upgradingContractAddress,
          Number(newCodeId),
        );
      }
      if (res) {
        console.log('Transaction Success. TxHash', res);
        toast(`Execute Success. TxHash: ${res}`, 'success');
      }
    } catch (err) {
      toast(`Execute Failed: ${err}`, 'error');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission
    console.log({
      proposalType,
      newThreshold,
      upgradingContractAddress,
      newCodeId,
      membersToAddList,
      membersToRemoveList,
    });

    if (proposalType === ProposalTypes.MemberManagement) {
      handleMemberMgmtProposal();
    } else {
      handleUpgradeContractProposal();
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-10">
      <div className="bg-gray-50 shadow-lg rounded-lg w-4/5 h-4/5 p-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-5">Create Proposal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="proposalType" className="block text-sm font-medium text-gray-700">
              Proposal Type
            </label>
            <select
              id="proposalType"
              value={proposalType}
              onChange={(e) => setProposalType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value={ProposalTypes.MemberManagement}>Member Management Proposal</option>
              <option value={ProposalTypes.ContractUpgrade}>Contract Upgrade</option>
            </select>
          </div>
          <hr />
          {proposalType === ProposalTypes.MemberManagement && (
            <>
              <div className="mb-4">
                <label htmlFor="membersToAdd" className="block text-sm font-medium text-gray-700">
                  Members to Add
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="membersToAdd"
                    placeholder="Enter member address"
                    value={membersToAdd}
                    onChange={(e) => setMembersToAdd(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="ml-2 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  >
                    +
                  </button>
                </div>
                <ul className="mt-2 list-disc list-inside">
                  {membersToAddList.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <label htmlFor="membersToRemove" className="block text-sm font-medium text-gray-700">
                  Members to Remove
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="membersToRemove"
                    placeholder="Enter member address"
                    value={membersToRemove}
                    onChange={(e) => setMembersToRemove(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveMember}
                    className="ml-2 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  >
                    +
                  </button>
                </div>
                <ul className="mt-2 list-disc list-inside">
                  {membersToRemoveList.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <label htmlFor="newThreshold" className="block text-sm font-medium text-gray-700">
                  New Threshold
                </label>
                <input
                  type="text"
                  id="newThreshold"
                  placeholder="Enter new threshold"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
            </>
          )}

          {proposalType === ProposalTypes.ContractUpgrade && (
            <>
              <div className="mb-4">
                <label htmlFor="upgradingContractAddress" className="block text-sm font-medium text-gray-700">
                  Contract Address
                </label>
                <input
                  type="text"
                  id="upgradingContractAddress"
                  placeholder="Enter contract address"
                  value={upgradingContractAddress}
                  onChange={(e) => setUpgradingContractAddress(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newCodeId" className="block text-sm font-medium text-gray-700">
                  New Code ID
                </label>
                <input
                  type="text"
                  id="newCodeId"
                  placeholder="Enter new code ID"
                  value={newCodeId}
                  onChange={(e) => setNewCodeId(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
            </>
          )}
          <div className="flex justify-end">
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-500">
              Submit Proposal
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CosmosCreateProposalPage;
