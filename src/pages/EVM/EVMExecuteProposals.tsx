import { useState, useEffect } from 'react';
import { useEthersSigner } from '../../utils/ethers';
import { BytesLike, ethers } from 'ethers';
import { abi } from '../../abi/SAFE_ABI';
import { testconfig, mainconfig } from '../../config';
import { getEthereumContractByChain } from '../../constants/contracts';
import { getChainId } from '@wagmi/core';
import { loadProposalData } from '../../utils/loadproposaldata';
import Modal from '../../Modals/Modal.tsx';

const APP_ENV = import.meta.env.VITE_APP_ENV;

const EVMExecuteProposals = () => {
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;
  const signer = useEthersSigner();
  const chainId = getChainId(config); // account, chainid, metamask
  const [proposal_data, setProposalData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const contractAddress = getEthereumContractByChain(chainId.toString());
  console.log('Chain id and contract address ', chainId, contractAddress);
  const [thres, setThresh] = useState<number>(0);
  let contract = new ethers.Contract(contractAddress, abi, signer);
  const buttonName = 'Execute Proposal';

  type Proposal = {
    proposal: string;
    to: string;
    value: number;
    data: string;
    operation: number;
    baseGas: number;
    gasPrice: number;
    gasToken: string;
    safeTxGas: number;
    refundReceiver: string;
    nonce: bigint;
    execute: boolean;
    signatures: Array<BytesLike>;
    chain: string;
    remark: string;
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (proposal: any) => {
    setSelectedProposal(proposal);
    setOpen(true);
  };

  const handleExecute = async (proposal: Proposal) => {
    if (!signer) {
      console.error('Signer is undefined. Check initialization.');
      setError('Connect wallet first');

      setTimeout(() => {
        setError('');
      }, 4000);
      return;
    }

    console.log('Signer:', signer);

    let contract = new ethers.Contract(contractAddress, abi, signer);
    console.log(contract);
    try {
      console.log(proposal.signatures, 'proposal signatures');
      const encodedSignatures = ethers.utils.hexConcat(proposal.signatures);
      console.log('encoded sig', encodedSignatures);

      const tx = await contract.executeTransaction(
        proposal.to,
        proposal.value,
        proposal.data,
        proposal.operation,
        proposal.safeTxGas,
        proposal.baseGas,
        proposal.gasPrice,
        proposal.gasToken,
        proposal.refundReceiver,
        encodedSignatures,
        proposal.remark,
      );

      await tx.wait();

      console.log(`Transaction executed with hash ${proposal.proposal}. ,$`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log('Current chain ID:', chainId);
    let address = contractAddress;
    console.log('Contract address:', address);
  }, [chainId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadProposalData();
        console.log('Fetched proposal data:', data);
        setProposalData(data);
      } catch (error) {
        console.error('Error fetching proposal data:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const getThreshold = async () => {
      let temp = await contract.getThreshold();
      setThresh(Number(temp));
      console.log(thres, 'thres');
    };
    getThreshold();
  });
  return (
    <div className="evm-manager-page">
      {/* {loading ? <SpinningCircles fill="black" className="w-10 h-10 inline pl-3 absolute top-2" /> : ''} */}
      {!open ? (
        <div className="overflow-x-auto">
          <table className="d-table rounded bg-[rgba(255,255,255,0.1)]  mt-6">
            <thead>
              <tr>
                <th>Proposal Hash</th>
                <th className="w-96">Title </th>
                <th>Status</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {proposal_data.length > 0 ? (
                proposal_data.map((proposal, index) => (
                  <tr key={index} className="">
                    <td className=" ">{proposal.proposal}</td>

                    <td className="w-96">{proposal.remark}</td>
                    <td>
                      {' '}
                      {proposal.signatures ? (proposal.signatures.length === thres ? 'Passed' : 'Open') : 'Open'}
                    </td>
                    <td>
                      <button
                        className="d-btn"
                        onClick={() => {
                          handleExecute(proposal);
                        }}
                      >
                        Execute proposal
                      </button>
                    </td>
                    <td>
                      {/* <Link to={`/evm/proposals/${proposal.proposal}`} state={{ proposal }}> */}
                      <button className="d-btn" onClick={() => handleOpen(proposal)}>
                        Details
                      </button>{' '}
                      {/* </Link> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center">No proposals</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <Modal
          isOpen={open}
          onClose={handleClose}
          handleApprove={handleExecute}
          thres={thres}
          proposal={selectedProposal}
          buttonName={buttonName}
        />
      )}
      {error && (
        <p className="text-white bg-red-500 border border-red-600 fixed top-32 right-1 w-fit p-2 h-10">{error}</p>
      )}
    </div>
  );
};

export default EVMExecuteProposals;
