import { listingCollection } from '../../common/services/firebase';
import { isEmpty } from '../../common/services/utility';
import { FOR_RENT, FOR_SELL } from '../../config/constants';

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
            const { searchTerm, filter_type, filter_use_format, filter_price, filter_size, filter_rooms, filter_outer, filter_city_1, filter_city_2, filter_city_3 } = filterKeys;
            console.log('filterKeys ', filterKeys)
            let coll_ref = listingCollection.where('owner_id', '==', user_id);
            if (filterKeys.is_featured == true) {
                coll_ref = coll_ref.where('is_featured', '==', true);
            }

            if (!isEmpty(filter_city_1)) {
                coll_ref = coll_ref.where('area', '==', filter_city_1);
            }
            if (!isEmpty(filter_city_2)) {
                coll_ref = coll_ref.where('street', '==', filter_city_2);
            }
            if (!isEmpty(filter_city_3)) {
                coll_ref = coll_ref.where('building', '==', filter_city_3);
            }

            if (!isEmpty(searchTerm)) {
                coll_ref = coll_ref.where('title', '>=', searchTerm).where('title', '<=', searchTerm + '~');
            }
            if (filter_type != -1) {
                if (filter_type == FOR_SELL) { // sell
                    coll_ref = coll_ref.where('isSell', '==', true);
                }
                else if (filter_type == FOR_RENT) { // rent
                    coll_ref = coll_ref.where('isSell', '==', false);
                }
            }
            if (filter_rooms != -1) {
                coll_ref = coll_ref.where('rooms', '==', filter_rooms)
            }

            if (filter_use_format != -1) {
                coll_ref = coll_ref.where('type_use', '==', filter_use_format);
            }

            if (filter_outer == 0) {
                coll_ref = coll_ref.where('outer_roof', '==', true)
            }
            else if (filter_outer == 1) {
                coll_ref = coll_ref.where('outer_terrace', '==', true)
            }

            let list = [];
            coll_ref.get().then((res) => {
                res.docs.forEach(doc => {
                    list.push(doc.data())
                })

                if (filter_price != -1) {
                    if (filter_price == 0) {
                        list = list.filter(item => item.price <= 3999999)
                    }
                    else if (filter_price == 1) {
                        list = list.filter(item => item.price >= 4000000 && item.price <= 9999999)
                    }
                    else if (filter_price == 2) {
                        list = list.filter(item => item.price >= 10000000 && item.price <= 49999999)
                    }
                    else if (filter_price == 3) {
                        list = list.filter(item => item.price >= 50000000)
                    }
                }

                if (filter_size != -1) {
                    if (filter_size == 0) {
                        list = list.filter(item => item.actual_size <= 299)
                    }
                    else if (filter_size == 1) {
                        list = list.filter(item => item.actual_size >= 300 && item.actual_size <= 799)
                    }
                    else if (filter_size == 2) {
                        list = list.filter(item => item.actual_size >= 800 && item.actual_size <= 1499)
                    }
                    else if (filter_size == 3) {
                        list = list.filter(item => item.actual_size >= 1500)
                    }
                }
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
            const { searchTerm, filter_type, filter_use_format, filter_price, filter_size, filter_rooms, filter_outer, filter_city_1, filter_city_2, filter_city_3 } = filterKeys;
            console.log('filterKeys ', filterKeys)
            let coll_ref = listingCollection;
            if (filterKeys.is_featured == true) {
                coll_ref = coll_ref.where('is_featured', '==', true);
            }
            if (!isEmpty(filter_city_1)) {
                coll_ref = coll_ref.where('area', '==', filter_city_1);
            }
            if (!isEmpty(filter_city_2)) {
                coll_ref = coll_ref.where('street', '==', filter_city_2);
            }
            if (!isEmpty(filter_city_3)) {
                coll_ref = coll_ref.where('building', '==', filter_city_3);
            }
            if (!isEmpty(searchTerm)) {
                coll_ref = coll_ref.where('title', '>=', searchTerm).where('title', '<=', searchTerm + '~');
            }
            if (filter_type != -1) {
                if (filter_type == FOR_SELL) { // sell
                    coll_ref = coll_ref.where('isSell', '==', true);
                }
                else if (filter_type == FOR_RENT) { // rent
                    coll_ref = coll_ref.where('isSell', '==', false);
                }
            }

            if (filter_type != -1) {
                if (filter_type == FOR_SELL) { // sell
                    coll_ref = coll_ref.where('isSell', '==', true);
                }
                else if (filter_type == FOR_RENT) { // rent
                    coll_ref = coll_ref.where('isSell', '==', false);
                }
            }

            if (filter_rooms != -1) {
                coll_ref = coll_ref.where('rooms', '==', filter_rooms)
            }

            if (filter_use_format != -1) {
                coll_ref = coll_ref.where('type_use', '==', filter_use_format);
            }

            if (filter_outer == 0) {
                coll_ref = coll_ref.where('outer_roof', '==', true)
            }
            else if (filter_outer == 1) {
                coll_ref = coll_ref.where('outer_terrace', '==', true)
            }

            let list = [];
            coll_ref.get().then((res) => {
                console.log('res.docs.length', res.docs.length)
                res.docs.forEach(doc => {
                    list.push(doc.data())
                })

                if (filter_price != -1) {
                    if (filter_price == 0) {
                        list = list.filter(item => item.price <= 3999999)
                    }
                    else if (filter_price == 1) {
                        list = list.filter(item => item.price >= 4000000 && item.price <= 9999999)
                    }
                    else if (filter_price == 2) {
                        list = list.filter(item => item.price >= 10000000 && item.price <= 49999999)
                    }
                    else if (filter_price == 3) {
                        list = list.filter(item => item.price >= 50000000)
                    }
                }

                if (filter_size != -1) {
                    if (filter_size == 0) {
                        list = list.filter(item => item.actual_size <= 299)
                    }
                    else if (filter_size == 1) {
                        list = list.filter(item => item.actual_size >= 300 && item.actual_size <= 799)
                    }
                    else if (filter_size == 2) {
                        list = list.filter(item => item.actual_size >= 800 && item.actual_size <= 1499)
                    }
                    else if (filter_size == 3) {
                        list = list.filter(item => item.actual_size >= 1500)
                    }
                }

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
                id: data.id == null ? listingCollection.doc().id : data.id,
                ...data,
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