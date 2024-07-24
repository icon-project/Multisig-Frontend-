import { useState, useEffect } from 'react';
import { testconfig, mainconfig } from '../../config';
import { getChainId } from '@wagmi/core';
import { useEthersSigner } from '../../utils/ethers';
import { BytesLike, ethers } from 'ethers';
import { getEthereumContractByChain } from '../../constants/contracts';

import { abi } from '../../abi/SAFE_ABI';
import { database } from '../../firebase';
import { ref, set } from 'firebase/database';
import { loadProposalData } from '../../utils/loadproposaldata';
import SpinningCircles from 'react-loading-icons/dist/esm/components/spinning-circles';
const APP_ENV = import.meta.env.VITE_APP_ENV;

const EVMCreateProposalPage = () => {
  const SENITAL_OWNERS = '0x0000000000000000000000000000000000000001';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = APP_ENV == 'dev' ? testconfig : mainconfig;
  const [formData, setFormData] = useState({
    proxyAddress: '',
    proxyAdminAddress: '',
    implementationAddress: '',
    remarks: '',
  });
  const [memberData, setMemberData] = useState({
    owner: '',
    threshold: '',
  });

  const [proposalType, setProposalType] = useState('member-management');

  const chainId = getChainId(config);
  const contractAddress = getEthereumContractByChain(chainId.toString());
  const [action, setAction] = useState('add-member');
  const signer = useEthersSigner();
  const chain = getChainId(config);

  console.log('Chain', chain);

  const addMember = async () => {
    let contract = new ethers.Contract(contractAddress, abi, signer);
    const encodedData = contract.interface.encodeFunctionData('addOwnerWithThreshold', [
      memberData.owner,
      Number(memberData.threshold),
    ]);
    const nonce = await contract.nonce();
    const to = contractAddress;
    const value = 0;
    const data = encodedData;
    const operation = 0;
    const safeTxGas = 0;
    const baseGas = 0;
    const gasPrice = 0;
    const gasToken = ethers.constants.AddressZero;
    const signatures: BytesLike[] = [];
    const refundReceiver = ethers.constants.AddressZero;

    const txHash = await contract.getTransactionHash(
      to,
      value,
      data,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce,
    );
    const proposalData = {
      proposal: txHash,
      to,
      value,
      data,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce: nonce.toString(),
      execute: false,
      signatures,
      chain: chain.toString(),
      abi: ['function addOwnerWithThreshold(address owner, uint256 _threshold) public override'],
      func: 'addOwnerWithThreshold',

      remark: 'Add member ' + memberData.owner,
    };

    const proposals = await loadProposalData();
    if (!proposals.some((proposal) => proposal.proposal === proposalData.proposal)) {
      proposals.push(proposalData);
      //set
      const proposalRef = ref(database, 'proposals');
      await set(proposalRef, proposals);
      console.log('Proposal data saved to proposal_data.json');
    } else {
      console.log('Proposal hash already exists. No new proposal added.');
      setError('Proposal hash already exists. No new proposal added.');
    }
  };
  const removeMember = async () => {
    let contract = new ethers.Contract(contractAddress, abi, signer);

    const owners = await contract.getOwners();
    const prevOwnerIndex = owners.indexOf(memberData.owner) - 1;

    const prevOwner = prevOwnerIndex < 0 ? SENITAL_OWNERS : owners[prevOwnerIndex];
    // const prevOwner = owners[prevOwnerIndex];

    const encodedData = contract.interface.encodeFunctionData('removeOwner', [
      prevOwner,
      memberData.owner,
      memberData.threshold,
    ]);

    const nonce = await contract.nonce();
    const to = contractAddress;
    const value = 0;
    const data = encodedData;
    const operation = 0;
    const safeTxGas = 0;
    const baseGas = 0;
    const gasPrice = 0;
    const gasToken = ethers.constants.AddressZero;
    const signatures: BytesLike[] = [];
    const refundReceiver = ethers.constants.AddressZero;

    const txHash = await contract.getTransactionHash(
      to,
      value,
      data,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce,
    );
    const proposalData = {
      proposal: txHash,
      to,
      value,
      data,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce: nonce.toString(),
      execute: false,
      abi: ['function removeOwner(address prevOwner, address owner, uint256 _threshold) public override'],
      func: 'removeOwner',

      signatures,
      chain: chain.toString(),
      remark: 'Remove member ' + memberData.owner,
    };

    const proposals = await loadProposalData();

    if (!proposals.some((proposal) => proposal.proposal === txHash)) {
      proposals.push(proposalData);
      const proposalRef = ref(database, 'proposals');
      await set(proposalRef, proposals);

      console.log('added');
    } else {
      console.log('Proposal hash already exists. No new proposal added.');
    }
  };
  const callCreateProposal = async () => {
    try {
      let contract = new ethers.Contract(contractAddress, abi, signer);

      const proxyAdminInterface = new ethers.utils.Interface([
        'function upgradeAndCall(address proxy, address implementation, bytes data)',
      ]);
      const encodedData = proxyAdminInterface.encodeFunctionData('upgradeAndCall', [
        formData.proxyAddress,
        formData.implementationAddress,
        '0x',
      ]);

      console.log('encoded data', encodedData);

      const to = formData.proxyAdminAddress;
      const value = 0;
      const data = encodedData;
      const operation = 0;
      const safeTxGas = 0;
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ethers.constants.AddressZero;
      const signatures: BytesLike[] = [];
      const refundReceiver = ethers.constants.AddressZero;

      console.log(contract);
      const nonce = await contract.nonce();
      console.log('nonce', nonce);
      const txHash = await contract.getTransactionHash(
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        nonce,
      );

      console.log(`Transaction Hash 84: ${txHash}`);

      const proposalData = {
        proposal: txHash,
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        nonce: nonce.toString(),
        execute: false,
        signatures: signatures,
        chain: chain.toString(),
        abi: ['function upgradeAndCall(address proxy, address implementation, bytes data)'],
        func: 'upgradeAndCall',

        remark: formData.remarks,
      };

      let proposals = await loadProposalData();
      proposals.push(proposalData);
      console.log(proposals);
      const proposalRef = ref(database, 'proposals');
      await set(proposalRef, proposals);

      console.log('added');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value, // Update the specific field
    }));
  };
  const handleMemberDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setMemberData((memberData) => ({
      ...memberData,
      [name]: value, // Update the specific field
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    console.log('executing proposal', proposalType, action);

    try {
      if (proposalType === 'member-management') {
        console.log('executing proposal', action);
        if (action === 'add-member') {
          console.log('calling add member');

          addMember();
          setLoading(false);
        } else {
          console.log('calling remove member');
          removeMember();
          setLoading(false);
        }
      } else {
        callCreateProposal();
        setLoading(false);
      }
    } catch (e) {
      console.log(e, '286');
      setError(e);
      setTimeout(() => {
        setError('');
      }, 5);
    }
    // console.log('executing proposal', proposalType, action);
  };

  useEffect(() => {
    async function fetchData() {
      const data = await loadProposalData(); // Load proposals
      console.log('printin the data from firebase', data);
    }

    fetchData();
  }, []);
  // useEffect(() => {
  //   console.log(formData, 'formdata');
  //   console.log(proposalJson, 'proposal json');
  // }, [formData, proposalJson]);
  useEffect(() => {
    console.log('Current chain ID:', chain);

    let address = contractAddress;
    console.log('Contract address:', address);
  }, [chain]);

  useEffect(() => {
    console.log(error, 'error');
  }, [error]);
  useEffect(() => {
    console.log(action);
    console.log(proposalType);
  }, [action, proposalType]);

  return (
    <>
      <div className="flex justify-center items-start min-h-screen py-10">
        <div className="bg-gray-50 shadow-lg rounded-lg w-4/5 h-4/5 p-8 overflow-auto">
          <h2 className="text-2xl font-bold mb-5">Create Proposal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="proposalType" className="block text-sm font-medium text-gray-700">
                Proposal Type
              </label>
              <select
                id="proposalType"
                value={proposalType}
                onChange={(e) => setProposalType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="member-management">Member Management Proposal</option>
                <option value="contract-upgrade">Contract Upgrade</option>
              </select>
            </div>
            <hr />
            {proposalType === 'member-management' && (
              <>
                <div className="mb-4">
                  <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                    Member Address
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="owner"
                      name="owner"
                      value={memberData.owner}
                      onChange={handleMemberDataChange}
                      placeholder="Enter member address"
                      className="bg-gray-200 p-2 rounded hover:outline-none focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                    Action
                  </label>
                  <select
                    id="action"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="add-member">Add member</option>
                    <option value="remove-member">Remove member</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
                    New Threshold
                  </label>
                  <input
                    name="threshold"
                    value={memberData.threshold}
                    onChange={handleMemberDataChange}
                    placeholder="Enter new threshold"
                    className="bg-gray-200 p-2 rounded hover:outline-none focus:outline-none"
                  />
                </div>
              </>
            )}

            {proposalType === 'contract-upgrade' && (
              <>
                <div className="mb-4">
                  <label htmlFor="proxyAddress" className="block text-sm font-medium text-gray-700">
                    Contract Address
                  </label>
                  <input
                    type="text"
                    id="proxyAddress"
                    name="proxyAddress"
                    className="bg-gray-200 p-2 rounded hover:outline-none focus:outline-none"
                    value={formData.proxyAddress}
                    onChange={handleChange}
                    placeholder="Proxy Address"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="proxyAdminAddress" className="block text-sm font-medium text-gray-700">
                    Proxy Admin Address
                  </label>
                  <input
                    type="text"
                    id="proxyAdminAddress"
                    name="proxyAdminAddress"
                    className="bg-gray-200 p-2 rounded hover:outline-none focus:outline-none"
                    value={formData.proxyAdminAddress}
                    onChange={handleChange}
                    placeholder="Proxy Admin Address"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="implementationAddress" className="block text-sm font-medium text-gray-700">
                    Implementation Address
                  </label>
                  <input
                    type="text"
                    id="implementationAddress"
                    name="implementationAddress"
                    className="bg-gray-200 p-2 rounded hover:outline-none focus:outline-none"
                    value={formData.implementationAddress}
                    onChange={handleChange}
                    placeholder="Implementation Address"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                    Remarks
                  </label>
                  <input
                    type="text"
                    id="remarks"
                    name="remarks"
                    className="bg-gray-200 p-2 rounded hover:outline-none focus:outline-none"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Enter remarks"
                  />
                </div>
              </>
            )}
            <div className="flex justify-end">
              <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-500">
                Submit Proposal
              </button>
              {loading ? <SpinningCircles fill="black" className="w-10 h-10 inline pl-3" /> : ''}
            </div>
          </form>
          {error ? (
            <p className="w-fit h-10 p-3 border border-red-700 bg-red-500 text-white text-l fixed top-32 right-4">
              {error}
            </p>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
};

export default EVMCreateProposalPage;
