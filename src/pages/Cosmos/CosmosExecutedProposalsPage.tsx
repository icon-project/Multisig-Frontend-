import { useChain } from '@cosmos-kit/react';
import { useAppContext } from '../../context/AppContext';
import CosmosProposalsTable from '../../components/CosmosProposalsTable';
import { useEffect, useState } from 'react';
import { CosmosChains } from '../../constants/chains';
import { useContractData } from '../../hooks/useContractData';
import { Proposal, ProposalStatus } from '../../@types/CosmosProposalsTypes';

const CosmosExecutedProposalsPage = () => {
  const { state } = useAppContext();
  const chainName = state.activeCosmosChain.chainName;
  const { address } = useChain(chainName);
  const [proposalList, setProposalList] = useState<Proposal[]>([]);
  const { getContractData } = useContractData(chainName);
  const itemsPerPageLimit = 10;
  const [itemsListOffset, setItemsListOffset] = useState(0);
  const chainId = state.activeCosmosChain.chainId;

  const getProposals = async (limit: number = 10, offset: number = 0) => {
    const txMsg = {
      list_proposals: {
        limit: limit,
        start_after: offset,
      },
    };
    const rpcUrl = Object.values(CosmosChains).filter((chain) => chain.chainName === chainName)[0].rpcUrl;
    const data = await getContractData(txMsg, rpcUrl);
    if (data?.proposals) {
      const filteredProposals = data.proposals.filter(
        (proposal: Proposal) => proposal.status === ProposalStatus.executed,
      );
      setProposalList(filteredProposals);
    }
  };

  const handlePaginationChanges = (offset: number) => {
    setItemsListOffset(offset);
  };

  useEffect(() => {
    if (itemsListOffset >= 0 && chainId) {
      getProposals(itemsPerPageLimit, itemsListOffset);
    }
  }, [itemsListOffset, chainId, address]);

  return (
    <div className="cosmos-approval-page w-full m-auto bg-[rgba(255,255,255,0.5)] p-4 rounded flex flex-col items-center">
      <div className="mt-4 w-full max-w-[1600px]">
        <CosmosProposalsTable
          proposals={proposalList}
          limit={itemsPerPageLimit}
          offset={itemsListOffset}
          handleOffsetChange={handlePaginationChanges}
        />
      </div>
    </div>
  );
};

export default CosmosExecutedProposalsPage;
