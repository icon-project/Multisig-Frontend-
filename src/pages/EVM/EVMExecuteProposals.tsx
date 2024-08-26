import { useState, useEffect } from 'react';
import { useEthersSigner } from '../../utils/ethers';
import { ethers } from 'ethers';
import { abi } from '../../abi/SAFE_ABI';

import EVMProposalsTable from '../../components/EVMProposalsTable.tsx';
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
  const itemsPerPageLimit = 5;
  const [itemsListOffset, setItemsListOffset] = useState(0);
  let contract = new ethers.Contract(contractAddress, abi, signer);
  const [fetchingData, setFetchingData] = useState(false);

  const handleExecute = async (proposal: any) => {
    setLoading(true);
    try {
      //calling contract
      await evmExecuteContractCall(signer, contractAddress, proposal);
      toast(`Proposal executed successfully}`, 'success');
      setLoading(true);
      fetchFilteredData();
    } catch (error) {
      console.error('Error in calling contract:', error);
      toast(`Error: ${error}`, 'error');
      setLoading(false);
    }
  };
  const fetchFilteredData = async () => {
    try {
      setFetchingData(true);
      const data = await loadProposalData();

      let filteredData = data.filter((proposal: any) => proposal.status === 'Passed');
      const paginatedData = filteredData.slice(itemsListOffset, itemsListOffset + itemsPerPageLimit);
      setProposalData(paginatedData);
    } catch (error) {
      console.error('Error fetching proposal data:', error);
    } finally {
      setFetchingData(false);
    }
  };
  const handlePaginationChanges = (offset: number) => {
    setItemsListOffset(offset);
  };

  useEffect(() => {
    console.log('Current chain ID:', chainId);
    let address = contractAddress;
    console.log('Contract address:', address);
  }, [chainId]);

  useEffect(() => {
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

        <div className="overflow-x-auto  bg-[rgba(255,255,255,0.5)] p-4 rounded ">
          <EVMProposalsTable
            proposal_data={proposal_data}
            limit={itemsPerPageLimit}
            offset={itemsListOffset}
            loading={fetchingData}
            handleOffsetChange={handlePaginationChanges}
            approveAction={handleExecute}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EVMExecuteProposals;
