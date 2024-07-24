import { getCosmosContractByChain } from '../../constants/contracts';
import { executeInjectiveContractCall } from '../../utils/injectiveUtils';
import { useChain } from '@cosmos-kit/react';
import { useTx } from '../../hooks/useTx';
import { useAppContext } from '../../context/AppContext';
import CosmosProposalsTable from '../../components/CosmosProposalsTable';
import useToast from '../../hooks/useToast';
import { executeArchwayContractCall } from '../../utils/archwayUtils';
import { useEffect, useState } from 'react';
import { CosmosChains } from '../../constants/chains';
import { useContractData } from '../../hooks/useContractData';
import { Proposal, ProposalStatus } from '../../@types/CosmosProposalsTypes';

const CosmosExecuteProposalslPage = () => {
  const { state } = useAppContext();
  const chainName = state.activeCosmosChain.chainName;
  const contractAddress = getCosmosContractByChain(chainName);
  const { address, isWalletConnected, connect } = useChain(chainName);
  const [proposalList, setProposalList] = useState<Proposal[]>([]);
  const { tx } = useTx(chainName);
  const { toast, ToastContainer } = useToast();
  const { getContractData } = useContractData(chainName);
  const itemsPerPageLimit = 10;
  const [itemsListOffset, setItemsListOffset] = useState(0);

  const handleInjectiveExecute = async (proposalId: number) => {
    const chainId = state.activeCosmosChain.chainId;
    if (!contractAddress) {
      console.log('No contract address found.');
      return;
    }
    const txMsg = {
      execute: {
        proposal_id: proposalId,
      },
    };

    try {
      const res = await executeInjectiveContractCall(chainId, contractAddress, txMsg);
      if (res) {
        console.log('Transaction Success. TxHash', res);
        toast(`Execute Success. TxHash: ${res}`, 'success');
      }
    } catch (err) {
      toast(`Execute Failed: ${err}`, 'error');
    }
  };

  const handleArchwayExecute = async (proposalId: number) => {
    const chainId = state.activeCosmosChain.chainId;
    if (!contractAddress) {
      console.log('No contract address found.');
      return;
    }
    const txMsg = {
      execute: {
        proposal_id: proposalId,
      },
    };

    try {
      const res = await executeArchwayContractCall(chainId, contractAddress, txMsg);
      if (res) {
        console.log('Transaction Success. TxHash', res);
        toast(`Execute Success. TxHash: ${res}`, 'success');
      }
    } catch (err) {
      toast(`Execute Failed: ${err}`, 'error');
    }
  };

  const handleExecute = async (proposalId: number) => {
    const txMsg = {
      execute: {
        proposal_id: proposalId,
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

    try {
      const res = await tx([encodedMsg], {
        onSuccess: () => {
          console.log('Transaction Success!');
        },
      });
      if (res) {
        console.log('Transaction Success. TxHash', res);
        toast(`Execute Success. TxHash: ${res}`, 'success');
      }
    } catch (err) {
      toast(`Execute Failed: ${err}`, 'error');
    }
  };

  const handleExecuteClick = (proposalId: number) => {
    if (!isWalletConnected) {
      connect();
      return;
    }
    const chain_name = state.activeCosmosChain.name;
    if (chain_name === 'injective') {
      handleInjectiveExecute(proposalId);
    } else if (chain_name === 'archway') {
      handleArchwayExecute(proposalId);
    } else {
      handleExecute(proposalId);
    }
  };

  const getProposals = async (limit: number = 10, offset: number = 0) => {
    const txMsg = {
      list_proposals: {
        limit: limit,
        start_after: offset,
      },
    };
    const rpcUrl = Object.values(CosmosChains).filter((chain) => chain.chainName === chainName)[0].rpcUrl;
    const data = await getContractData(txMsg, rpcUrl);
    if (data?.proposals) {
      const filteredProposals = data.proposals.filter(
        (proposal: Proposal) => proposal.status === ProposalStatus.passed,
      );
      setProposalList(filteredProposals);
    }
  };

  const handlePaginationChanges = (offset: number) => {
    setItemsListOffset(offset);
  };

  useEffect(() => {
    if (address && chainName && itemsListOffset >= 0) {
      getProposals(itemsPerPageLimit, itemsListOffset);
    }
  }, [address, chainName, itemsListOffset]);

  return (
    <div className="cosmos-approval-page w-full m-auto bg-[rgba(255,255,255,0.5)] p-4 rounded flex flex-col items-center">
      <div className="mt-4 w-full max-w-[1600px]">
        <CosmosProposalsTable
          proposals={proposalList}
          limit={itemsPerPageLimit}
          offset={itemsListOffset}
          handleOffsetChange={handlePaginationChanges}
          executeAction={handleExecuteClick}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default CosmosExecuteProposalslPage;
