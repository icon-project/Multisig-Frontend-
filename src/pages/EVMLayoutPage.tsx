import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import { Navigate, Route, Routes } from 'react-router-dom';
import EVMApproveProposalsPage from './EVM/EVMApproveProposalsPage';
import EVMCreateProposalPage from './EVM/EVMCreateProposalPage';
import EVMExecuteProposals from './EVM/EVMExecuteProposals';
import EVMExecutedProposals from './EVM/EVMExecutedProposals';
import EVMProposalDetails from './EVM/EVMProposalDetails';
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

const EVMLayoutPage = () => {
  return (
    <div className="cosmos-page flex flex-col min-h-screen">
      <Navbar walletComponent={<ConnectButton />} />
      <div className="flex flex-1">
        <SideNav links={SideNavRoutes} />
        <div className="w-full md:w-4/5 p-4">
          <Routes>
            <Route path="approve-proposals" element={<EVMApproveProposalsPage />} />
            <Route path="create-proposals" element={<EVMCreateProposalPage />} />
            <Route path="execute-proposals" element={<EVMExecuteProposals />} />
            <Route path="executed-proposals" element={<EVMExecutedProposals />} />
            <Route path="proposals/:id" element={<EVMProposalDetails />} />
            <Route path="*" element={<Navigate to="approve-proposals" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default EVMLayoutPage;
