import React from 'react';
import { convertTimestampToDateTime } from '../utils/dateTimeUtils';
import { Proposal } from '../@types/CosmosProposalsTypes';
import { Link } from 'react-router-dom';

interface CosmosProposalsPageProps {
  proposals: Proposal[];
  limit: number;
  offset: number;
  loading?: boolean;
  handleOffsetChange: (offset: number) => void;
  approveAction?: (proposalId: number) => void;
  executeAction?: (proposalId: number) => void;
}

const CosmosProposalsPage: React.FC<CosmosProposalsPageProps> = ({
  proposals,
  limit,
  offset,
  loading = false,
  handleOffsetChange,
  approveAction,
  executeAction,
}) => {
  const currentPage = parseInt(`${offset / limit}`) + 1;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="d-table rounded bg-[rgba(255,255,255,0.1)]">
          <thead>
            <tr>
              <th>Proposal Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Expires At</th>
              <th>Actions</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="data-loading-details text-center font-semibold">
              {loading && <td colSpan={7}>Loading...</td>}
              {!loading && proposals.length === 0 && <td colSpan={7}>No proposals to display.</td>}
            </tr>

            {proposals.map((proposal: Proposal, index: number) => (
              <tr key={index}>
                <th>{proposal.id}</th>
                <td>{proposal.title}</td>
                <td>{proposal.description}</td>
                <td>{proposal.status}</td>
                <td>{convertTimestampToDateTime(proposal.expires.at_time)}</td>
                <td>
                  <div className="flex gap-2">
                    {approveAction && (
                      <button className="d-btn" onClick={() => approveAction(Number(proposal.id))}>
                        Approve
                      </button>
                    )}
                    {executeAction && (
                      <button className="d-btn" onClick={() => executeAction(Number(proposal.id))}>
                        Execute
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  <Link to={`/cosmos/proposals/${proposal.id}`}>
                    <button className="d-btn">Details</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 justify-center items-center mt-4 m-auto">
        <button
          className="d-btn"
          onClick={() => {
            handleOffsetChange(offset - limit);
          }}
        >
          Prev
        </button>
        <div>{currentPage}</div>
        <button
          className="d-btn"
          onClick={() => {
            handleOffsetChange(offset + limit);
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default CosmosProposalsPage;
