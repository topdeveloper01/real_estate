import { APP } from '../types';
import { OrderType_Delivery, VSort_Title } from '../../config/constants'
import RouteNames from '../../routes/names';
import { getLanguage } from '../../common/services/translate'

const INITIAL_STATE = {
    isLoggedIn: false,
    hasLocation: false,
    isVisibleTabBar: true,
    hasVerifiedPhone: false,
    seenOnboard: false,
    needLogin : false,

    pushOrderDetails : null,
    pushConversationId : null,
    pushBlogId : null,
    pushChatMsgTime : null,
    isOrderSummVisible: false,
    isWalletVisible: false,
    isInvitationVisible : false,
    isChatVisible : false,
    isBlogVisible : false,

    coordinates: {},
    address: {},

    addresses: [],
    default_shippingaddress: {},
    user: {},
    home_vendor_filter: {
        vendor_type: 'Vendors',
        order_type: OrderType_Delivery,
        food_categs: [],
        is_meal : false,
        is_dietary : false,
        ongoing_offer: false,
        open_now: false,
        online_payment: false,
        low_fee: null,
        high_fee: null,
        searchTerm: ''
    },
    home_vendor_sort: VSort_Title,

    hometabs_init_tabname: RouteNames.HomeStack,
    hometab_navigation: null,

    home_orders_filter: {
        discount: false,
        cashback: false,
        promotion: false,
        split: false,
        searchTerm: ''
    },

    closedRestaurantData: {},
    isReviewModalVisible: false,
    reviewModalData: null,
    safeAreaDims: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    vendors: {
        loading: false,
        loaded: false,
        error: null,
        data: [],
        featured: [],
        exclusiveVendors: [],
        newVendors: [],
        freeDeliveryVendors: [],
    },
    featureBlocks: {
        loading: false,
        loaded: false,
        error: null,
        data: [],
    },
    favourites: {
        loading: false,
        loaded: false,
        error: null,
        data: [],
    },
    unreviewedorder: {
        loading: false,
        loaded: false,
        error: null,
        data: null,
    },
    banners: [],

    language: getLanguage() || 'sq',
    message: null,
    tmp_order: {},
    pass_changed: false,

    tmp_new_address: {},
    tmpFoodData: {},

    blog_categories: [],
    profile_blog_filter: {
        category_id: null,
        searchTerm: ''
    },

    default_orders_tab : null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case APP.SAFE_AREA_DIMENSIONS:
            return { ...state, safeAreaDims: action.payload };
        case APP.LOGGED_IN:
            return { ...state, isLoggedIn: action.payload };
        case APP.SEEN_ONBOARD:
            return { ...state, seenOnboard: action.payload }; 
        case APP.SET_USER_DATA:
            return { ...state, user: action.payload };
        case APP.SET_HAS_VERIFIED_PHONE:
            return { ...state, hasVerifiedPhone: !!action.payload };
        case APP.SET_LOCATION_DATA:
            return { ...state, location: action.payload };
        case APP.APPLY_LOCATION: {
            return {
                ...state,
                hasLocation: true,
                coordinates: action.payload.coordinates,
                address: action.payload.address,
            };
        }
        case APP.SET_HASLOCATION_FLAG: {
            return { ...state, hasLocation: action.payload };
        }
        case APP.SET_NEED_LOGIN: {
            return { ...state, needLogin: action.payload };
        }
        case APP.SET_ACTIVE_SCREEN_FROM_PUSH: {
            return { ...state, 
                isWalletVisible: action.payload.isWalletVisible == true, 
                isOrderSummVisible : action.payload.isOrderSummVisible == true,
                isInvitationVisible : action.payload.isInvitationVisible == true,
                pushOrderDetails : action.payload.order,
                pushConversationId : action.payload.pushConversationId, 
                pushBlogId : action.payload.pushBlogId, 
                pushChatMsgTime : action.payload.pushChatMsgTime, 
                isChatVisible : action.payload.isChatVisible == true, 
                isBlogVisible : action.payload.isBlogVisible == true, 
            };
        }
        case APP.GET_BANNERS_SUCCESS: {
            return { ...state, banners: action.payload };
        }
        case APP.SET_UNREVIEWED_ORDER: {
            return {
                ...state,
                isReviewModalVisible: !!action.payload,
                reviewModalData: action.payload,
            };
        }
        case APP.CLOSE_REVIEW_MODAL: {
            return {
                ...state,
                isReviewModalVisible: false,
                reviewModalData: null,
            };
        }
        case APP.SET_ADDRESSES: {
            return {
                ...state,
                addresses: action.payload,
            };
        }
        case APP.DELETED_ADDRESS: {
            const { addresses } = state;

            return {
                ...state,
                addresses: addresses.filter(a => a.id !== action.payload),
            };
        }

        case APP.SET_DEFAULT_ORDERS_TAB:
            return { ...state, default_orders_tab: action.payload };

        case APP.SET_INIT_HOME_TAB:
            return { ...state, hometabs_init_tabname: action.payload };
        case APP.SET_HOMETAB_NAVIGATION:
            return { ...state, hometab_navigation: action.payload };

        case APP.TMP_PASS_CHANGED: {
            return { ...state, pass_changed: action.payload || false }
        }

        case APP.SET_VENDOR_FILTER: {
            return { ...state, home_vendor_filter: { ...state.home_vendor_filter, ...action.payload } }
        }
        case APP.SET_VENDOR_SORT: {
            return { ...state, home_vendor_sort: action.payload || VSort_Title }
        }

        case APP.SET_ORDERS_FILTER: {
            return { ...state, home_orders_filter: { ...state.home_orders_filter, ...action.payload } }
        }

        case APP.TMP_ADDR_PICKED: {
            return { ...state, tmp_new_address: action.payload || {} }
        }
        case APP.TMP_SET_FOOD: {
            console.log('set tmp food', action.payload.isFav)
            return {
                ...state,
                tmpFoodData: action.payload || {},
            };
        }
        case APP.TMP_SET_ORDER: {
            return {
                ...state,
                tmp_order: action.payload || {},
            };
        }

        case APP.SET_LANG: {
            return { ...state, language: action.payload || 'sq' }
        }

        case APP.SET_BLOG_CATEGORIES: {
            return { ...state, blog_categories: action.payload || [] };
        }
        case APP.SET_PROFILE_BLOG_FILTER: {
            return { ...state, profile_blog_filter: { ...state.profile_blog_filter, ...action.payload } }
        }

        default:
            return { ...state };
    }
};

