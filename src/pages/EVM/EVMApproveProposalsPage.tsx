import { useState, useEffect } from 'react';
import { useEthersSigner } from '../../utils/ethers';
import { BytesLike, ethers } from 'ethers';
import { abi } from '../../abi/SAFE_ABI';
import { testconfig, mainconfig } from '../../config';
import { getEthereumContractByChain } from '../../constants/contracts';
import { getChainId } from '@wagmi/core';
import { database } from '../../firebase';
import { ref, set } from 'firebase/database';
import { loadProposalData } from '../../utils/loadproposaldata';
import Modal from '../../Modals/Modal.tsx';
const APP_ENV = import.meta.env.VITE_APP_ENV;

import SpinningCircles from 'react-loading-icons/dist/esm/components/spinning-circles';

const EVMApproveProposalsPage = () => {
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const signer = useEthersSigner();
  const chainId = getChainId(config); // account, chainid, metamask
  const [proposal_data, setProposalData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const contractAddress = getEthereumContractByChain(chainId.toString());
  const [thres, setThresh] = useState<number>(0);
  const buttonName = 'Approve Proposal';

  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  console.log('Chain id and contract address and signer ', chainId, contractAddress, signer?._address);

  let contract = new ethers.Contract(contractAddress, abi, signer);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (proposal: any) => {
    setSelectedProposal(proposal);
    setOpen(true);
  };

  useEffect(() => {
    console.log(open);
  }, [open]);
  function generateSignature() {
    if (!signer || !signer._address) {
      throw new Error('Signer address is not available');
    }
    const approverAddress = signer._address;
    const r = ethers.utils.hexZeroPad(approverAddress, 32);
    const s = ethers.utils.hexZeroPad(ethers.utils.hexlify(65), 32);
    const v = 1;
    return ethers.utils.hexConcat([r, s, ethers.utils.hexlify(v)]);
  }

  type Proposal = {
    proposal: String;
    to: String;
    value: Number;
    data: String;
    operation: Number;
    baseGas: Number;
    gasPrice: Number;
    gasToken: String;
    safeTxGas: Number;
    refundReceiver: String;
    nonce: BigInt;
    execute: Boolean;
    signatures: Array<BytesLike>;
    chain: string;
    remark: String;
  };

  const handleApprove = async (hash: string | Proposal) => {
    setLoading(true);
    if (!signer) {
      console.error('Signer is undefined. Check initialization.');
      setError('Connect wallet first');

      setTimeout(() => {
        setError('');
      }, 4000);
      setLoading(false);
      return;
    }

    console.log('Signer:', signer);

    let contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const tx = await contract.approveHash(hash);
      await tx.wait();
      console.log('Transaction confirmed:', tx.hash);
      let owners = await contract.getOwners();
      console.log(owners);
      console.log(await contract.getThreshold());
      const signature = generateSignature();

      console.log(`Hash ${hash} approved.`);
      console.log(`Signature: ${signature}`);
      // Wait for the transaction to be mined
      const proposals = await loadProposalData();
      const proposal = proposals.find((p) => p.proposal === hash);
      if (!proposal) {
        console.error(`Proposal with hash ${hash} not found.`);
        process.exit(1);
      }

      if (!proposal.signatures) {
        proposal.signatures = [];
      }
      console.log('Found proposal', proposal);
      proposal.signatures.push(signature);
      console.log(proposal.signatures);
      proposal.signatures = owners
        .map((owner: string) => owner.slice(2).toLowerCase())
        .reverse()
        .map((owner: string) => proposal.signatures.find((sig: any) => sig.includes(owner)))
        .filter((sig: any) => sig !== undefined);
      console.log(proposal.signatures, 'propo');

      console.log(proposals, 'proposalsss');

      const proposalRef = ref(database, 'proposals');
      await set(proposalRef, proposals);

      console.log('Updated proposals saved to Firebase.');
      //data after update
      const latest = await loadProposalData();
      console.log('data afte r update', latest);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getThreshold = async () => {
      let temp = await contract.getThreshold();
      setThresh(Number(temp));
      console.log(thres, 'thres');
    };
    getThreshold();
  });

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

  return (
    <div className="evm-manager-page">
      {loading ? <SpinningCircles fill="black" className="w-10 h-10 inline pl-3 absolute top-2" /> : ''}
      {!open ? (
        <div className="overflow-x-auto">
          <table className="d-table rounded bg-[rgba(255,255,255,0.1)]  mt-6">
            <thead>
              <tr>
                <th>Proposal Hash</th>
                <th className="w-6">Title </th>
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
                          handleApprove(proposal.proposal);
                        }}
                      >
                        Approve proposal
                      </button>
                    </td>
                    <td>
                      {/* <Link to={`/evm/proposals/${proposal.proposal}`} state={{ proposal, thres, contract }}> */}
                      <button className="d-btn" onClick={() => handleOpen(proposal)}>
                        Details
                      </button>

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
          handleApprove={handleApprove}
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

export default EVMApproveProposalsPage;
