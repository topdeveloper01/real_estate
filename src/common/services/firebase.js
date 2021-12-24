import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const userCollection = firestore().collection('Users');
export const listingCollection = firestore().collection('Listings');
export const channelCollection = firestore().collection('Channels');
export const pushesCollection = firestore().collection('PushMessages');
export const city1_Collection = firestore().collection('city_1');
export const city2_Collection = firestore().collection('city_2');
export const city3_Collection = firestore().collection('city_3');
export const settings_Collection = firestore().collection('settings');

export const FieldValue = firestore.FieldValue;
 
export const uploadPhoto = (ref_path, pathToFile) => {
    return new Promise(async (resolve, reject) => {
        console.log('uploadPhoto ', pathToFile)
        let photo_ref = storage().ref(ref_path)

        photo_ref.putFile(pathToFile, { contentType: 'image/jpeg' }).on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                // Handle unsuccessful uploads
                console.log("error:-", error)
                reject(error);
            },
            () => {
                photo_ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL)
                })
                    .catch((error) => {
                        console.log("error:-", error)
                        reject(error);
                    });
            }
        );
    });
}

