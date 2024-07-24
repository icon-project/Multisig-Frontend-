import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ethers } from 'ethers';
const EVMProposalDetails = () => {
  const { proposalId } = useParams();
  const location = useLocation();

  const { proposal, thres } = location.state;
  //contract

  return (
    <>
      <div className="w-[800px] mx-auto p-10 shadow shadow-md shadow-blue-500 text-sm">
        <div className="mt-10 flex flex-col gap-3">
          <h1 className="text-4xl">Proposal Details</h1>
          <p>Proposal ID : {proposal.proposal}</p>
          <p>Title : {proposal.remark}</p>
          {proposal.signatures.length >= thres ? <p>Status: Passed</p> : <p>Status: Open</p>}{' '}
        </div>
        <div className="flex flex-col gap-5 mt-5">
          <h1 className="text-xl">Messages:</h1>
          <p>Data</p>
        </div>
        <button
          className="d-btn mt-5"
          // onClick={() => {
          //   handleApprove(proposal.proposal);
          // }}
        >
          Approve proposal
        </button>
      </div>
    </>
  );
};

export default EVMProposalDetails;
