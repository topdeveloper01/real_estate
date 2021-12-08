import { KEYS, setStorageKey } from '../../common/services/storage';
import { APP } from '../types';
import apiFactory from '../../common/services/apiFactory';
import messaging from '@react-native-firebase/messaging';
import { userCollection } from '../../common/services/firebase';

export const PHONE_NOT_VERIFIED = 'PHONE_NOT_VERIFIED';

export const getLoggedInUserData = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            userCollection.doc(user_id).get().then((res) => {
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
 

export const register = (user) => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            let fcm_token = await messaging().getToken();
            let userData={
                ...user, token: fcm_token
            }
            userCollection.doc(user.id).set(userData).then(async () => {
                await setStorageKey(KEYS.TOKEN, user.id);
                dispatch({
                    type: APP.SET_USER_DATA,
                    payload: userData,
                });
                resolve(userData)
            })
            .catch((e)=>{
                reject(e);
            })
        } catch (e) {
            reject(e);
        }
    });
};

export const facebookLogin = (token) => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            const device = {
                token: await messaging().getToken(),
            };
            apiFactory.post('login/facebook', {
                access_token: token,
                device,
            }).then(async ({ data }) => {
                await setStorageKey(KEYS.TOKEN, data.token);
                const user = await getLoggedInUserData();
                dispatch({
                    type: APP.SET_USER_DATA,
                    payload: user,
                });
                dispatch({
                    type: APP.SET_HAS_VERIFIED_PHONE,
                    payload: !!user['verified_by_mobile'],
                });

                resolve(user);

            }, async (e) => {
                reject(e);
            });
        } catch (e) {
            reject(e);
        }
    });
};

export const googleLogin = (id_token) => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Promise googleLogin')
            const device = {
                token: await messaging().getToken(),
            };
            apiFactory.post('login/google', {
                id_token: id_token,
                device,
            }).then(async ({ data }) => {

                console.log('login/google', data)

                await setStorageKey(KEYS.TOKEN, data.token);
                const user = await getLoggedInUserData();
                dispatch({
                    type: APP.SET_USER_DATA,
                    payload: user,
                });
                dispatch({
                    type: APP.SET_HAS_VERIFIED_PHONE,
                    payload: !!user['verified_by_mobile'],
                });

                resolve(user);

            }, async (e) => {
                reject(e);
            });
        } catch (e) {
            reject(e);
        }
    });
};
 

export const setAsLoggedIn = () => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            await dispatch({
                type: APP.LOGGED_IN,
                payload: true,
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
 

export const logout = () => async dispatch => {
    return new Promise(async (resolve) => {
        try { 
            await setStorageKey(KEYS.TOKEN, null);
            await dispatch({
                type: APP.LOGGED_IN,
                payload: false,
            });
            await dispatch({
                type: APP.USER_LOGGED_OUT,
                payload: false,
            }); 
            resolve();
        } catch (e) {
            resolve();
        }
    });
};

export const updateProfileDetails = (user) => async dispatch => {
    return new Promise(async (resolve, reject) => { 
        let fcm_token = await messaging().getToken();
        let userData={
            ...user, token: fcm_token
        }
        userCollection.doc(userData.id).update(userData).then(() => {
            dispatch({
                type: APP.SET_USER_DATA,
                payload: userData,
            });
            resolve(user)
        })
        .catch((e)=>{
            reject(e);
        }) 
    });
};
 

export const setHasVerifiedPhone = (value) => async dispatch => {
    dispatch({
        type: APP.SET_HAS_VERIFIED_PHONE,
        payload: value,
    });
};

export const setUserNeedLogin = (value) => async dispatch => {
    dispatch({
        type: APP.SET_NEED_LOGIN,
        payload: value,
    });
};

export const getLoggedInUser = (user_id) => dispatch => {
    return new Promise(async (resolve) => {
        try {
            const user = await getLoggedInUserData(user_id); 
            if (user != null) {
                await setStorageKey(KEYS.TOKEN, user_id);
            }
            dispatch({
                type: APP.SET_USER_DATA,
                payload: user || {},
            });
            resolve(user);
        } catch (e) {
            resolve();
        }
    });
};
