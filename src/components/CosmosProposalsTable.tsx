import React, { ReactNode, useState } from 'react';
import { convertTimestampToDateTime } from '../utils/dateTimeUtils';
import GeneralModal from './GeneralModal';
import { Proposal } from '../@types/CosmosProposalsTypes';

interface ModalDetails {
  show: boolean;
  title: string;
  description: string | ReactNode;
}

interface CosmosProposalsPageProps {
  proposals: Proposal[];
  limit: number;
  offset: number;
  handleOffsetChange: (offset: number) => void;
  approveAction?: (proposalId: number) => void;
  executeAction?: (proposalId: number) => void;
}

const CosmosProposalsPage: React.FC<CosmosProposalsPageProps> = ({
  proposals,
  limit,
  offset,
  handleOffsetChange,
  approveAction,
  executeAction,
}) => {
  const [modalDetails, setModalDetails] = useState<ModalDetails>({
    show: false,
    title: '',
    description: '',
  });
  const currentPage = parseInt(`${offset / limit}`) + 1;

  const handleModalClose = () => {
    setModalDetails({
      show: false,
      title: '',
      description: '',
    });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="d-table rounded bg-[rgba(255,255,255,0.1)]">
          <thead>
            <tr>
              <th>Proposal Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Msgs</th>
              <th>Threshold</th>
              <th>Status</th>
              <th>Expires At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal: Proposal, index: number) => (
              <tr key={index}>
                <th>{proposal.id}</th>
                <td>{proposal.title}</td>
                <td>{proposal.description}</td>
                <td>
                  <button
                    className="d-btn"
                    onClick={() => {
                      setModalDetails({
                        show: true,
                        title: 'Msgs',
                        description: <pre>{JSON.stringify(proposal.msgs, null, 2)}</pre>,
                      });
                    }}
                  >
                    Show Msgs
                  </button>
                </td>
                <td>
                  <button
                    className="d-btn"
                    onClick={() => {
                      setModalDetails({
                        show: true,
                        title: 'Threshold',
                        description: <pre>{JSON.stringify(proposal.threshold, null, 2)}</pre>,
                      });
                    }}
                  >
                    Show Threshold
                  </button>
                </td>
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

      <GeneralModal
        show={modalDetails.show}
        closeHandler={handleModalClose}
        title={modalDetails.title}
        description={modalDetails.description}
      />
    </>
  );
};

export default CosmosProposalsPage;
