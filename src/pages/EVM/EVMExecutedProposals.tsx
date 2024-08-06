import { useState, useEffect } from 'react';
import EVMProposalsTable from '../../components/EVMProposalsTable.tsx';
import { testconfig, mainconfig } from '../../config';
import { getEthereumContractByChain } from '../../constants/contracts';
import { getChainId } from '@wagmi/core';
import { loadProposalData } from '../../utils/loadproposaldata';

const APP_ENV = import.meta.env.VITE_APP_ENV;

const EVMExecutedProposals = () => {
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;

  const chainId = getChainId(config); // account, chainid, metamask
  const [proposal_data, setProposalData] = useState<any[]>([]);
  const contractAddress = getEthereumContractByChain(chainId.toString());
  console.log('Chain id and contract address ', chainId, contractAddress);

  const itemsPerPageLimit = 5;
  const [itemsListOffset, setItemsListOffset] = useState(0);

  const fetchFilteredData = async () => {
    try {
      const data = await loadProposalData();

      let filteredData = data.filter((proposal: any) => proposal.status === 'Executed');
      const paginatedData = filteredData.slice(itemsListOffset, itemsListOffset + itemsPerPageLimit);
      setProposalData(paginatedData);
    } catch (error) {
      console.error('Error fetching proposal data:', error);
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
  return (
    <div className="evm-manager-page">
      <div className="overflow-x-auto">
        <div className="overflow-x-auto  bg-[rgba(255,255,255,0.5)] p-4 rounded ">
          <EVMProposalsTable
            proposal_data={proposal_data}
            limit={itemsPerPageLimit}
            offset={itemsListOffset}
            handleOffsetChange={handlePaginationChanges}
          />
        </div>
      </div>
    </div>
  );
};

export default EVMExecutedProposals;
