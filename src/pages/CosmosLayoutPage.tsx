import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import { Navigate, Route, Routes } from 'react-router-dom';
import CosmosWalletWidget from '../components/CosmosWalletWidget';
import CosmosApproveProposalslPage from './Cosmos/CosmosApproveProposalslPage';
import CosmosCreateProposalPage from './Cosmos/CosmosCreateProposalPage';
import CosmosExecuteProposalslPage from './Cosmos/CosmosExecuteProposalsPage';
import CosmosExecutedProposalsPage from './Cosmos/CosmosExecutedProposalsPage';

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
  return (
    <div className="cosmos-page flex flex-col min-h-screen">
      <Navbar walletComponent={<CosmosWalletWidget />} />
      <div className="flex flex-1">
        <SideNav links={SideNavRoutes} />
        <div className="w-full md:w-4/5 p-4">
          <Routes>
            <Route path="approve-proposals" element={<CosmosApproveProposalslPage />} />
            <Route path="create-proposals" element={<CosmosCreateProposalPage />} />
            <Route path="execute-proposals" element={<CosmosExecuteProposalslPage />} />
            <Route path="executed-proposals" element={<CosmosExecutedProposalsPage />} />
            <Route path="*" element={<Navigate to="approve-proposals" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CosmosLayoutPage;
