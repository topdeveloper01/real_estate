import { APP } from '../types'; 
import { getLanguage } from '../../common/services/translate'

const INITIAL_STATE = {
    isLoggedIn: false,
    hasLocation: false, 
    hasVerifiedPhone: false,  
 
    isNotificationVisible : false,
    user: {}, 
 
    hometab_navigation: null, 
    vendorData: {},  
    chat_channels : [],
    language: getLanguage() || 'sq', 
    city1_list : [],
    city2_list : [],
    city3_list : [],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case APP.SAFE_AREA_DIMENSIONS:
            return { ...state, safeAreaDims: action.payload };
        case APP.LOGGED_IN:
            return { ...state, isLoggedIn: action.payload }; 
        case APP.SET_USER_DATA:
            return { ...state, user: action.payload };
        case APP.SET_HAS_VERIFIED_PHONE:
            return { ...state, hasVerifiedPhone: !!action.payload }; 
        case APP.SET_ACTIVE_SCREEN_FROM_PUSH: {
            return { ...state,  
                isNotificationVisible : action.payload.isNotificationVisible == true,  
            };
        } 
        case APP.SET_HOMETAB_NAVIGATION:
            return { ...state, hometab_navigation: action.payload };
 
        case APP.SET_LANG: {
            return { ...state, language: action.payload || 'sq' }
        }

        case APP.SET_VENDOR_CART: {
            return {
                ...state, 
                vendorData: action.payload
            };
        }  

        case APP.SET_CHANNELS : {
            return {
                ...state,
                chat_channels : action.payload || []
            };
        }

        case APP.SET_CITY_1_List : {
            return {
                ...state,
                city1_list : action.payload || []
            };
        }
        case APP.SET_CITY_2_List : {
            return {
                ...state,
                city2_list : action.payload || []
            };
        }
        case APP.SET_CITY_3_List : {
            return {
                ...state,
                city3_list : action.payload || []
            };
        }

        default:
            return { ...state };
    }
};

