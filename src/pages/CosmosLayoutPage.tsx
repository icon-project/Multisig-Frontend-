import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import { Navigate, Route, Routes } from 'react-router-dom';
import CosmosWalletWidget from '../components/CosmosWalletWidget';
import CosmosApproveProposalslPage from './Cosmos/CosmosApproveProposalslPage';
import CosmosCreateProposalPage from './Cosmos/CosmosCreateProposalPage';
import CosmosExecuteProposalslPage from './Cosmos/CosmosExecuteProposalsPage';
import CosmosExecutedProposalsPage from './Cosmos/CosmosExecutedProposalsPage';
import CosmosProposalDetails from './Cosmos/CosmosProposalDetails';
import { useAppContext } from '../context/AppContext';
import { useChain } from '@cosmos-kit/react';
import { CosmosChainsDetails } from '../constants/chains';
import { IoClose } from 'react-icons/io5';

interface SideNavRoutes {
  name: string;
  title: string;
  route: string;
}

const SideNavRoutes: SideNavRoutes[] = [
  {
    name: 'create-proposal',
    title: 'Create Proposals',
    route: 'create-proposals',
  },
  {
    name: 'approve-proposal',
    title: 'Approve Proposals',
    route: 'approve-proposals',
  },
  {
    name: 'execute-proposal',
    title: 'Execute Proposals',
    route: 'execute-proposals',
  },
  {
    name: 'executed-proposal',
    title: 'Executed Proposals',
    route: 'executed-proposals',
  },
];

const CosmosLayoutPage = () => {
  const { state } = useAppContext();
  const chainName = state.activeCosmosChain.chainName;
  const { chain } = useChain(chainName);
  const [showNetworkNotAdded, setShowNetworkNotAdded] = useState(false);

  const checkNecessaryNetworks = async (chainId: string) => {
    const keplr = (window as any).keplr;
    try {
      await keplr.enable(chainId);
      setShowNetworkNotAdded(false);
    } catch (error) {
      console.log('Error', error);
      if (error instanceof Error) {
        if (error.message.includes('no chain info')) setShowNetworkNotAdded(true);
      }
    }
  };

  const handleAddChain = async () => {
    try {
      const chainId = chain.chain_id;
      if (!chainId) throw new Error('Missing chain id.');
      const chainInfo = CosmosChainsDetails.find((chain) => chain.chainId == chainId);
      const keplr = (window as any).keplr;
      await keplr.experimentalSuggestChain(chainInfo);
      setShowNetworkNotAdded(false);
    } catch (error) {
      console.log('Failed to add chain.', error);
    }
  };

  useEffect(() => {
    const chainId = chain.chain_id;
    if (chainId) checkNecessaryNetworks(chainId);
  }, [chain]);

  return (
    <div className="cosmos-page flex flex-col min-h-screen">
      {showNetworkNotAdded && (
        <div className="bg-[rgba(255,1,1,1)] text-white w-full relative">
          <div className="flex justify-center items-center gap-2 p-2">
            <p className="font-semibold">Missing Chain in Keplr Wallet</p>
            <button onClick={handleAddChain} className="bg-blue-700 text-white px-2 py-1 rounded">
              Add Chain
            </button>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <IoClose fontSize={32} />
          </div>
        </div>
      )}

      <Navbar chainName="COSMOS" walletComponent={<CosmosWalletWidget />} />
      <div className="flex flex-1">
        <SideNav links={SideNavRoutes} />
        {/* 74px -> Height of Navbar */}
        <div className="w-full md:w-4/5 p-4 overflow-auto h-[calc(100vh-74px)]">
          <Routes>
            <Route path="approve-proposals" element={<CosmosApproveProposalslPage />} />
            <Route path="create-proposals" element={<CosmosCreateProposalPage />} />
            <Route path="execute-proposals" element={<CosmosExecuteProposalslPage />} />
            <Route path="executed-proposals" element={<CosmosExecutedProposalsPage />} />
            <Route path="proposals/:proposalChainName/:id" element={<CosmosProposalDetails />} />

            <Route path="*" element={<Navigate to="approve-proposals" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CosmosLayoutPage;
