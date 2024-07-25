import { FaTimes } from 'react-icons/fa';
import { loadProposalData } from '../../utils/loadproposaldata';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const EVMProposalDetails = () => {
  const { hash } = useParams();
  const [proposals, setProposals] = useState<any>();
  console.log('hash', hash);

  const getData = async () => {
    const proposals = await loadProposalData();
    setProposals(proposals);
    console.log(proposals);
  };

  useEffect(() => {
    getData();
  });

  return (
    <div className=" bg-white p-3 overflow-x-auto">
      <button className="absolute top-32 right-16 text-black" onClick={onClose}>
        <FaTimes size={28} />
      </button>
      <div className="mt-10 flex flex-col gap-3">
        <h1 className="text-4xl">Proposal Details</h1>
        <p>Proposal ID: {proposal.proposal}</p>
        <p>Title: {proposal.remark}</p>
        <p>Status: {stat}</p>
      </div>
      <div className="flex flex-col gap-2 mt-5">
        <h1 className="text-2xl">Messages</h1>
        {/* Display decoded data */}

        {/* <p>Function : {decodedOutput.functionName.split('(')[0]}</p> */}
        <p className="text-sm font-light">Function: {func}</p>
        <p className="text-sm font-light">Parameters of functions</p>
        {/* //checking function name */}
        {func === 'addOwnerWithThreshold' ? (
          <div>
            <p className="pl-5 text-sm font-extralight">Owner: {decodedData[0]}</p>
            <p className="pl-5 text-sm font-extralight">Threshold: {Number(decodedData._threshold)}</p>
          </div>
        ) : (
          ''
        )}
        {func === 'removeOwner' ? (
          <div>
            <p className="pl-5 text-sm font-extralight">Previous Owner={decodedData.prevOwner}</p>
            <p className="pl-5 text-sm font-extralight">Owner={decodedData.owner}</p>
            <p className="pl-5 text-sm font-extralight">Threshold={Number(decodedData._threshold)}</p>
          </div>
        ) : (
          ''
        )}
        {func === 'upgradeAndCall' ? (
          <div>
            <p className="pl-5 text-sm font-extralight">Implementation address: {decodedData.implementation}</p>
            <p className="pl-5 text-sm font-extralight">Proxy address: {decodedData.proxy}</p>
          </div>
        ) : (
          ''
        )}
      </div>
      <button
        className="d-btn mt-5 border-black"
        onClick={() => {
          // Call handleApprove with proposal.proposal as hash if it's executing
          handleApprove(proposal);
        }}
      >
        {buttonName}
      </button>{' '}
      <p></p>
    </div>
  );
};

export default EVMProposalDetails;
