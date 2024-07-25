import { useState, useEffect } from 'react';
import { useEthersSigner } from '../../utils/ethers';
import { BytesLike, ethers } from 'ethers';
import { abi } from '../../abi/SAFE_ABI';
import { testconfig, mainconfig } from '../../config';
import { getEthereumContractByChain } from '../../constants/contracts';
import { getChainId } from '@wagmi/core';
import { evmExecuteContractCall } from '../../services/evmServices.ts';
import { loadProposalData } from '../../utils/loadproposaldata';
import Modal from '../../Modals/Modal.tsx';

const APP_ENV = import.meta.env.VITE_APP_ENV;

const EVMExecuteProposals = () => {
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;
  const signer = useEthersSigner();
  const chainId = getChainId(config); // account, chainid, metamask
  const [proposal_data, setProposalData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const contractAddress = getEthereumContractByChain(chainId.toString());
  console.log('Chain id and contract address ', chainId, contractAddress);
  const [thres, setThresh] = useState<number>(0);
  let contract = new ethers.Contract(contractAddress, abi, signer);
  const buttonName = 'Execute Proposal';

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
    signatures: Array<BytesLike>;
    chain: string;
    status: string;
    remark: string;
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (proposal: any) => {
    setSelectedProposal(proposal);
    setOpen(true);
  };

  const handleExecute = async (proposal: Proposal) => {
    try {
      //calling contract
      await evmExecuteContractCall(signer, contractAddress, proposal);
    } catch (error) {
      console.error('Error in calling contract:', error);
    }
  };

  useEffect(() => {
    console.log('Current chain ID:', chainId);
    let address = contractAddress;
    console.log('Contract address:', address);
  }, [chainId]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const data = await loadProposalData();
        console.log('Fetched proposal data:', data);

        // Filter proposals with status "Passed"
        const filteredData = data.filter((proposal: any) => proposal.status === 'Passed');

        setProposalData(filteredData);
      } catch (error) {
        console.error('Error fetching proposal data:', error);
      }
    };
    fetchFilteredData();
  }, []);

  useEffect(() => {
    const getThreshold = async () => {
      let temp = await contract.getThreshold();
      setThresh(Number(temp));
      console.log(thres, 'thres');
    };
    getThreshold();
  });

  return (
    <div className="evm-manager-page">
      {!open ? (
        <div className="overflow-x-auto">
          {proposal_data.length > 0 ? (
            <table className="d-table rounded bg-[rgba(255,255,255,0.1)] mt-6">
              <thead>
                <tr>
                  <th>Proposal Hash</th>
                  <th className="w-96">Title</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {proposal_data.map((proposal, index) => (
                  <tr key={index}>
                    <td>{proposal.proposal}</td>
                    <td className="w-96">{proposal.remark}</td>
                    <td>{proposal.status}</td>
                    <td>
                      <button className="d-btn" onClick={() => handleExecute(proposal)}>
                        Execute proposal
                      </button>
                    </td>
                    <td>
                      <button className="d-btn" onClick={() => handleOpen(proposal)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No Approved proposals to execute</p>
          )}
        </div>
      ) : (
        <Modal
          isOpen={open}
          onClose={handleClose}
          handleApprove={handleExecute}
          thres={thres}
          proposal={selectedProposal}
          buttonName={buttonName}
        />
      )}
      {error && (
        <p className="text-white bg-red-500 border border-red-600 fixed top-32 right-1 w-fit p-2 h-10">{error}</p>
      )}
    </div>
  );
};

export default EVMExecuteProposals;
