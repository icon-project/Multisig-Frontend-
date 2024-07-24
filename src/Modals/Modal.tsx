import { ethers } from 'ethers';
import { FaTimes } from 'react-icons/fa';

type Proposal = {
  proposal: String;
  to: String;
  value: Number;
  data: String;
  operation: Number;
  baseGas: Number;
  gasPrice: Number;
  gasToken: String;
  safeTxGas: Number;
  refundReceiver: String;
  nonce: BigInt;
  execute: Boolean;
  signatures: Array<BytesLike>;
  chain: string;
  remark: String;
  abi: [];
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleApprove: (hash: string | Proposal) => void;

  thres: number;
  proposal?: Proposal;
  buttonName: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, handleApprove, thres, proposal, buttonName }) => {
  // Ensure modal only renders when it is open
  if (!isOpen) return null;
  console.log(buttonName, 'button');
  let decodedData: any;

  // Ensure modal only renders when proposal is present
  if (!proposal) return null;
  let decodedOutput: any = {};
  let stat = 'Opened';

  // Calculate status based on the presence and length of signatures
  if (proposal.signatures && proposal.signatures.length >= thres) {
    stat = 'Passed';
  }

  try {
    const iface = new ethers.utils.Interface(proposal.abi);
    const functionName = Object.keys(iface.functions)[0]; // Get function name from ABI
    console.log('Function name:', functionName);

    // Decode the function data
    decodedData = iface.decodeFunctionData(functionName, proposal.data);
    console.log('Decoded data:', decodedData);
    decodedOutput = {
      functionName: functionName,
      ...decodedData,
    };

    console.log('Decoded Output:', decodedOutput);
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
      <div className="flex flex-col gap-5 mt-5">
        <h1 className="text-xl">Messages:</h1>
        {/* Display decoded data */}

        {/* <p>Function : {decodedOutput.functionName.split('(')[0]}</p> */}
        <p>Function : {decodedOutput.functionName}</p>
        <p>Parameters</p>
        {/* {decodedData.map((data: any, key) => (
          <p>{key}</p>
        ))} */}

        <p className="pl-5">Param 1={Number(decodedData[0])}</p>
        <p className="pl-5">Param 2={decodedData[0]}</p>
      </div>
      <button
        className="d-btn mt-5 border-black"
        onClick={() => {
          // Call handleApprove with proposal.proposal as hash if it's executing
          handleApprove(proposal.proposal);
        }}
      >
        {buttonName}
      </button>
    </div>
  );
};

export default Modal;
