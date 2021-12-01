import * as firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCFavcZ05YVRUeZjgZKTYsKWFKcYOi0_C8",
    projectId: 'hollysapp-53492',
    authDomain: 'hollysapp-53492.firebaseapp.com',
    databaseURL: 'https://hollysapp-53492.firebaseio.com',
    storageBucket : "hollysapp-53492.appspot.com"
};


firebase.initializeApp(firebaseConfig);

export const FieldValue = firebase.firestore.FieldValue;
export const userCollection = firebase.firestore().collection('Users');
export default firebase.firestore();

