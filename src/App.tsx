import CosmosApprovalPage from './pages/CosmosApprovalPage';

function App() {
  return (
    <>
      <div className="app min-h-[100vh] bg-gradient-to-b from-blue-400 to-blue-200">
        <h3 className="text-4xl text-center font-bold py-6">IBC</h3>

        <CosmosApprovalPage />
      </div>
    </>
  );
}

export default App;
