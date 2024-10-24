import React from 'react';

interface SUIProposal {
  id: string;
  title: string;
  multisig_address: string;
  tx_data: number[];
  is_digest: boolean;
  approved: boolean;
}

interface CosmosProposalsPageProps {
  proposals: SUIProposal[];
  limit: number;
  offset: number;
  loading?: boolean;
  handleOffsetChange: (offset: number) => void;
  approveAction?: (proposalId: string) => void;
  executeAction?: (proposalId: string) => void;
}

const SUIProposalsTable: React.FC<CosmosProposalsPageProps> = ({
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
              <th>Is digest</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="data-loading-details text-center font-semibold">
              {loading && <td colSpan={7}>Loading...</td>}
              {!loading && proposals.length === 0 && <td colSpan={7}>No proposals to display.</td>}
            </tr>

            {proposals.map((proposal: SUIProposal, index: number) => (
              <tr key={index}>
                <th>{proposal.id}</th>
                <td>{proposal.title}</td>
                <td>{proposal.is_digest ? 'True' : 'False'}</td>
                <td>{proposal.approved ? 'Approve' : '...'}</td>
                <td>
                  <div className="flex gap-2">
                    {approveAction && !proposal.approved && (
                      <button className="d-btn" onClick={() => approveAction(proposal.id)}>
                        Approve
                      </button>
                    )}
                    {executeAction && proposal.approved && (
                      <button className="d-btn" onClick={() => executeAction(proposal.id)}>
                        Execute
                      </button>
                    )}
                  </div>
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

export default SUIProposalsTable;
