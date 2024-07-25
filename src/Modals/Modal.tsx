import { BytesLike, ethers } from 'ethers';
import { FaTimes } from 'react-icons/fa';

type Proposal = {
  proposal: string;
  to: string;
  value: number;
  data: string;
  operation: number;
  baseGas: number;
  gasPrice: number;
  gasToken: string;
  safeTxGas: number;
  refundReceiver: string;
  nonce: bigint;
  execute: boolean;
  abi: [];
  signatures: Array<BytesLike>;
  chain: string;
  remark: string;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleApprove: (proposalOrHash: Proposal | string) => Promise<void>;
  thres: number;
  proposal?: Proposal;
  buttonName: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, handleApprove, thres, proposal, buttonName }) => {
  // Ensure modal only renders when it is open
  if (!isOpen) return null;
  console.log(buttonName, 'button');
  let decodedData: any;
  let func: string = '';

  // Ensure modal only renders when proposal is present
  if (!proposal) return null;

  let stat = 'Opened';

  // Calculate status based on the presence and length of signatures
  if (proposal.signatures && proposal.signatures.length >= thres) {
    stat = 'Passed';
  }

  try {
    const iface = new ethers.utils.Interface(proposal.abi);
    const functionName = Object.keys(iface.functions)[0]; // Get function name from ABI
    console.log('Function name:', functionName);
    decodedData = iface.decodeFunctionData(functionName, proposal.data.toString());

    func = functionName.split('(')[0];
    console.log('Decoded data:', decodedData);
  } catch (e) {
    console.error('Error decoding data:', e);
  }

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

export default Modal;
