import { APP } from '../types';
import { KEYS, setStorageKey } from '../../common/services/storage';
import apiFactory from '../../common/services/apiFactory';
import { translate } from '../../common/services/translate';



export const AddProduct2Cart = (cartItem) => async (dispatch, getState) => {
	return new Promise(async (resolve, reject) => {
		try {
			let items = getState().shop.items.slice(0, getState().shop.items.length);
			let foundIndex = items.findIndex((i) => i.id == cartItem.id);
			if (foundIndex == -1) {
				items.push(cartItem)
			}
			else {
				items[foundIndex].quantity = cartItem.quantity;
				items[foundIndex].comments = cartItem.comments;
				items[foundIndex].options = cartItem.options;
			}

			await setStorageKey(KEYS.CART_ITEMS, items);
			await dispatch({
				type: APP.UPDATE_CART_ITEMS,
				payload: items,
			});
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};


export const AddProductVendorCheck = (cartItem) => async (dispatch, getState) => {
	return new Promise(async (resolve, reject) => {
		try {
			let items = getState().shop.items.slice(0, getState().shop.items.length);
			let foundIndex = items.findIndex((i) => i.vendor_id != getState().shop.vendorData.id);

			if (foundIndex == -1) {
				resolve(true);
			}
			else {
				resolve(false);
			}
			
		} catch (e) {
			reject(e);
		}
	});
};

export const removeProductFromCart = (cartItem, isAll = false) => async (dispatch, getState) => {
	return new Promise(async (resolve, reject) => {
		try { 
			let items = getState().shop.items.slice(0, getState().shop.items.length);
			if (isAll == true) {
				items = items.filter(i => i.id != cartItem.id);
			}
			else {
				let foundIndex = items.findIndex((i) => i.id == cartItem.id);
				if (foundIndex != -1) {
					if(items[foundIndex].quantity <= 1) {
						items = items.filter(i => i.id != cartItem.id);
					}
					else {
						items[foundIndex].quantity = items[foundIndex].quantity - 1;
					}
				} 
			}

			await setStorageKey(KEYS.CART_ITEMS, items);
			await dispatch({
				type: APP.UPDATE_CART_ITEMS,
				payload: items,
			});
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

export const updateCartItems = (items) => async (dispatch) => {
	return new Promise(async (resolve, reject) => {
		try {
			await setStorageKey(KEYS.CART_ITEMS, items);
			await dispatch({
				type: APP.UPDATE_CART_ITEMS,
				payload: items,
			});
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};
 
export const setCutleryCart = (cutlery) => {
	return { type: APP.SET_CUTLERY_CART, payload: cutlery }
}
export const setCommentCart = (comments) => {
	return { type: APP.SET_COMMENT_CART, payload: comments }
}
export const setCouponCart = (coupon) => {
	return { type: APP.SET_COUPON_CART, payload: coupon }
}
export const setPriceCart = (prices) => {
	return { type: APP.SET_PRICE_CART, payload: prices }
}

export const setDeliveryInfoCart = (payload) => {
	return { type: APP.SET_DELIVERY_INFO_CART, payload: payload }
}

export const setPaymentInfoCart = (payload) => {
	return { type: APP.SET_PAYMENT_INFO_CART, payload: payload }
}

export const setVendorCart = (payload) => {
	return { type: APP.SET_VENDOR_CART, payload: payload }
}

export const updateCart = (items, restaurant) => async (dispatch) => {
	return new Promise(async (resolve, reject) => {
		try {
			await setStorageKey(KEYS.CART_ITEMS, items);
			await setStorageKey(KEYS.CART_RESTAURANT, restaurant);
			await dispatch({
				type: APP.UPDATE_CART,
				payload: items,
				restaurant,
			});
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};
 
 
export const setStoreAddress = (address) => async (dispatch) => {
	dispatch({
		type: APP.SET_ADDRESS,
		payload: address,
	});
};
 

export const clearCart = (items) => async (dispatch) => {
	return new Promise(async (resolve, reject) => {
		try { 
			await setStorageKey(KEYS.CART_ITEMS, items);
			await dispatch({
				type: APP.CLEAR_CART,
				payload: items
			}); 
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

export const sendOrder = (orderData) => (dispatch) => {
	return new Promise(async (resolve, reject) => {
		apiFactory.post('checkout', orderData).then(
			async ({ data }) => {
				try {
					resolve(data.order);
				} catch (e) {
					reject(e);
				}
			},
			(e) => {
				reject(e);
			}
		);
	});
};

export const reOrder = (order, restaurant) => (dispatch, getState) => {
	return new Promise(async (resolve, reject) => {
		apiFactory.get(`orders/${order.id}/reorder`).then(
			async ({ data }) => {
				// if (!data['vendor_is_open']) {
				// 	reject(translate('restaurant_details.restaurant_closed'));
				// }
				const cartProducts = data.products;
				const items = cartProducts.map((cartProduct) => {
					const orderProduct = order.products.find((p) => p['product_id'] === cartProduct.id);
					const quantity = orderProduct ? orderProduct.quantity : 1;
					const options = orderProduct ? orderProduct.options : [];
					const comments = orderProduct ? orderProduct.item_instructions : ''; 

					return {
						...cartProduct,
						options,
						comments,
						quantity,
					}; 
				});

				await setStorageKey(KEYS.CART_ITEMS, items);
				await dispatch({
					type: APP.CLEAR_CART,
					payload: items
				});
				if (getState().shop.vendorData == null || getState().shop.vendorData.id != restaurant.id){
					await dispatch({ type: APP.SET_VENDOR_CART, payload: restaurant })
				} 
				resolve(items);
			},
			(error) => reject(error)
		);
	});
};

export const getDiscount = (vendorId, order_by, total) => (dispatch) => {
	return new Promise((resolve) => {
		let endpoint = `discounts?vendor_id=${vendorId}`
		if(total) {
			endpoint = endpoint + `&subtotal=${total}`
		}
		if(order_by) {
			endpoint = endpoint + `&order_by=${order_by}`
		}
		apiFactory.get(endpoint).then(
			({ data }) => {
				resolve(data.discounts ? data.discounts : []);
			},
			() => {
				resolve({});
			}
		);
	});
};

export const setCouponCode = (code) => async (dispatch) => {
	return new Promise(async (resolve, reject) => {
		try {
			await setStorageKey(KEYS.COUPON_CODE, code);
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};
