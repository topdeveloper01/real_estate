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

export const userCollection = firebase.firestore().collection('Users');
export const listingCollection = firebase.firestore().collection('Listings');
export const channelCollection = firebase.firestore().collection('Channels');
export const pushesCollection = firebase.firestore().collection('PushMessages');
export const city1_Collection = firebase.firestore().collection('city_1');
export const city2_Collection = firebase.firestore().collection('city_2');
export const city3_Collection = firebase.firestore().collection('city_3');


export const FieldValue = firebase.firestore.FieldValue;
export const FbStorage = firebase.storage();

export default firebase.firestore();

