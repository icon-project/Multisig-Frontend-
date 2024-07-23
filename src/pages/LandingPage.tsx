import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="mb-10 text-5xl" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
          MultiChainGov
        </h1>
        <div className='flex flex-col'>
          <Link
            to="/cosmos"
            className="bg-white text-gray-800 font-bold border-2 border-gray-800 rounded-full py-3 px-4 shadow-md hover:shadow-lg transition-all"
          >
            Cosmos
          </Link>
          <br />
          <Link
            to="/evm"
            className="bg-white text-gray-800 font-bold border-2 border-gray-800 rounded-full py-3 px-4 shadow-md hover:shadow-lg transition-all"
          >
            EVM
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
