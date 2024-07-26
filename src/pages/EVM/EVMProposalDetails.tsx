import { loadProposalData } from '../../utils/loadproposaldata';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { abi } from '../../abi/SAFE_ABI';
import { ethers } from 'ethers';
import useToast from '../../hooks/useToast';
// import { EVMLayoutPage } from '../EVMLayoutPage';
import { getChainId } from '@wagmi/core';
import { useEthersSigner } from '../../utils/ethers';
import { database } from '../../firebase';
import { ref, set } from 'firebase/database';
import { getEthereumContractByChain } from '../../constants/contracts';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { testconfig, mainconfig } from '../../config';
import { evmApproveContractCall, evmExecuteContractCall } from '../../services/evmServices';
const APP_ENV = import.meta.env.VITE_APP_ENV;
import SpinningCircles from 'react-loading-icons/dist/esm/components/spinning-circles';

const EVMProposalDetails = () => {
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;
  const [loading, setLoading] = useState(false);
  const chainId = getChainId(config);
  const { id } = useParams();

  const { toast, ToastContainer } = useToast();
  const signer = useEthersSigner();
  const [thres, setThresh] = useState<number>(0);
  const contractAddress = getEthereumContractByChain(chainId.toString());

  const [proposals, setProposals] = useState<any>();
  const [proposal, setProposal] = useState<any>();
  const [decodedData, setDecodedData] = useState<any>(null);
  const [func, setFunc] = useState('');

  let contract = new ethers.Contract(contractAddress, abi, signer);
  let getFunctionData = () => {
    try {
      const iface = new ethers.utils.Interface(proposal.abi);

      const functionName = Object.keys(iface.functions)[0]; // Get function name from ABI
      console.log('Function name:', functionName);
      const decoded = iface.decodeFunctionData(functionName, proposal.data.toString());

      let tempfunc = functionName.split('(')[0];
      console.log('Temp func', tempfunc);
      setFunc(tempfunc);
      console.log('Decoded data:', decodedData);
      console.log('func name:', func);
      setDecodedData(decoded);
    } catch (e) {
      console.error('Error decoding data:', e);
    }
  };

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
  const getData = async () => {
    try {
      let temp = await loadProposalData();
      setProposals(temp);

      // Make sure proposals is defined before filtering
      if (temp) {
        const filteredProposal = temp.find((p: any) => p.proposal === id);
        setProposal(filteredProposal || null);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  useEffect(() => {
    getData();
    console.log('after calling proposal ', proposals, proposal);
  }, [id]);

  useEffect(() => {
    console.log('after calling proposal ', func);
    getFunctionData();
  });
  useEffect(() => {
    const getThreshold = async () => {
      let temp = await contract.getThreshold();
      setThresh(Number(temp));
      console.log(thres, 'thres');
    };
    getThreshold();
  });

  useEffect(() => {
    const getThreshold = async () => {
      let temp = await contract.getThreshold();
      setThresh(Number(temp));
      console.log(thres, 'thres');
    };
    getThreshold();
  });

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
      toast(`Proposal approved successfully`, 'success');

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast(`Error:${error}`, 'error');
      setLoading(false);
    }
  };
  const handleExecute = async (proposal: any) => {
    setLoading(true);
    try {
      //calling contract
      await evmExecuteContractCall(signer, contractAddress, proposal);
      toast(`Proposal executed successfully}`, 'success');
      setLoading(true);
    } catch (error) {
      console.error('Error in calling contract:', error);
      toast(`Error: ${error}`, 'error');
      setLoading(false);
    }
  };

  return (
    // <EVMLayoutPage>
    <div>
      <ConnectButton />
      <div className="bg-white p-3 overflow-x-auto mx-auto">
        {loading ? <SpinningCircles fill="black" className="w-8 h-8 inline pl-3 fixed top-[100px] left-[300px]" /> : ''}

        <div className="mt-10 flex flex-col gap-3">
          {proposal ? (
            <>
              <h1 className="text-4xl">Proposal Details</h1>
              <p>Proposal ID: {proposal.proposal}</p>
              <p>Title: {proposal.remark}</p>
              <p>Status: {proposal.status}</p>
            </>
          ) : (
            <p>No proposal with this hash</p>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <h1 className="text-2xl">Messages</h1>
          <p className="text-sm font-light">Function: {func || 'N/A'}</p>
          <p className="text-sm font-light">Parameters of functions</p>
          {func === 'addOwnerWithThreshold' && decodedData && (
            <div>
              <p className="pl-5 text-sm font-extralight">Owner: {decodedData[0]}</p>
              <p className="pl-5 text-sm font-extralight">Threshold: {Number(decodedData._threshold)}</p>
            </div>
          )}
          {func === 'removeOwner' && decodedData && (
            <div>
              <p className="pl-5 text-sm font-extralight">Previous Owner={decodedData.prevOwner}</p>
              <p className="pl-5 text-sm font-extralight">Owner={decodedData.owner}</p>
              <p className="pl-5 text-sm font-extralight">Threshold={Number(decodedData._threshold)}</p>
            </div>
          )}
          {func === 'upgradeAndCall' && decodedData && (
            <div>
              <p className="pl-5 text-sm font-extralight">Implementation address: {decodedData.implementation}</p>
              <p className="pl-5 text-sm font-extralight">Proxy address: {decodedData.proxy}</p>
            </div>
          )}
        </div>
        {proposal?.status === 'Passed' ? (
          <button className="d-btn mt-5 border-black" onClick={() => handleExecute(proposal)}>
            Execute Proposal
          </button>
        ) : (
          <button className="d-btn mt-5 border-black" onClick={() => handleApprove(proposal?.proposal)}>
            Approve Proposal
          </button>
        )}
        {loading && <SpinningCircles />}
        <ToastContainer />
      </div>
    </div>
  );
};

export default EVMProposalDetails;
