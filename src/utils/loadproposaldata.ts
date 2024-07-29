import { BytesLike } from 'ethers';
import { database } from '../firebase';
import { ref, get, child } from 'firebase/database';

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

export async function loadProposalData(): Promise<Proposal[]> {
  try {
    console.log('Fetching proposals from Firebase...');
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'proposals'));

    if (!snapshot.exists()) {
      console.log('No proposals found.');
      return [];
    }

    const proposals: Proposal[] = [];
    snapshot.forEach((childSnapshot) => {
      proposals.push(childSnapshot.val() as Proposal);
    });

    console.log('Proposals loaded:', proposals);
    return proposals;
  } catch (error) {
    console.error('Error loading proposals:', error);
    return [];
  }
}
