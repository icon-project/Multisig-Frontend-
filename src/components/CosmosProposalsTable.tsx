import { ReactNode, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useContractData } from '../hooks/useContractData';
import { useChain } from '@cosmos-kit/react';
import { convertTimestampToDateTime } from '../utils/dateTimeUtils';
import GeneralModal from './GeneralModal';

export type Proposal = {
  id: number;
  title: string;
  description: string;
  msgs: Array<{
    wasm: {
      execute: {
        contract_addr: string;
        msg: string;
        funds: Array<any>;
      };
    };
  }>;
  status: string;
  expires: {
    at_time: string;
  };
  threshold: {
    absolute_count: {
      weight: number;
      total_weight: number;
    };
  };
  proposer: string;
  deposit: any | null;
};

interface ModalDetails {
  show: boolean;
  title: string;
  description: string | ReactNode;
}

const CosmosProposalsPage = () => {
  const { state } = useAppContext();
  const chainName = state.activeCosmosChain.chainName;
  const { address } = useChain(chainName);
  const { getContractData } = useContractData(chainName);
  const [proposalList, setProposalList] = useState<Proposal[]>([]);
  const [modalDetails, setModalDetails] = useState<ModalDetails>({
    show: false,
    title: '',
    description: '',
  });

  const handleModalClose = () => {
    setModalDetails({
      show: false,
      title: '',
      description: '',
    });
  };

  const getProposals = async () => {
    const txMsg = {
      list_proposals: {},
    };
    const { proposals } = await getContractData(txMsg);
    setProposalList(proposals);
  };

  useEffect(() => {
    if (address) {
      getProposals();
    }
  }, [address]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="d-table rounded bg-[rgba(255,255,255,0.1)]">
          <thead>
            <tr>
              <th>Proposal Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Deposil</th>
              <th>Proposer</th>
              <th>Msgs</th>
              <th>Threshold</th>
              <th>Status</th>
              <th>Expires At</th>
            </tr>
          </thead>
          <tbody>
            {proposalList.map((proposal, index) => (
              <tr key={index}>
                <th>{proposal.id}</th>
                <td>{proposal.title}</td>
                <td>{proposal.description}</td>
                <td>{proposal.deposit}</td>
                <td>{proposal.proposer}</td>
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
                        title: 'Msgs',
                        description: <pre>{JSON.stringify(proposal.threshold, null, 2)}</pre>,
                      });
                    }}
                  >
                    Show Threshold
                  </button>
                </td>
                <td>{proposal.status}</td>
                <td>{convertTimestampToDateTime(proposal.expires.at_time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
