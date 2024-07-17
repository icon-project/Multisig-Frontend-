import CosmosWalletWidget from './components/CosmosWalletWidget';
import { CosmosChains } from './constants/chains';
import CosmosApprovalPage from './pages/CosmosApprovalPage';

function App() {
  return (
    <>
      <div className="app">
        <h3 className="text-lg font-bold">IBC</h3>
        <div className="w-[400px]">
          <CosmosWalletWidget chainName={CosmosChains.archway.chainName} />
        </div>

        <CosmosApprovalPage />
      </div>
    </>
  );
}

export default App;
