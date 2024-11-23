import { useParams } from 'react-router-dom';
import { Base64 } from 'js-base64';
import { useChain } from '@cosmos-kit/react';
import { executeInjectiveContractCall } from '../../utils/injectiveUtils';
import { useAppContext } from '../../context/AppContext';
import { useEffect, useState } from 'react';
import { getCosmosContractByChain } from '../../constants/contracts';
import { useContractData } from '../../hooks/useContractData';
import { executeArchwayContractCall } from '../../utils/archwayUtils';
import useToast from '../../hooks/useToast';
import { CosmosChains } from '../../constants/chains';
import { Proposal, WasmExecuteMsg, WasmMigrateMsg } from '../../@types/CosmosProposalsTypes';
import { useTx } from '../../hooks/useTx';
import SpinningCircles from 'react-loading-icons/dist/esm/components/spinning-circles';
import { ActionTypes } from '../../context/ActionTypes';

const CosmosProposalDetails = () => {
  const { id, proposalChainName } = useParams();
  const { state, dispatch } = useAppContext();
  const chainName = state.activeCosmosChain.chainName;
  const { tx } = useTx(chainName);
  const contractAddress = getCosmosContractByChain(chainName);
  const { address, isWalletConnected, connect } = useChain(chainName);
  const [proposal, setProposal] = useState<Proposal>();
  const { getContractData } = useContractData(chainName);
  const { toast, ToastContainer } = useToast();
  const [loading, setLoading] = useState(false);

  const getProposalDetails = async (id: number) => {
    setLoading(true);
    const txMsg = {
      proposal: {
        proposal_id: id,
      },
    };
    const rpcUrl = Object.values(CosmosChains).filter((chain) => chain.chainName === chainName)[0].rpcUrl;
    const data = await getContractData(txMsg, rpcUrl);
    setProposal(data);
    setLoading(false);
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
        proposal_id: String(proposalId),
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

  const handleChainSwitch = async () => {
    const proposalChain = Object.values(CosmosChains).find((chain) => chain.chainName === proposalChainName);
    if (proposalChain) {
      dispatch({ type: ActionTypes.SET_ACTIVE_COSMOS_CHAIN, payload: proposalChain });
    }
  };

  useEffect(() => {
    if (id && chainName === proposalChainName) {
      getProposalDetails(parseInt(id));
    } else {
      setProposal(undefined);
    }
  }, [id, chainName, proposalChainName]);

  return (
    <div className="proposal-details-container w-full h-full relative">
      {chainName != proposalChainName && (
        <div className="bg-red-500 text-white rounded p-1 mb-2 text-center">
          You are currently in wrong chain: {chainName}.{' '}
          <button onClick={handleChainSwitch} className="underline font-bold">
            Switch to {proposalChainName}
          </button>
          ?
        </div>
      )}

      {loading ? (
        <div className="loading-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <SpinningCircles fill="black" className="w-[64px] h-[64px]" />
        </div>
      ) : (
        <div className="proposal-details text-gray-800 bg-[rgba(255,255,255,0.5)] shadow-sm w-full p-10 rounded-lg">
          {proposal ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Proposal Details</h1>
              <div className="mb-4">
                <p>
                  <strong>Proposal ID:</strong> {id}
                </p>
                <p>
                  <strong>Title:</strong> {proposal.title}
                </p>

                <p>
                  <strong>Proposer:</strong> {proposal.proposer}
                </p>

                <p>
                  <strong>Status:</strong> {proposal.status}
                </p>

                <p>
                  <strong>Expires At:</strong> {new Date(Number(proposal.expires.at_time) / 100000).toLocaleString()}
                </p>
              </div>
              <hr className="my-4" />
              <div className="message-section">
                <h5 className="text-xl font-semibold mb-2">Messages:</h5>
                {proposal.msgs.map((message, index) => (
                  <div key={index} className="mb-4 p-4 rounded-lg ">
                    <p>
                      <strong>Contract Address:</strong>{' '}
                      {(message.wasm as WasmExecuteMsg).execute?.contract_addr ||
                        (message.wasm as WasmMigrateMsg).migrate?.contract_addr}
                    </p>
                    <p>
                      {(message.wasm as WasmMigrateMsg).migrate ? (
                        <>
                          <strong>Message Type:</strong> Migrate
                        </>
                      ) : (message.wasm as WasmExecuteMsg).execute ? (
                        <>
                          <strong>Message Type:</strong> Execute
                        </>
                      ) : (
                        ''
                      )}
                    </p>
                    <p>
                      {(message.wasm as WasmMigrateMsg).migrate ? (
                        <>
                          <strong>New Code ID:</strong> {(message.wasm as WasmMigrateMsg).migrate.new_code_id}
                        </>
                      ) : (
                        ''
                      )}
                    </p>
                    <p className="my-2">
                      <strong>Message:</strong>
                    </p>
                    <pre className="p-2 rounded bg-[rgba(255,255,255,0.9)]">
                      {(message.wasm as WasmExecuteMsg).execute?.msg || (message.wasm as WasmMigrateMsg).migrate?.msg
                        ? decodeMessage(
                            (message.wasm as WasmExecuteMsg).execute?.msg ||
                              (message.wasm as WasmMigrateMsg).migrate?.msg,
                          )
                        : ''}
                    </pre>
                  </div>
                ))}
              </div>
              <div className="threshold-section">
                <h5 className="text-xl font-semibold mb-2">Threshold:</h5>
                <div className="mb-4 p-4 rounded-lg ">
                  <pre className="p-2 rounded bg-[rgba(255,255,255,0.9)]">
                    {JSON.stringify(proposal.threshold, null, 2)}
                  </pre>
                </div>
              </div>
              {proposal.status === 'open' && (
                <button
                  onClick={() => handleApproveClick(Number(proposal.id))}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg  ml-2"
                >
                  Approve
                </button>
              )}
              {proposal.status === 'passed' && (
                <button
                  onClick={() => handleExecuteClick(Number(proposal.id))}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Execute
                </button>
              )}
            </>
          ) : (
            <div className="text-center">
              No proposal with id <span className="font-bold">{id}</span> in chain{' '}
              <span className="font-bold">{chainName}</span>
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CosmosProposalDetails;
