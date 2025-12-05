import { useState, useEffect } from 'react';
import EVMProposalsTable from '../../components/EVMProposalsTable.tsx';
import { getEthereumContractByChain } from '../../constants/contracts';
import { loadProposalData } from '../../utils/loadproposaldata';
import { useChainId } from 'wagmi';

const EVMExecutedProposals = () => {
  const chainId = useChainId();
  const [proposal_data, setProposalData] = useState<any[]>([]);
  const contractAddress = getEthereumContractByChain(chainId.toString());
  console.log('Chain id and contract address ', chainId, contractAddress);

  const itemsPerPageLimit = 5;
  const [itemsListOffset, setItemsListOffset] = useState(0);
  const [fetchingData, setFetchingData] = useState(false);

  const fetchFilteredData = async () => {
    try {
      setFetchingData(true);
      const data = await loadProposalData();
      const filteredData = data.filter(
        (proposal) => proposal.chain === chainId.toString() && proposal.status === 'Executed',
      );
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
    fetchFilteredData();
  }, [chainId]);

  return (
    <div className="evm-manager-page">
      <div className="overflow-x-auto">
        <div className="overflow-x-auto  bg-[rgba(255,255,255,0.5)] p-4 rounded ">
          <EVMProposalsTable
            proposal_data={proposal_data}
            limit={itemsPerPageLimit}
            offset={itemsListOffset}
            loading={fetchingData}
            handleOffsetChange={handlePaginationChanges}
          />
        </div>
      </div>
    </div>
  );
};

export default EVMExecutedProposals;
