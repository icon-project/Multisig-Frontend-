import { useState, useEffect } from 'react';
import { testconfig, mainconfig } from '../../config';
import { getChainId } from '@wagmi/core';
import { ethers } from 'ethers';
import { getEthereumContractByChain } from '../../constants/contracts';
import { createProposalData } from '../../services/evmServices';
import { abi } from '../../abi/SAFE_ABI';
import useToast from '../../hooks/useToast';
import { useEthersSigner } from '../../utils/ethers';
import { database } from '../../firebase';
import { ref, set } from 'firebase/database';
import { loadProposalData } from '../../utils/loadproposaldata';
import SpinningCircles from 'react-loading-icons/dist/esm/components/spinning-circles';
const APP_ENV = import.meta.env.VITE_APP_ENV;

const EVMCreateProposalPage = () => {
  const signer = useEthersSigner();
  const { toast, ToastContainer } = useToast();
  const SENITAL_OWNERS = '0x0000000000000000000000000000000000000001';
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState<any>(null);
  const [thres, setThresh] = useState<number>(0);

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
  const [showOwner, setShowOwner] = useState(false);
  const [showThresh, setShowThres] = useState(false);
  const [proposalType, setProposalType] = useState('member-management');

  const chainId = getChainId(config);
  const contractAddress = getEthereumContractByChain(chainId.toString());
  const [action, setAction] = useState('add-member');

  const chain = getChainId(config);

  console.log('Chain', chain);

  const addMember = async () => {
    setLoading(true);
    try {
      let contract = new ethers.Contract(contractAddress, abi, signer);
      const encodedData = contract.interface.encodeFunctionData('addOwnerWithThreshold', [
        memberData.owner,
        Number(memberData.threshold),
      ]);
      const data = {
        to: contractAddress,
        value: 0,
        data: encodedData,
        operation: 0,
        safeTxGas: 0,
        baseGas: 0,
        gasPrice: 0,
        gasToken: ethers.constants.AddressZero,
        refundReceiver: ethers.constants.AddressZero,
      };
      const proposalData = await createProposalData(
        signer,

        contractAddress,
        data,
        chain,
        ['function addOwnerWithThreshold(address owner, uint256 _threshold) public override'],
        memberData.owner,
      );

      const proposals = await loadProposalData();
      if (!proposals.some((proposal) => proposal.proposal === proposalData.proposal)) {
        proposals.push(proposalData);
        //set
        const proposalRef = ref(database, 'proposals');
        await set(proposalRef, proposals);
        console.log('Proposal data saved to proposal_data.json');
        toast('Proposal created successfully', 'success');
      } else {
        console.log('Proposal hash already exists. No new proposal added.');
        toast(`Proposal hash already exists. No new proposal added.`, 'info');

        return;
      }
    } catch (e) {
      console.log('Error adding member:', e);
      toast(`Proposal failed to add: ${e}`, 'error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getOwners = async () => {
      let contract = new ethers.Contract(contractAddress, abi, signer);

      const owners = await contract.getOwners();
      setOwner(owners);
    };
    getOwners();
  }, [contractAddress]);

  useEffect(() => {
    const getThreshold = async () => {
      let contract = new ethers.Contract(contractAddress, abi, signer);

      let temp = await contract.getThreshold();
      setThresh(Number(temp));
      console.log(thres, 'thres');
    };
    getThreshold();
  });

  const removeMember = async () => {
    setLoading(true);
    try {
      let contract = new ethers.Contract(contractAddress, abi, signer);
      const prevOwnerIndex = owner.indexOf(memberData.owner) - 1;

      const prevOwner = prevOwnerIndex < 0 ? SENITAL_OWNERS : owner[prevOwnerIndex];
      // const prevOwner = owners[prevOwnerIndex];

      const encodedData = contract.interface.encodeFunctionData('removeOwner', [
        prevOwner,
        memberData.owner,
        memberData.threshold,
      ]);

      const data = {
        to: contractAddress,
        value: 0,
        data: encodedData,
        operation: 0,
        safeTxGas: 0,
        baseGas: 0,
        gasPrice: 0,
        gasToken: ethers.constants.AddressZero,
        refundReceiver: ethers.constants.AddressZero,
      };

      const proposalData = await createProposalData(
        signer,
        contractAddress,
        data,
        chain,
        ['function removeOwner(address prevOwner, address owner, uint256 _threshold) public override'],
        memberData.owner,
      );

      const proposals = await loadProposalData();

      if (!proposals.some((proposal) => proposal.proposal === proposalData.proposal)) {
        proposals.push(proposalData);
        const proposalRef = ref(database, 'proposals');
        await set(proposalRef, proposals);
        toast('Proposal created successfully', 'success');

        console.log('added');
      } else {
        console.log('Proposal hash already exists. No new proposal added.');
        // toast(`Proposal hash already exists. No new proposal added.`, 'info');
        toast(`Proposal hash already exists. No new proposal added.`, 'info');

        return;
      }
    } catch (e) {
      console.log('Error in removing member proposal', e);

      toast(`Proposal failed to add: ${e}`, 'error');
    } finally {
      setLoading(false);
    }
  };
  const callCreateProposal = async () => {
    setLoading(true);
    try {
      const proxyAdminInterface = new ethers.utils.Interface([
        'function upgradeAndCall(address proxy, address implementation, bytes data)',
      ]);
      const encodedData = proxyAdminInterface.encodeFunctionData('upgradeAndCall', [
        formData.proxyAddress,
        formData.implementationAddress,
        '0x',
      ]);

      console.log('encoded data', encodedData);

      const data = {
        to: formData.proxyAdminAddress,
        value: 0,
        data: encodedData,
        operation: 0,
        safeTxGas: 0,
        baseGas: 0,
        gasPrice: 0,
        gasToken: ethers.constants.AddressZero,
        refundReceiver: ethers.constants.AddressZero,
      };
      //calling contract for proposal txhash and data;
      const proposalData = await createProposalData(
        signer,
        contractAddress,
        data,
        chain,
        ['function upgradeAndCall(address proxy, address implementation, bytes data)'],
        formData.remarks,
      );
      console.log(proposalData, 'proposal daa from service');
      let proposals = await loadProposalData();
      proposals.push(proposalData);
      console.log(proposals);
      const proposalRef = ref(database, 'proposals');
      await set(proposalRef, proposals);

      console.log('added');
      toast(`Proposal added succesfully`, 'success');
    } catch (e) {
      toast(`Proposal failed to add: ${e}`, 'error');
    } finally {
      setLoading(false);
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

  const handleShowThres = () => {
    setShowThres((prev) => !prev);
  };
  const handleShowOwners = () => {
    setShowOwner((prev) => !prev);
    console.log(owner);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log('executing proposal', proposalType, action);

    try {
      if (proposalType === 'member-management') {
        console.log('executing proposal', action);
        if (action === 'add-member') {
          console.log('calling add member');

          addMember();
        } else {
          console.log('calling remove member');
          removeMember();
        }
      } else {
        callCreateProposal();
      }
    } catch (e) {
      console.log(e);
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
                <span className="font-extralight text-gray-400 text-xs ">Click to get current values</span>

                <div className="flex flex-row gap-8">
                  <div className="mb-2  ">
                    <button type="button" onClick={handleShowOwners} className=" p-2 outline outline-blue-300 rounded">
                      Current Owners
                    </button>
                    {showOwner === true &&
                      owner.map((item: any, index: number) => (
                        <div className="w-[50%]">
                          <p className="font-extralight text-xs text-gray-400" key={index}>
                            {item}
                          </p>
                        </div>
                      ))}
                  </div>
                  <div className="">
                    <button type="button" onClick={handleShowThres} className="p-2 outline outline-blue-300 rounded">
                      Current Threshold
                      {showThresh === true ? <span className="  text-gray-400 pl-2">{thres}</span> : ''}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="owner" className=" text-sm font-medium text-gray-700">
                    Member Address
                  </label>
                  <div className="flex">
                    <input
                      required
                      type="text"
                      id="owner"
                      name="owner"
                      value={memberData.owner}
                      onChange={handleMemberDataChange}
                      placeholder="Enter member address"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                    required
                    name="threshold"
                    value={memberData.threshold}
                    onChange={handleMemberDataChange}
                    placeholder="Enter new threshold"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                    required
                    type="text"
                    id="proxyAddress"
                    name="proxyAddress"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                    required
                    type="text"
                    id="proxyAdminAddress"
                    name="proxyAdminAddress"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                    required
                    type="text"
                    id="implementationAddress"
                    name="implementationAddress"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                    required
                    type="text"
                    id="remarks"
                    name="remarks"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Enter remarks"
                  />
                </div>
              </>
            )}
            <div className="flex flex-row gap-1">
              <div className="flex justify-end">
                <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-500">
                  Submit Proposal
                </button>
              </div>
              {loading ? <SpinningCircles fill="black" className="w-96 h-[25px] font-extra-light  pl-3" /> : ''}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EVMCreateProposalPage;
