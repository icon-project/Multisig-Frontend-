import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useEthersSigner } from '../utils/ethers';
import { ethers } from 'ethers';
import { abi } from '../abi/SAFE_ABI';
// import { getEthersSigner } from '../EtherJs/ethers';
import { config } from '../config';
import { getChainId } from '@wagmi/core';
import { loadProposalData } from '../utils/loadproposaldata';

// import { Proposals } from '../components/ProposalsList/Proposals';

import { EthereumContracts } from '../constants/contracts';

const EVMManagerPage = () => {
  const signer = useEthersSigner();
  const chainId = getChainId(config); // account, chainid, metamask
  const [proposal_data, setProposalData] = useState<any[]>([]);
  // console.log(chainslist[0].chainId);
  const [error, setError] = useState('');

  const contractList = {
    '84532': EthereumContracts.BASE_SEPOLIA_SAFE,
    '11155111': EthereumContracts.SEPOLIA_SAFE,
    '43113': EthereumContracts.FUJI_SAFE,
    '43114': EthereumContracts.AVALANCHE,
    '421614': EthereumContracts.ARBITRUM_SEPOLIA_SAFE,
    '11155420': EthereumContracts.OPTIMISM_SEPOLIA_SAFE,
    '42161': EthereumContracts.ARBITRUM,
    '10': EthereumContracts.OPTIMISM,
    '8453': EthereumContracts.BASE,
  };

  const handleSubmit = async (hash) => {
    console.log('');
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
      let contract = new ethers.Contract(contractList[chainId], abi, signer);
      // const bytes32proposal = ethers.utils.formatBytes32String(proposalId);
      console.log(contract, 'contracts');

      const tx = await contract.approveHash(hash);
      // const tx = await contract.approvedHashes();

      // Wait for the transaction to be mined
      await tx.wait();
      console.log('Transaction confirmed:', tx.hash);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log('Current chain ID:', chainId);
    let address = contractList[chainId];
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
      <div className=" mt-5 ml-[90px]">
        <ConnectButton />
      </div>
      {/* //proposals List */}
      <div>
        <h3 className="font-bold text-lg mb-3 text-center">Ethereum Approval</h3>

        <Link to="/evm/create-proposal">
          <button className="bg-blue-600 text-white p-2 rounded font-bold absolute top-[360px] right-32">
            {' '}
            Create a Proposal{' '}
          </button>
        </Link>

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
            {/* {!isComplete ? <SpinningCircles fill="black" className="w-20 h-10 inline fixed top-20 right-96 pl-3" /> : ''} */}
          </table>
        </div>
      </div>
      {error != '' ? (
        <p className="text-white bg-red-500 border  border-red-600 absolute top-32 right-1 w-fit p-2 h-10">{error}</p>
      ) : (
        ''
      )}
    </div>
  );
};

export default EVMManagerPage;
