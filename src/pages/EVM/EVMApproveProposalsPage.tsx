import { useState, useEffect } from 'react';
import { useEthersSigner } from '../../utils/ethers';
import { ethers } from 'ethers';
import { abi } from '../../abi/SAFE_ABI';
import { testconfig, mainconfig } from '../../config';
import { getEthereumContractByChain } from '../../constants/contracts';
import { getChainId } from '@wagmi/core';
import { loadProposalData } from '../../utils/loadproposaldata';

const APP_ENV = import.meta.env.VITE_APP_ENV;

const EVMApproveProposalsPage = () => {
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;
  const signer = useEthersSigner();
  const chainId = getChainId(config); // account, chainid, metamask
  const [proposal_data, setProposalData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const contractAddress = getEthereumContractByChain(chainId.toString());
  console.log('Chain id and contract address ', chainId, contractAddress);

  const handleSubmit = async (hash: string) => {
    if (!signer) {
      console.error('Signer is undefined. Check initialization.');
      setError('Connect wallet first');

      setTimeout(() => {
        setError('');
      }, 4000);
      return;
    }

    console.log('Signer:', signer);

    try {
      let contract = new ethers.Contract(contractAddress, abi, signer);
      // const bytes32proposal = ethers.utils.formatBytes32String(proposalId);
      console.log(contract, 'contracts');

      const tx = await contract.approveHash(hash);

      // Wait for the transaction to be mined
      await tx.wait();
      console.log('Transaction confirmed:', tx.hash);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log('Current chain ID:', chainId);
    let address = contractAddress;
    console.log('Contract address:', address);
  }, [chainId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadProposalData();
        console.log('Fetched proposal data:', data);
        setProposalData(data);
      } catch (error) {
        console.error('Error fetching proposal data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="evm-manager-page">
      <div>
        <table className="d-table rounded bg-[rgba(255,255,255,0.1)] w-[90%] m-auto mt-6">
          <thead>
            <tr>
              <th>Title </th>
              <th>Proposal </th>

              <th>Approve</th>
              <th>Execute</th>
            </tr>
          </thead>
          <tbody>
            {proposal_data.length > 0 ? (
              proposal_data.map((proposal, index) => (
                <tr key={index} className="">
                  <td className="">{proposal.remark}</td>
                  <td className=" ">{proposal.proposal}</td>
                  <td>
                    <button
                      className="d-btn"
                      onClick={() => {
                        handleSubmit(proposal.proposal);
                      }}
                    >
                      Approve proposal
                    </button>
                  </td>
                  <td>
                    <div className="pl-3">
                      <button
                        className="d-btn"
                        onClick={() => {
                          handleSubmit(proposal.proposal);
                        }}
                      >
                        Execute proposal
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center">No proposals</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {error != '' ? (
        <p className="text-white bg-red-500 border  border-red-600 absolute top-32 right-1 w-fit p-2 h-10">{error}</p>
      ) : (
        ''
      )}
    </div>
  );
};

export default EVMApproveProposalsPage;
