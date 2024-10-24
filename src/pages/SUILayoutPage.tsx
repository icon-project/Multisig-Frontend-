import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import SUIProposalsMgmtPage from './SUI/SUIProposalsMgmtPage';
import { uint8ArrayToBase64 } from '../utils/stringUtils';

interface SideNavRoutes {
  name: string;
  title: string;
  route: string;
}

const SideNavRoutes: SideNavRoutes[] = [
  {
    name: 'approve-proposal',
    title: 'Approve Proposals',
    route: 'approve-proposals',
  },
];

const SUILayoutPage = () => {
  const wallet = useWallet();
  const [walletPublicKey, setWalletPublicKey] = useState('');

  useEffect(() => {
    if (wallet?.account?.publicKey) {
      const walletPub = uint8ArrayToBase64([0, ...wallet.account?.publicKey] as any);
      setWalletPublicKey(walletPub);
    }
  }, [wallet]);

  return (
    <div className="cosmos-page flex flex-col min-h-screen">
      <Navbar walletComponent={<ConnectButton />} additionalId={<div>Public Key: {walletPublicKey}</div>} />
      <div className="flex flex-1">
        <SideNav links={SideNavRoutes} />
        {/* 74px -> Height of Navbar */}
        <div className="w-full md:w-4/5 p-4 overflow-auto h-[calc(100vh-74px)]">
          <Routes>
            <Route path="approve-proposals" element={<SUIProposalsMgmtPage />} />
            <Route path="*" element={<Navigate to="approve-proposals" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SUILayoutPage;
