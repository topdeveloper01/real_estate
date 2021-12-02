import { listingCollection } from '../../common/services/firebase';

export const getListingData = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            listingCollection.doc(id).get().then((res) => {
                resolve(res.data());
            })
                .catch(err => {
                    reject(err);
                });
        } catch (e) {
            reject(e);
        }
    });
};

export const getMyListings = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            listingCollection.where('owner_id', '==', user_id).get().then((res) => {
                let list = [];
                res.docs.forEach(doc => {
                    list.push(doc.data())
                })
                resolve(list);
            })
                .catch(err => {
                    reject(err);
                });
        } catch (e) {
            reject(e);
        }
    });
};

export const getAllListings = () => {
    return new Promise(async (resolve, reject) => {
        try {
            listingCollection.get().then((res) => {
                let list = [];
                res.docs.forEach(doc => {
                    list.push(doc.data())
                })
                resolve(list);
            })
                .catch(err => {
                    reject(err);
                });
        } catch (e) {
            reject(e);
        }
    });
};

export const createListing = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listingData = {
                ...data,
                id: listingCollection.doc().id
            }
            listingCollection.doc(listingData.id).set(listingData).then(() => {
                resolve(listingData)
            })
                .catch((e) => {
                    reject(e);
                })
        } catch (e) {
            reject(e);
        }
    });
};

export const deleteListing = (listing_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            listingCollection.doc(listing_id).delete().then((res) => {
                resolve(res);
            })
                .catch(err => {
                    reject(err);
                });
        } catch (e) {
            reject(e);
        }
    });
};