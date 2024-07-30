import { useParams } from 'react-router-dom';
import { Base64 } from 'js-base64';
import SpinningCircles from 'react-loading-icons/dist/esm/components/spinning-circles';
import { useChain } from '@cosmos-kit/react';
import { executeInjectiveContractCall } from '../../utils/injectiveUtils';
import { useAppContext } from '../../context/AppContext';
import { useEffect, useState } from 'react';
import { getCosmosContractByChain } from '../../constants/contracts';
import { useContractData } from '../../hooks/useContractData';
import { executeArchwayContractCall } from '../../utils/archwayUtils';
import useToast from '../../hooks/useToast';
import { CosmosChains } from '../../constants/chains';
import { Proposal, ProposalStatus } from '../../@types/CosmosProposalsTypes';

const CosmosProposalDetails = () => {
  const { id } = useParams();
  const { state } = useAppContext();
  const chainName = state.activeCosmosChain.chainName;
  const contractAddress = getCosmosContractByChain(chainName);
  const { address, isWalletConnected, connect } = useChain(chainName);
  const [proposals, setProposals] = useState<any>();
  const [proposal, setProposal] = useState<any>();
  const { getContractData } = useContractData(chainName);
  const [decodedData, setDecodedData] = useState<any>(null);
  const { toast, ToastContainer } = useToast();

  const getProposals = async (limit: number = 10, offset: number = 0) => {
    const txMsg = {
      list_proposals: {
        limit: limit,
        start_after: offset,
      },
    };
    const rpcUrl = Object.values(CosmosChains).filter((chain) => chain.chainName === chainName)[0].rpcUrl;
    const data = await getContractData(txMsg, rpcUrl);
    setProposals(data);
    if (data?.proposals) {
      const filteredProposals = data.proposals.filter((proposal: Proposal) => proposal.id === Number(id));
      setProposal(filteredProposals[0]);
    }
  };

  const decodeMessage = (msg: any) => {
    return JSON.stringify(JSON.parse(Base64.decode(msg)), null, 2);
  };
  // execution
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

  //approve
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
  useEffect(() => {
    getProposals();
    console.log('filtered by id ', proposal);
    console.log('all proposals', proposals);
    // console.log('proposal message', proposal.message);
  }, [id]);

  return (
    // <div>
    //   <div className=" pl-8 overflow-x-auto mx-auto shadow-lg shadow-blue-500/40 p-8 pt-0 w-[90%] mt-5 text-gray-800">
    // {loading ? <SpinningCircles fill="black" className="w-8 h-8 inline pl-3 fixed top-[100px] left-[300px]" /> : ''}

    //     <div className="flex justify-center items-center min-h-screen bg-gray-100">
    //       <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg">
    //         <h1 className="text-2xl font-bold mb-4">Proposal Details</h1>
    //         <div className="mb-4">
    //           <p>
    //             <strong>Proposal ID:</strong> {proposal.id}
    //           </p>
    //           <p>
    //             <strong>Title:</strong> {proposal.title}
    //           </p>

    //           <p>
    //             <strong>Proposer:</strong> {proposal.proposer}
    //           </p>

    //           <p>
    //             <strong>Status:</strong> {proposal.status}
    //           </p>

    //           <p>
    //             <strong>Expires At:</strong> {proposal.expiresAt}
    //           </p>
    //         </div>
    //         <hr className="my-4" />
    //         <h5 className="text-xl font-semibold mb-2">Messages:</h5>
    //         {proposal.msgs.map((message, index) => (
    //           <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
    //             <>
    //               <p>
    //                 <strong>Contract Address:</strong> {message.wasm.execute.contract_addr}
    //               </p>
    //               <p>
    //                 <strong>Message:</strong>
    //               </p>
    //               <pre className="bg-gray-200 p-2 rounded">{decodeMessage(message.wasm.execute.msg)}</pre>
    //             </>
    //           </div>
    //         ))}
    //         {proposal.status === 'open' && (
    //           <button
    //             // onClick={handleApproveClick}
    //             className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 float-right ml-2"
    //           >
    //             Approve
    //           </button>
    //         )}
    //         {proposal.status === 'passed' && (
    //           <button
    //             // onClick={handleExecute}
    //             className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 float-right ml-2"
    //           >
    //             Execute
    //           </button>
    //         )}
    //       </div>
    //     </div>
    //     <ToastContainer />
    //   </div>
    // </div>
    <div>id: {id}</div>
  );
};

export default CosmosProposalDetails;
