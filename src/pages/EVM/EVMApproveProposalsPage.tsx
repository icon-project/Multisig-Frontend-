import { useState, useEffect } from 'react';
import { useEthersSigner } from '../../utils/ethers';
import { BytesLike, ethers } from 'ethers';
import { abi } from '../../abi/SAFE_ABI';
import { Link } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import { testconfig, mainconfig } from '../../config';
import { getEthereumContractByChain } from '../../constants/contracts';
import { getChainId } from '@wagmi/core';
import { database } from '../../firebase';
import { ref, set } from 'firebase/database';
import { loadProposalData } from '../../utils/loadproposaldata';
const APP_ENV = import.meta.env.VITE_APP_ENV;
import { watchAccount } from '@wagmi/core';

import SpinningCircles from 'react-loading-icons/dist/esm/components/spinning-circles';
import { evmApproveContractCall } from '../../services/evmServices.ts';

type Proposal = {
  status: string;
  proposal: string;
  to: string;
  value: Number;
  data: string;
  operation: Number;
  safeTxGas: Number;
  baseGas: Number;
  gasPrice: Number;
  gasToken: string;
  refundReceiver: string;
  nonce: BigInt;
  execute: Boolean;
  signatures: BytesLike[];

  chain: string;

  remark: string;
};

const EVMApproveProposalsPage = () => {
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;
  const [loading, setLoading] = useState(false);
  // const { connector: activeConnector } = useAccount();
  const { toast, ToastContainer } = useToast();
  const signer = useEthersSigner();
  const [chainId, setChainId] = useState<Number>(0);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [proposal_data, setProposalData] = useState<Proposal[]>([]);
  const [thres, setThresh] = useState<number>(0);
  const [owner, setOwner] = useState<string[]>([]);

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

  const handleApprove = async (hash: string) => {
    setLoading(true);
    if (!signer) {
      console.error('Signer is undefined. Check initialization.');
      toast(`No signer: Connect wallet properly `, 'error');
      setLoading(false);
      return;
    }

    console.log('Signer:', signer);

    try {
      await evmApproveContractCall(signer, contractAddress, hash);

      const signature = generateSignature();

      console.log(`Hash ${hash} approved.`);
      console.log(`Signature: ${signature}`);
      // Wait for the transaction to be mined
      const proposals = await loadProposalData();
      const proposal = proposals.find((p) => p.proposal === hash);
      if (!proposal) {
        console.error(`Proposal with hash ${hash} not found.`);
        toast(`Proposal hash not found`, 'error');
        process.exit(1);
      }

      if (!proposal.signatures) {
        proposal.signatures = [];
      }
      console.log('Found proposal', proposal);
      //change the status of proposal

      console.log('Changed status after approve with no of signatures', proposal.signatures.length, proposal.status);
      proposal.signatures.push(signature);
      if (proposal.signatures.length >= thres) {
        proposal.status = 'Passed';
      }

      console.log(proposal.signatures);
      proposal.signatures = owner
        .map((owner: string) => owner.slice(2).toLowerCase())
        .reverse()
        .map((owner: string) => {
          return proposal.signatures.find((sig: BytesLike) => {
            const sigHex = ethers.utils.hexlify(sig).toLowerCase();
            return sigHex.includes(owner);
          });
        })
        .filter((sig: BytesLike | undefined): sig is BytesLike => sig !== undefined);

      console.log(proposal.signatures, 'propo');

      console.log(proposals, 'proposalsss');

      const proposalRef = ref(database, 'proposals');

      await set(proposalRef, proposals);

      console.log('Updated proposals saved to Firebase.');
      //data after update
      const latest = await loadProposalData();
      console.log('data afte r update', latest);
      toast(`Proposal approved successfully`, 'success');

      setLoading(false);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      toast(`Error:${error}`, 'error');
      setLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const data = await loadProposalData();
      if (chainId === 0) {
        setProposalData(data);
      } else {
        const filteredByChain = data.filter((p) => p.chain === chainId.toString());
        setProposalData(filteredByChain);
      }
    } catch (error) {
      console.error('Error fetching proposal data:', error);
    }
  };

  useEffect(() => {
    if (signer) {
      let chain: Number = getChainId(config);
      const contractAddress = getEthereumContractByChain(chain.toString());

      setChainId(chain);
      setContractAddress(contractAddress);

      console.log(chain, contractAddress);
    }
  }, [signer, config]);

  useEffect(() => {
    fetchData();
  }, [chainId]);

  // useEffect(() => {
  //   const handleConnectorUpdate = ({ account }: any) => {
  //     if (account) {
  //       console.log('new account', account);
  //     }
  //   };

  //   if (activeConnector) {
  //     activeConnector.on('change', handleConnectorUpdate);
  //   }

  //   return () => activeConnector.off('change', handleConnectorUpdate);
  // }, [activeConnector]);
  useEffect(() => {
    const getThresholdAndOwners = async () => {
      let contract = new ethers.Contract(contractAddress, abi, signer);
      let temp = await contract.getThreshold();
      let owners = await contract.getOwners();
      setOwner(owners);
      setThresh(Number(temp));
      console.log(thres, owner, 'thres and owner');
    };
    getThresholdAndOwners();
  }, [contractAddress, signer]);

  return (
    <div className="evm-manager-page">
      {loading ? <SpinningCircles fill="blue" className="w-16 h-10 inline pl-3 fixed top-20 left-[220px]" /> : ''}
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
                  <td> {proposal.status}</td>
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
                    <Link to={`/evm/proposals/${proposal.proposal}`}>
                      <button className="d-btn">Details</button>
                    </Link>
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

      <ToastContainer />
    </div>
  );
};

export default EVMApproveProposalsPage;
