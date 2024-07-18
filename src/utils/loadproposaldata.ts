import { database } from '../firebase';
import { getDatabase, ref, set, get, child } from 'firebase/database';

export async function loadProposalData() {
  try {
    console.log('Fetching proposals from Firebase...');
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'proposals'));

    if (!snapshot.exists()) {
      console.log('No proposals found.');
      return [];
    }

    const proposals = [];

    proposals.push(snapshot.val());

    console.log('Proposals loaded:', proposals);
    return proposals;
  } catch (error) {
    console.error('Error loading proposals:', error);
    return [];
  }
}
