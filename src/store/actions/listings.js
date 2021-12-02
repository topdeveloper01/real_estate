import { listingCollection } from '../../common/services/firebase';
import { isEmpty } from '../../common/services/utility';

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

export const getMyListings = (user_id, filterKeys) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { searchTerm, filter_type, filter_price, filter_size, filter_rooms } = filterKeys;
            console.log('filterKeys ', filterKeys)
            let coll_ref = listingCollection.where('owner_id', '==', user_id);
            if (filterKeys.is_featured == true) {
                coll_ref = coll_ref.where('is_featured', '==', true);
            }
            if (!isEmpty(searchTerm)) {
                coll_ref = coll_ref.where('title', '>=', searchTerm).where('title', '<=', searchTerm + '~');
            }
            if (filter_type != -1) {
                if (filter_type == 0) { // sell
                    coll_ref = coll_ref.where('isSell', '==', true);
                }
                else if (filter_type == 1) { // rent
                    coll_ref = coll_ref.where('isRent', '==', true);
                }
            }
            if (filter_price != -1) {
                if (filter_price == 0) {
                    coll_ref = coll_ref.where('price', '<=', 3999999)
                }
                else if (filter_price == 1) {
                    coll_ref = coll_ref.where('price', '>=', 4000000).where('price', '<=', 9999999)
                }
                else if (filter_price == 2) {
                    coll_ref = coll_ref.where('price', '>=', 10000000).where('price', '<=', 49999999)
                }
                else if (filter_price == 3) {
                    coll_ref = coll_ref.where('price', '>=', 50000000)
                }
            }
            if (filter_size != -1) {
                if (filter_size == 0) {
                    coll_ref = coll_ref.where('size', '<=', 299)
                }
                else if (filter_size == 1) {
                    coll_ref = coll_ref.where('size', '>=', 300).where('price', '<=', 799)
                }
                else if (filter_size == 2) {
                    coll_ref = coll_ref.where('size', '>=', 800).where('price', '<=', 1499)
                }
                else if (filter_size == 3) {
                    coll_ref = coll_ref.where('size', '>=', 1500)
                }
            }
            if (filter_rooms != -1) {
                coll_ref = coll_ref.where('rooms', '==', filter_rooms)
            }

            let list = [];
            coll_ref.get().then((res) => {
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

export const getAllListings = (filterKeys) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { searchTerm, filter_type, filter_price, filter_size, filter_rooms } = filterKeys;
            console.log('filterKeys ', filterKeys)
            let coll_ref = listingCollection;
            if (filterKeys.is_featured == true) {
                coll_ref = coll_ref.where('is_featured', '==', true);
            }
            if (!isEmpty(searchTerm)) {
                coll_ref = coll_ref.where('title', '>=', searchTerm).where('title', '<=', searchTerm + '~');
            }
            if (filter_type != -1) {
                if (filter_type == 0) { // sell
                    coll_ref = coll_ref.where('isSell', '==', true);
                }
                else if (filter_type == 1) { // rent
                    coll_ref = coll_ref.where('isRent', '==', true);
                }
            }
            if (filter_price != -1) {
                if (filter_price == 0) {
                    coll_ref = coll_ref.where('price', '<=', 3999999)
                }
                else if (filter_price == 1) {
                    coll_ref = coll_ref.where('price', '>=', 4000000).where('price', '<=', 9999999)
                }
                else if (filter_price == 2) {
                    coll_ref = coll_ref.where('price', '>=', 10000000).where('price', '<=', 49999999)
                }
                else if (filter_price == 3) {
                    coll_ref = coll_ref.where('price', '>=', 50000000)
                }
            }
            if (filter_size != -1) {
                if (filter_size == 0) {
                    coll_ref = coll_ref.where('size', '<=', 299)
                }
                else if (filter_size == 1) {
                    coll_ref = coll_ref.where('size', '>=', 300).where('price', '<=', 799)
                }
                else if (filter_size == 2) {
                    coll_ref = coll_ref.where('size', '>=', 800).where('price', '<=', 1499)
                }
                else if (filter_size == 3) {
                    coll_ref = coll_ref.where('size', '>=', 1500)
                }
            }
            if (filter_rooms != -1) {
                coll_ref = coll_ref.where('rooms', '==', filter_rooms)
            }

            let list = [];
            coll_ref.get().then((res) => {
                console.log('res.docs.length', res.docs.length)
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