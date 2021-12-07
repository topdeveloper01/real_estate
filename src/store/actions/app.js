import {APP} from '../types'; 
import { setI18nConfig, getLanguage, setLanguage } from '../../common/services/translate';
import apiFactory from '../../common/services/apiFactory';
import { city1_Collection, city2_Collection, city3_Collection, pushesCollection } from '../../common/services/firebase';

export const setHomeTabNavigation=(payload) =>{
    return {type : APP.SET_HOMETAB_NAVIGATION, payload : payload}
}
export const setInitHomeTab=(payload) =>{
    return {type : APP.SET_INIT_HOME_TAB, payload : payload}
}
         
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
      
export const goActiveScreenFromPush = (value) => async dispatch => {
    await dispatch({
        type: APP.SET_ACTIVE_SCREEN_FROM_PUSH,
        payload: value,
    });
};
 
export const setVendorCart = (payload) => {
	return { type: APP.SET_VENDOR_CART, payload: payload }
}

export const setAllChannels=(payload)=>{
    return {type : APP.SET_CHANNELS, payload : payload}
}
 

export const sendPushNotification = (notice) => {
    return new Promise((resolve, reject) => {
        apiFactory.post('sendPush', notice).then(async ({data}) => {
            resolve();
        }, reject);
    });
};


export const getAllPushes = () => {
    return new Promise(async (resolve, reject) => {
        try {  
            let list = [];
            pushesCollection.orderBy('time', 'desc').get().then((res) => {
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

export const getAllCities = (level) => {
    return new Promise(async (resolve, reject) => {
        try {  
            let coll_ref = city1_Collection;
            if (level == 2) {
                coll_ref = city2_Collection;
            }
            else if (level == 3) {
                coll_ref = city3_Collection;
            }
            let list = [];
            coll_ref.orderBy('name', 'asc').get().then((res) => {
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

export const createCity = (level, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let coll_ref = city1_Collection;
            if (level == 2) {
                coll_ref = city2_Collection;
            }
            else if (level == 3) {
                coll_ref = city3_Collection;
            }

            let cityData = {
                ...data,
                id: coll_ref.doc().id
            }

            coll_ref.doc(cityData.id).set(cityData).then(() => {
                resolve(cityData)
            })
                .catch((e) => {
                    reject(e);
                })
        } catch (e) {
            reject(e);
        }
    });
};
