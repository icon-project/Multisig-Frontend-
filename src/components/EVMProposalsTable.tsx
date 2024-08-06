import React, { ReactNode, useState } from 'react';
import GeneralModal from './GeneralModal';
import { BytesLike } from 'ethers';
import { Link } from 'react-router-dom';

type Proposal = {
  status: string;
  proposal: string;
  to: string;
  value: Number;
  data: string;
  operation: Number;
  safeTxGas: Number;
  baseGas: Number;
  gasPrice: Number;
  gasToken: string;
  refundReceiver: string;
  nonce: BigInt;
  execute: Boolean;
  signatures: BytesLike[];

  chain: string;

  remark: string;
};

interface ModalDetails {
  show: boolean;
  title: string;
  description: string | ReactNode;
}

interface EVMProposalsPageProps {
  proposal_data: Proposal[];
  limit: number;
  offset: number;
  handleOffsetChange: (offset: number) => void;
  approveAction?: (hash: string) => void;
  executeAction?: (hash: string) => void;
}

const EVMProposalsTable: React.FC<EVMProposalsPageProps> = ({
  proposal_data,
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
        <table className="d-table rounded  bg-[rgba(255,255,255,0.1)]  mt-6">
          <thead>
            <tr>
              <th>Proposal Hash</th>
              <th className="w-6">Title </th>
              <th>Status</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {proposal_data.length > 0 ? (
              proposal_data.map((proposal: Proposal, index: number) => (
                <tr key={index} className="">
                  <td className=" ">{proposal.proposal}</td>

                  <td className="w-96">{proposal.remark}</td>
                  <td> {proposal.status}</td>
                  <td>
                    <div className="flex gap-2">
                      {approveAction && (
                        <button className="d-btn" onClick={() => approveAction(proposal.proposal)}>
                          Approve
                        </button>
                      )}
                      {executeAction && (
                        <button className="d-btn" onClick={() => executeAction(proposal.proposal)}>
                          Execute
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <Link to={`/evm/proposals/${proposal.proposal}`}>
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

export default EVMProposalsTable;
