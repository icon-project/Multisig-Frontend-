import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { EthereumContracts } from '../constants/contracts';
import { config } from '../config';
import { getChainId } from '@wagmi/core';
import { useEthersSigner } from '../utils/ethers';
import { ethers } from 'ethers';
import { abi } from '../abi/SAFE_ABI';
import { database } from '../firebase';
import { ref, set } from 'firebase/database';
import { loadProposalData } from '../utils/loadproposaldata';

const CreateProposal = () => {
  const [formData, setFormData] = useState({
    proxyAddress: '',
    proxyAdminAddress: '',
    implementationAddress: '',
    remarks: '',
  });

  const signer = useEthersSigner();
  const chain = getChainId(config);

  console.log('Chain', chain);

  const contractList: Record<number, string> = {
    '84532': EthereumContracts.BASE_SEPOLIA_SAFE,
    '11155111': EthereumContracts.SEPOLIA_SAFE,
    '43113': EthereumContracts.FUJI_SAFE,
    '43114': EthereumContracts.AVALANCHE,
    '421614': EthereumContracts.ARBITRUM_SEPOLIA_SAFE,
    '11155420': EthereumContracts.OPTIMISM_SEPOLIA_SAFE,
    '42161': EthereumContracts.ARBITRUM,
    '10': EthereumContracts.OPTIMISM,
    '8453': EthereumContracts.BASE,
  };

  const callCreateProposal = async () => {
    try {
      let contract = new ethers.Contract(contractList[chain], abi, signer);

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
    let address = contractList[chain];
    console.log('Contract address:', address);
  }, [chain]);

  return (
    <div>
      <ConnectButton />
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-5 items-center pt-5">
          <p>Enter Proxy Address:</p>
          <input
            type="text"
            id="proxyAddress"
            name="proxyAddress"
            className="pl-3 border border-gray-400 h-10 w-96"
            value={formData.proxyAddress}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <p>Enter Proxy Admin Address:</p>
          <input
            type="text"
            id="proxyAdminAddress"
            name="proxyAdminAddress"
            className="pl-3 border border-gray-400 h-10 w-96"
            value={formData.proxyAdminAddress}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <p>Enter Implementation Address:</p>
          <input
            type="text"
            id="implementationAddress"
            name="implementationAddress"
            className="pl-3 border border-gray-400 h-10 w-96"
            value={formData.implementationAddress}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <p>Enter Remarks</p>
          <input
            type="text"
            id="remarks"
            name="remarks"
            className="pl-3 border border-gray-400 h-10 w-96"
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>

        <button
          className="bg-transparent border-blue-700 p-5  text-blue-700 font-semibold hover:text-white  border hover:border-transparent hover:bg-blue-700 rounded w-[200px]"
          onClick={callCreateProposal}
        >
          {' '}
          Create Proposal
        </button>
      </div>
    </div>
  );
};

export default CreateProposal;
