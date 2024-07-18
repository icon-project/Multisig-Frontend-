import { initializeApp } from 'firebase/app'; // no compat for new SDK
import { getDatabase, ref } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyD4u-gpsZ7GnBiYoSklYoeopQLV6sdhz0M',
  authDomain: 'proposals-store.firebaseapp.com',
  databaseURL: 'https://proposals-store-default-rtdb.firebaseio.com',
  projectId: 'proposals-store',
  storageBucket: 'proposals-store.appspot.com',
  messagingSenderId: '675526443721',
  appId: '1:675526443721:web:e89f5afbc1bc447f8f4318',
  measurementId: 'G-NQWC7KY8NG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const database = getDatabase(app);
