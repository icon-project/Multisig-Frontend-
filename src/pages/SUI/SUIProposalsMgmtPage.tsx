import { useEffect, useState } from 'react';
import useToast from '../../hooks/useToast';
import SUIProposalsTable from '../../components/SUIProposalsTable';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { useWallet } from '@suiet/wallet-kit';
import { Transaction } from '@mysten/sui/transactions';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { bcs } from '@mysten/sui.js/bcs';

const MULTI_SIG_PACKAGE_ID = import.meta.env.VITE_APP_SUI_MULTISIG_PACKAGE_ID;
const STORAGE_ID = import.meta.env.VITE_APP_SUI_STORAGE_ID;
const NETWORK = import.meta.env.VITE_APP_ENV === 'dev' ? 'testnet' : 'mainnet';

// Todo: Move to interface file
interface SUIProposal {
  id: string;
  title: string;
  multisig_address: string;
  tx_data: number[];
  is_digest: boolean;
  approved: boolean;
}

const SUIProposalsMgmtPage = () => {
  const { toast, ToastContainer } = useToast();
  const [proposalList, setProposalList] = useState<SUIProposal[]>([]);
  const itemsPerPageLimit = 10;
  const [itemsListOffset, setItemsListOffset] = useState(0);
  const [fetchingData, setFetchingData] = useState(false);
  const wallet = useWallet();
  const [messageInput, setMessageInput] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState('');
  const [proposalExecuteCommand, setProposalExecuteCommand] = useState('');

  const getProposals = async () => {
    setFetchingData(true);
    await fetchProposals();
    setFetchingData(false);
  };

  const handlePaginationChanges = (offset: number) => {
    setItemsListOffset(offset);
  };

  async function fetchProposals() {
    if (!wallet?.account?.publicKey || !wallet.address) return;

    const rpcUrl = getFullnodeUrl(NETWORK);
    const suiClient = new SuiClient({ url: rpcUrl });

    const getPropsTxb = new TransactionBlock();
    getPropsTxb.moveCall({
      target: `${MULTI_SIG_PACKAGE_ID}::multisig::get_proposals`,
      arguments: [getPropsTxb.object(STORAGE_ID)],
    });
    const res = await suiClient.devInspectTransactionBlock({
      sender: wallet.address,
      transactionBlock: getPropsTxb,
    });

    const result = res?.results?.[0].returnValues?.[0]?.[0];
    if (!result) {
      console.log('No Proposals found.');
      return;
    }

    bcs.registerStructType('Proposal', {
      id: 'u64',
      title: 'string',
      multisig_address: 'address',
      tx_data: 'vector<u8>',
      is_digest: 'bool',
      approved: 'bool',
    });
    const proposals = bcs.de(`vector<Proposal>`, new Uint8Array(result));
    if (proposals) setProposalList(proposals);
  }

  const handleFileChosen = (file: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      if (fileReader.result) {
        setMessageInput(String(fileReader.result));
      }
    };
  };

  const checkIfUserApprovedProposal = async (proposalId: string): Promise<boolean | undefined> => {
    try {
      if (!wallet.address) return;
      const rpcUrl = getFullnodeUrl(NETWORK);
      const suiClient = new SuiClient({ url: rpcUrl });

      const txb = new TransactionBlock();
      txb.moveCall({
        target: `${MULTI_SIG_PACKAGE_ID}::multisig::has_member_voted`,
        arguments: [txb.object(STORAGE_ID), txb.pure.u64(proposalId), txb.pure.address(wallet.address)],
      });
      const res = await suiClient.devInspectTransactionBlock({
        sender: wallet.address,
        transactionBlock: txb,
      });
      const result = res?.results?.[0].returnValues?.[0]?.[0];
      if (!result) {
        console.log('No voting value found.');
        return;
      }

      const hasVoted = bcs.de(`bool`, new Uint8Array(result));
      console.log('hasVoted', hasVoted);
      return hasVoted;
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleApproveAction = async () => {
    try {
      const hasVoted = await checkIfUserApprovedProposal(selectedProposalId);

      if (hasVoted === undefined) throw new Error('Failed to get approval value.');
      if (hasVoted === true) throw new Error('You have already voted for this proposal.');

      const signMsg = messageInput;
      const tx = Transaction.from(Buffer.from(signMsg, 'base64'));
      const sign = await wallet.signTransaction({
        transaction: tx,
      });
      const txb = new TransactionBlock();
      txb.moveCall({
        target: `${MULTI_SIG_PACKAGE_ID}::multisig::approve_proposal`,
        arguments: [txb.object(STORAGE_ID), txb.pure.u64(selectedProposalId), txb.pure.string(sign.signature)],
      });
      const txnResponse = await wallet.signAndExecuteTransactionBlock({
        // @ts-expect-error transactionBlock type mismatch error between @suiet/wallet-kit and @mysten/sui.js
        transactionBlock: txb,
      });
      console.log('Queue txnResponse', txnResponse);

      if (txnResponse && txnResponse?.digest) toast(`Approve Success. Digest: ${txnResponse?.digest}`, 'success');
    } catch (error) {
      console.log('Error: ', error);
      toast(`Approve Failed: ${error}`, 'error');
    } finally {
      setShowApprovalModal(false);
      setSelectedProposalId('');
      setMessageInput('');
    }
  };

  const handleExecuteAction = async (proposalId: string) => {
    if (!wallet.address) return;

    const rpcUrl = getFullnodeUrl(NETWORK);
    const suiClient = new SuiClient({ url: rpcUrl });

    const getPropsTxb = new TransactionBlock();
    getPropsTxb.moveCall({
      target: `${MULTI_SIG_PACKAGE_ID}::multisig::get_execute_command`,
      arguments: [getPropsTxb.object(STORAGE_ID), getPropsTxb.pure.u64(proposalId)],
    });
    const res = await suiClient.devInspectTransactionBlock({
      sender: wallet.address,
      transactionBlock: getPropsTxb,
    });

    const result = res?.results?.[0].returnValues?.[0]?.[0];
    if (!result) {
      console.log('Proposal not ready for execution.');
      return;
    }

    const executeCommand = bcs.de(`string`, new Uint8Array(result));
    if (executeCommand) setProposalExecuteCommand(executeCommand);
  };

  const handleApproveClick = (id: string) => {
    setShowApprovalModal(true);
    setSelectedProposalId(id);
  };

  useEffect(() => {
    getProposals();
  }, [wallet]);

  return (
    <div className="cosmos-approval-page w-full m-auto bg-[rgba(255,255,255,0.5)] p-4 rounded flex flex-col items-center">
      <div className="mt-4 w-full max-w-[1600px]">
        <SUIProposalsTable
          proposals={proposalList}
          limit={itemsPerPageLimit}
          offset={itemsListOffset}
          loading={fetchingData}
          handleOffsetChange={handlePaginationChanges}
          approveAction={handleApproveClick}
          executeAction={handleExecuteAction}
        />
      </div>

      {showApprovalModal && (
        <dialog className="d-modal d-modal-bottom sm:d-modal-middle d-modal-open">
          <div className="d-modal-box">
            <h3 className="font-bold text-lg text-center">Sign and Approve</h3>
            <div className="d-modal-action flex-col">
              <p className="overflow-auto">Select a text file with bytes data to sign and approve the proposal</p>

              <form method="dialog" className="mt-4">
                <p className="text-center">Proposal Id: {selectedProposalId}</p>
                <div className="flex justify-center mt-4">
                  <input type="file" name="signature-msg" onChange={(e: any) => handleFileChosen(e.target.files[0])} />
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <button className="d-btn bg-blue-500 text-white" onClick={handleApproveAction}>
                    Sign Msg
                  </button>

                  <button
                    className="d-btn"
                    onClick={() => {
                      setShowApprovalModal(false);
                      setMessageInput('');
                    }}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      )}

      {proposalExecuteCommand && (
        <dialog className="d-modal d-modal-bottom sm:d-modal-middle d-modal-open">
          <div className="d-modal-box !w-full !max-w-[768px]">
            <h3 className="font-bold text-lg text-center">Proposal Execute</h3>
            <div className="d-modal-action flex-col">
              <p className="font-semibold">Proposal is ready to be executed. Please run the following command:</p>

              <textarea value={proposalExecuteCommand} rows={10} className="bg-gray-200 mt-4" readOnly />

              <div className="flex justify-center mt-4">
                <button
                  className="d-btn bg-blue-500 text-white"
                  onClick={() => {
                    setProposalExecuteCommand('');
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}

      <ToastContainer />
    </div>
  );
};

export default SUIProposalsMgmtPage;
