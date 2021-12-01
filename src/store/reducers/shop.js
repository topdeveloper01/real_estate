import {APP} from '../types';
import {OrderType_Delivery, Pay_COD} from '../../config/constants';

const INITIAL_STATE = { 
    items: [],
    vendorData: {},
    cutlery : 1,
    coupon: {},
    comments: '',
    cartPrice : {
        subtotal : 0,
        discount : 0,
        cashback : 0,
        small_order_fee : 0, 
        delivery_fee : 0,
        order_total : 0,

        min_order_price : 0,
    },
    delivery_info : {
        handover_method: OrderType_Delivery,
        address : {},
        contactless_delivery : false,
        tip_rider : 0, 
        comments: '',
        pickup_date : '',
        pickup_time : '',
        num_guests : 0,
        reserve_for : {}
    }, 
    payment_info : {
        method : 'cash',
        cards: [],
        selected_card: null,
        comments: '',
        splits : []
    },
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case APP.UPDATE_CART_ITEMS: {
            return {
                ...state,
                items: action.payload,
                payment_info : {
                    ...state.payment_info,
                    splits : []
                }
            };
        }
        case APP.CLEAR_CART : {
            return {
                ...INITIAL_STATE,
                items: action.payload || [],
                payment_info : {
                    ...state.payment_info,
                    splits : []
                }
            };
        } 
        case APP.SET_CUTLERY_CART: {
            return {
                ...state,
                cutlery: action.payload,
            };
        }
        case APP.SET_COMMENT_CART: {
            return {
                ...state,
                comments: action.payload,
            };
        }
        case APP.SET_COUPON_CART: {
            return {
                ...state,
                coupon: action.payload || {},
            };
        }
        case APP.SET_PRICE_CART: {
            return {
                ...state,
                cartPrice: action.payload,
            };
        }

        case APP.SET_DELIVERY_INFO_CART: {
            return {
                ...state,
                delivery_info : {
                    ...state.delivery_info,
                    ...action.payload
                }
            };
        } 
        case APP.SET_PAYMENT_INFO_CART: {
            return {
                ...state,
                payment_info: action.payload,
            };
        } 
          
        case APP.SET_VENDOR_CART: {
            return {
                ...state, 
                vendorData: action.payload,
                payment_info : {
                    ...state.payment_info,
                    splits : []
                }
            };
        }  
        default:
            return {...state};
    }
};

