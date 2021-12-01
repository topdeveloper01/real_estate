import {APP} from '../types';
import {KEYS, setStorageKey} from '../../common/services/storage';
import apiFactory from '../../common/services/apiFactory';
import {getSafeAreaDimensions} from '../../common/services/utility';
import { setI18nConfig, getLanguage, setLanguage } from '../../common/services/translate';

export const setHomeTabNavigation=(payload) =>{
    return {type : APP.SET_HOMETAB_NAVIGATION, payload : payload}
}
export const setInitHomeTab=(payload) =>{
    return {type : APP.SET_INIT_HOME_TAB, payload : payload}
}
   
export const setTmpPassChanged=(payload)=>{
    return {type : APP.TMP_PASS_CHANGED, payload : payload}
}

export const setTmpLocationPicked=(payload)=>{
    return {type : APP.TMP_ADDR_PICKED, payload : payload}
}

export const setTmpFood=(payload)=>{
    return {type : APP.TMP_SET_FOOD, payload : payload}
}

export const setTmpOrder=(payload)=>{
    return {type : APP.TMP_SET_ORDER, payload : payload}
}
 
export const setHomeVendorFilter = (payload) => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {    
            await dispatch({
                type: APP.SET_VENDOR_FILTER,
                payload: payload
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
 
export const setHomeVendorSort=(payload)=>{
    return {type : APP.SET_VENDOR_SORT, payload : payload}
}

export const setHomeOrdersFilter=(payload)=>{
    return {type : APP.SET_ORDERS_FILTER, payload : payload}
}

export const setProfileBlogs=(payload)=>{
    return {type : APP.SET_BLOG_CATEGORIES, payload : payload}
} 
export const setProfileBlogFilter=(payload)=>{
    return {type : APP.SET_PROFILE_BLOG_FILTER, payload : payload}
}

export const setAddress = ({coordinates, address}) => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {   
            await setStorageKey(KEYS.LAST_COORDINATES, coordinates);
            await dispatch({
                type: APP.APPLY_LOCATION,
                payload: {
                    coordinates,
                    address,
                },
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
 
export const setAppLang = (language) => dispatch => { 
    return new Promise(async resolve => {
        await setLanguage(language).then(); 
        await dispatch({type : APP.SET_LANG, payload : language});
        resolve();
    });
};

export const loadAppLang = () => dispatch => { 
    return new Promise(async resolve => {
        await setI18nConfig().then(); 
        await dispatch({type : APP.SET_LANG, payload : getLanguage()});
        resolve();
    });
};

export const setHasLocation = (value) => dispatch => {
    return new Promise(async resolve => { 
        await dispatch({
            type: APP.SET_HASLOCATION_FLAG,
            payload: !!value,
        });
        resolve();
    });
};

export const getBanners = (latitude, longitude) => dispatch => {
    return new Promise(resolve => {
        apiFactory.get(`banners?lat=${latitude}&lng=${longitude}`).then(({data}) => {
            dispatch({
                type: APP.GET_BANNERS_SUCCESS,
                payload: data.banners,
            });
            resolve(data.banners);
        }, () => resolve([]));
    });
};

export const getLastUnReviewedOrder = () => dispatch => {
    return new Promise(resolve => {
        apiFactory.get('orders/un-reviewed').then(({data}) => {
            dispatch({
                type: APP.SET_UNREVIEWED_ORDER,
                payload: data.order,
            });
            resolve();
        }, (error) => {
            console.log(error);
        });
    });
};

export const getFriends = (status, searchTerm, filter_ids, online_payment) => dispatch => { 
    return new Promise(resolve => {
        apiFactory.post('users/friends', {
            status : status,
            name : searchTerm == '' ? null : searchTerm,
            filter_ids : filter_ids,
            online_payment : online_payment 
        })
        .then(({data}) => { 
            resolve(data.friends);
        }, 
        () => resolve([]));
    });
};


export const getAddresses = () => dispatch => {
    return new Promise(resolve => {
        apiFactory.get('addresses').then(({data}) => {
            dispatch({
                type: APP.SET_ADDRESSES,
                payload: data.addresses || [],
            });
            resolve(data.addresses);
        }, () => resolve([]));
    });
};

export const saveAddress = (address) => dispatch => {
    return new Promise((resolve, reject) => {
        if (address.id) {
            apiFactory.put(`addresses/${address.id}`, address).then(() => {
                resolve();
            }, reject);
        } else {
            apiFactory.post('addresses', address).then(async ({data}) => {
                resolve();
            }, reject);
        }
    });
};

export const addDefaultAddress = (address) => dispatch => {
    return new Promise((resolve, reject) => {
        apiFactory.post('addresses/default', address).then(async ({data}) => {
            resolve();
        }, reject);
    });
};

export const deleteAddress = (id) => dispatch => {
    return new Promise((resolve, reject) => {
        apiFactory.delete(`addresses/${id}`).then(() => {
            dispatch({
                type: APP.DELETED_ADDRESS,
                payload: id,
            });
            resolve();
        }, reject);
    });
};

export const setAddressAsDefault = (address) => dispatch => {
    return new Promise((resolve, reject) => {
        address.favourite = true;
        apiFactory.put(`addresses/${address.id}`, address).then(resolve, reject);
    });
};

export const setSafeAreaData = () => dispatch => {
    return new Promise(async resolve => {
        const dim = await getSafeAreaDimensions();
        dispatch({
            type: APP.SAFE_AREA_DIMENSIONS,
            payload: dim,
        });
        resolve();
    });
};

export const closeRatingModal = () => async dispatch => {
    await dispatch({
        type: APP.CLOSE_REVIEW_MODAL,
    });
};

export const goActiveScreenFromPush = (value) => async dispatch => {
    await dispatch({
        type: APP.SET_ACTIVE_SCREEN_FROM_PUSH,
        payload: value,
    });
};

export const setDefaultOrdersTab = (value) => async dispatch => {
    await dispatch({
        type: APP.SET_DEFAULT_ORDERS_TAB,
        payload: value,
    });
};