import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { testconfig, mainconfig } from '../../config';
import { getChainId } from '@wagmi/core';
import { useEthersSigner } from '../../utils/ethers';
import { ethers } from 'ethers';
import { getEthereumContractByChain } from '../../constants/contracts';

import { abi } from '../../abi/SAFE_ABI';
import { database } from '../../firebase';
import { ref, set } from 'firebase/database';
import { loadProposalData } from '../../utils/loadproposaldata';
const APP_ENV = import.meta.env.VITE_APP_ENV;

const EVMCreateProposalPage = () => {
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;
  const [formData, setFormData] = useState({
    proxyAddress: '',
    proxyAdminAddress: '',
    implementationAddress: '',
    remarks: '',
  });
  const chainId = getChainId(config);
  const contractAddress = getEthereumContractByChain(chainId.toString());

  const signer = useEthersSigner();
  const chain = getChainId(config);

  console.log('Chain', chain);

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
        nonce,
        execute: false,
        signatures: [],
        chain: chain.toString(),
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

  return (
    <div className="w-[80%] mx-auto">
      <ConnectButton />
      <div className="flex flex-row gap-5 mt-10">
        <div className="flex flex-row gap-5 items-center ">
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
        <div className="flex flex-row gap-5 items-center">
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
        <div className="flex flex-row gap-5 items-center">
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
        <div className="flex flex-row gap-5 items-center">
          <input
            type="text"
            id="remarks"
            name="remarks"
            className="bg-gray-200 p-2 rounded hover:outline-none focus:outline-none"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Remarks"
          />
        </div>
      </div>
      <button className="bg-blue-600 mt-5 text-white p-2 rounded font-bold w-64" onClick={callCreateProposal}>
        {' '}
        Create Proposal
      </button>
    </div>
  );
};

export default EVMCreateProposalPage;
