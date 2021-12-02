import storage from '@react-native-firebase/storage';

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

