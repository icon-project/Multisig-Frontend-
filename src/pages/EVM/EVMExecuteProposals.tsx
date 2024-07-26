import { useState, useEffect } from 'react';
import { useEthersSigner } from '../../utils/ethers';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { abi } from '../../abi/SAFE_ABI';
import useToast from '../../hooks/useToast';
import { testconfig, mainconfig } from '../../config';
import { getEthereumContractByChain } from '../../constants/contracts';
import { getChainId } from '@wagmi/core';
import { evmExecuteContractCall } from '../../services/evmServices.ts';
import { loadProposalData } from '../../utils/loadproposaldata';
import SpinningCircles from 'react-loading-icons/dist/esm/components/spinning-circles';

const APP_ENV = import.meta.env.VITE_APP_ENV;

const EVMExecuteProposals = () => {
  const [loading, setLoading] = useState(false);
  const { toast, ToastContainer } = useToast();
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;
  const signer = useEthersSigner();
  const chainId = getChainId(config); // account, chainid, metamask
  const [proposal_data, setProposalData] = useState<any[]>([]);
  const contractAddress = getEthereumContractByChain(chainId.toString());
  console.log('Chain id and contract address ', chainId, contractAddress);
  const [thres, setThresh] = useState<number>(0);
  let contract = new ethers.Contract(contractAddress, abi, signer);

  // type Proposal = {
  //   proposal: string;
  //   to: string;
  //   value: number;
  //   data: string;
  //   operation: number;
  //   baseGas: number;
  //   gasPrice: number;
  //   gasToken: string;
  //   safeTxGas: number;
  //   refundReceiver: string;
  //   nonce: bigint;
  //   execute: boolean;
  //   signatures: Array<BytesLike>;
  //   chain: string;
  //   status: string;
  //   remark: string;
  // };
  // const handleClose = () => {
  //   setOpen(false);
  // };
  // const handleOpen = (proposal: any) => {
  //   setSelectedProposal(proposal);
  //   setOpen(true);
  // };

  const handleExecute = async (proposal: any) => {
    setLoading(true);
    try {
      //calling contract
      await evmExecuteContractCall(signer, contractAddress, proposal);
      toast(`Proposal executed successfully}`, 'success');
      setLoading(true);
    } catch (error) {
      console.error('Error in calling contract:', error);
      toast(`Error: ${error}`, 'error');
      setLoading(false);
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
      <div className="overflow-x-auto">
        {loading ? <SpinningCircles fill="black" className="w-8 h-8 inline pl-3 fixed top-[100px] left-[300px]" /> : ''}

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
                    <Link to={`/evm/proposals/${proposal.proposal}`}>
                      <button className="d-btn">Details</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No Approved proposals to execute</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EVMExecuteProposals;
