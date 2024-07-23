import { useState, useEffect } from 'react';
import { useEthersSigner } from '../../utils/ethers';
import { BytesLike, ethers } from 'ethers';
import { abi } from '../../abi/SAFE_ABI';
import { testconfig, mainconfig } from '../../config';
import { getEthereumContractByChain } from '../../constants/contracts';
import { getChainId } from '@wagmi/core';
import { loadProposalData } from '../../utils/loadproposaldata';
import { Link } from 'react-router-dom';

const APP_ENV = import.meta.env.VITE_APP_ENV;

const EVMExecuteProposals = () => {
  const config = APP_ENV == 'dev' ? testconfig : mainconfig;
  const signer = useEthersSigner();
  const chainId = getChainId(config); // account, chainid, metamask
  const [proposal_data, setProposalData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const contractAddress = getEthereumContractByChain(chainId.toString());
  console.log('Chain id and contract address ', chainId, contractAddress);
  const [thres, setThresh] = useState<Number>();
  const [status, setStatus] = useState('Open');
  let contract = new ethers.Contract(contractAddress, abi, signer);

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
      <div>
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
                  <td> {proposal.signatures ? (proposal.signatures.length === thres ? 'Passed' : 'Open') : 'Open'}</td>
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
                    <Link to={`/evm/proposals/${proposal.proposal}`} state={{ proposal }}>
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
    </div>
  );
};

export default EVMExecuteProposals;
