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
import { Proposal } from '../../@types/CosmosProposalsTypes';

const CosmosApproveProposalslPage = () => {
  const { state } = useAppContext();
  const chainName = state.activeCosmosChain.chainName;
  const contractAddress = getCosmosContractByChain(chainName);
  const { address, isWalletConnected, connect } = useChain(chainName);
  const [proposalList, setProposalList] = useState<Proposal[]>([]);
  const { tx } = useTx(chainName);
  const { toast, ToastContainer } = useToast();
  const { getContractData } = useContractData(chainName);

  const handleInjectiveApprove = async (proposalId: number) => {
    const chainId = state.activeCosmosChain.chainId;
    if (!contractAddress) {
      console.log('No contract address found.');
      return;
    }
    const voteValue = 'yes';
    const txMsg = {
      vote: {
        proposal_id: proposalId,
        vote: voteValue,
      },
    };
    try {
      const res = await executeInjectiveContractCall(chainId, contractAddress, txMsg);
      if (res) {
        console.log('Approval Success. TxHash', res);
        toast(`Approval Success. TxHash: ${res}`, 'success');
      }
    } catch (err) {
      toast(`Approval Failed: ${err}`, 'error');
    }
  };

  const handleArchwayApprove = async (proposalId: number) => {
    const chainId = state.activeCosmosChain.chainId;
    if (!contractAddress) {
      console.log('No contract address found.');
      return;
    }
    const voteValue = 'yes';
    const txMsg = {
      vote: {
        proposal_id: Number(proposalId),
        vote: voteValue,
      },
    };
    try {
      const res = await executeArchwayContractCall(chainId, contractAddress, txMsg);
      if (res) {
        console.log('Transaction Success. TxHash', res);
        toast(`Approval Success. TxHash: ${res}`, 'success');
      }
    } catch (err) {
      toast(`Approval Failed: ${err}`, 'error');
    }
  };

  const handleApprove = async (proposalId: number) => {
    const voteValue = 'yes';
    const txMsg = {
      vote: {
        proposal_id: proposalId,
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

    try {
      const res = await tx([encodedMsg], {
        onSuccess: () => {
          console.log('Transaction Success!');
        },
      });
      if (res) {
        console.log('Transaction Success. TxHash', res);
        toast(`Approval Success. TxHash: ${res}`, 'success');
      }
    } catch (err) {
      toast(`Approval Failed: ${err}`, 'error');
    }
  };

  const handleApproveClick = (proposalId: number) => {
    if (!isWalletConnected) {
      connect();
      return;
    }
    const chain_name = state.activeCosmosChain.name;
    if (chain_name === 'injective') {
      handleInjectiveApprove(proposalId);
    } else if (chain_name === 'archway') {
      handleArchwayApprove(proposalId);
    } else {
      handleApprove(proposalId);
    }
  };

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

  const getProposals = async () => {
    const txMsg = {
      list_proposals: {},
    };
    const rpcUrl = Object.values(CosmosChains).filter((chain) => chain.chainName === chainName)[0].rpcUrl;
    const data = await getContractData(txMsg, rpcUrl);
    if (data?.proposals) {
      setProposalList(data.proposals);

      // const filteredProposals = data.proposals.filter((proposal: Proposal) => proposal.status === "open");
      // setProposalList(filteredProposals);
    }
  };

  useEffect(() => {
    if (address && chainName) {
      getProposals();
    }
  }, [address, chainName]);

  return (
    <div className="cosmos-approval-page w-full m-auto bg-[rgba(255,255,255,0.5)] p-4 rounded flex flex-col items-center">
      <div className="mt-4 w-full max-w-[1600px]">
        <CosmosProposalsTable
          proposals={proposalList}
          approveAction={handleApproveClick}
          executeAction={handleExecuteClick}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default CosmosApproveProposalslPage;
