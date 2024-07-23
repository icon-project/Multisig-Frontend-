import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useEthersSigner } from '../utils/ethers';
import { BytesLike, ethers } from 'ethers';
import { abi } from '../abi/SAFE_ABI';
import { testconfig, mainconfig } from '../config';
import { getEthereumContractByChain } from '../constants/contracts';
import { getChainId } from '@wagmi/core';
import { database } from '../firebase';
import { ref, set, update } from 'firebase/database';
import { loadProposalData } from '../utils/loadproposaldata';
const APP_ENV = import.meta.env.VITE_APP_ENV;

const EVMManagerPage = () => {
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;

  const signer = useEthersSigner();
  const chainId = getChainId(config); // account, chainid, metamask
  const [proposal_data, setProposalData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const contractAddress = getEthereumContractByChain(chainId.toString());
  console.log('Chain id and contract address and signer ', chainId, contractAddress, signer?._address);

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

  //utils

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
  //signer and contract

  const handleApprove = async (hash: string) => {
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

      // Prepare the path to the specific proposal
      // const proposalPath = `proposals/${hash}`;

      // // Update the proposal in Firebase Realtime Database
      // await update(ref(database, proposalPath), {
      //   signatures: proposal.signatures,
      // });
      console.log(proposals, 'proposalsss');

      const proposalRef = ref(database, 'proposals');
      await set(proposalRef, proposals);

      console.log('Updated proposals saved to Firebase.');
      //data after update
      const latest = await loadProposalData();
      console.log('data afte r update', latest);
    } catch (error) {
      console.error('Error:', error);
    }
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
      const encodedSignatures = ethers.utils.concat(proposal.signatures);
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

  return (
    <div className="evm-manager-page">
      <div className=" mt-5 ml-[90px]">
        <ConnectButton />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-3 text-center">Ethereum Approval</h3>

        <Link to="/evm/create-proposal">
          <button className="bg-blue-600 text-white p-2 rounded font-bold absolute top-[360px] right-32">
            {' '}
            Create a Proposal{' '}
          </button>
        </Link>

        <div>
          <table className="d-table rounded bg-[rgba(255,255,255,0.1)] w-[90%] m-auto mt-6">
            <thead>
              <tr>
                <th>Title </th>
                <th>Proposal </th>

                <th>Approve</th>
                <th>Execute</th>
              </tr>
            </thead>
            <tbody>
              {proposal_data.length > 0 ? (
                proposal_data.map((proposal, index) => (
                  <tr key={index} className="">
                    <td className="">{proposal.remark}</td>
                    <td className=" ">{proposal.proposal}</td>
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
                      <div className="pl-3">
                        <button
                          className="d-btn"
                          onClick={() => {
                            handleExecute(proposal);
                          }}
                        >
                          Execute proposal
                        </button>
                      </div>
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
      </div>
      {error != '' ? (
        <p className="text-white bg-red-500 border  border-red-600 absolute top-32 right-1 w-fit p-2 h-10">{error}</p>
      ) : (
        ''
      )}
    </div>
  );
};

export default EVMManagerPage;
