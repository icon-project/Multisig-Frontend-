import { useLocation, useParams } from 'react-router-dom';

const EVMProposalDetails = () => {
  const { proposalId } = useParams();
  const location = useLocation();
  const { proposal } = location.state || {};
  console.log(proposal);
  return (
    <>
      <div className="w-[800px] mx-auto p-10 shadow shadow-md shadow-blue-500">
        <h1 className="text-4xl">Proposal Details</h1>
        <p>Proposal ID : {proposal.proposal}</p>
        <p>Title : {proposal.remark}</p>
        <p>Status :Pending </p>

        <div>
          <h1 className="text-xl">Messages:</h1>
          <p>Data</p>
          <p></p>
        </div>
        <button
          className="d-btn"
          //   onClick={() => {
          //     handleSubmit(proposal.proposal);
          //   }}
        >
          Approve proposal
        </button>
      </div>
    </>
  );
};

export default EVMProposalDetails;
