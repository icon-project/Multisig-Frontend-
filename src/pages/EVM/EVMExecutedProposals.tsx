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

const EVMExecutedProposals = () => {
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

  const fetchFilteredData = async () => {
    try {
      const data = await loadProposalData();
      console.log('Fetched proposal data:', data);

      // Filter proposals with status "Passed"
      const filteredData = data.filter((proposal: any) => proposal.status === 'Executed');

      setProposalData(filteredData);
    } catch (error) {
      console.error('Error fetching proposal data:', error);
    }
  };

  useEffect(() => {
    console.log('Current chain ID:', chainId);
    let address = contractAddress;
    console.log('Contract address:', address);
  }, [chainId]);

  useEffect(() => {
    fetchFilteredData();
  }, []);

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

export default EVMExecutedProposals;
