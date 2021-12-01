import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Platform, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import BraintreeDropIn from 'react-native-braintree-dropin-ui';
import { useApplePay } from '@stripe/stripe-react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import Tooltip from 'react-native-walkthrough-tooltip';
import { setTmpOrder, setDefaultOrdersTab } from '../../../store/actions/app';
import { setPaymentInfoCart, setDeliveryInfoCart, clearCart, sendOrder } from '../../../store/actions/shop';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import Config from '../../../config';
import apiFactory from '../../../common/services/apiFactory';
import alerts from '../../../common/services/alerts';
import { Pay_COD, Pay_Apple, Pay_Paypal, OrderType_Reserve, OrderType_Delivery } from '../../../config/constants';
import MainBtn from '../../../common/components/buttons/main_button';
import DotBorderButton from '../../../common/components/buttons/dot_border_button';
import InfoRow from '../../../common/components/InfoRow';
import PayMethodItem from '../components/PayMethodItem';
import CardPayMethodItem from '../components/CardPayMethodItem';
import Header1 from '../../../common/components/Header1';
import OrderFailedModal from '../../../common/components/modals/OrderFailedModal';
import RouteNames from '../../../routes/names';

const CartPaymentScreen = (props) => {
	const { presentApplePay, confirmApplePayPayment, isApplePaySupported } = useApplePay();

	const [loading, setLoading] = useState(false);
	const [isBottomModal, showBottomModal] = useState(false);
	const [isOrderFailedModal, showOrderFailedModal] = useState(false);
	const [OrderFailedMessage, setOrderFailedMessage] = useState(translate('cart.order_failed'));
	const [cards, setCards] = useState([]);
	const [paypal_client_token, setPaypalClientToken] = useState(null);

	const [showSmallOrderFeeInfoPop, setShowSmallOrderFeePop] = useState(false);

	useEffect(() => {
		loadPaymentMethods();
		const focusListener = props.navigation.addListener('focus', () => {
			loadPaypalClientToken();
		});

		return focusListener; // remove focus listener when it is unmounted
	}, [props.navigation]);

	useEffect(() => {
		loadPaymentMethods();
	}, [props.user.default_card_id]);

	const setDefaultCard = (card_list) => {
		let found_index = card_list.findIndex((card) => card.id == props.user.default_card_id);
		if (found_index == -1) {
			props.setPaymentInfoCart({
				...props.payment_info,
				selected_card: card_list.length > 0 ? card_list[0] : null,
			});
		} else {
			props.setPaymentInfoCart({
				...props.payment_info,
				selected_card: card_list[found_index],
			});
		}
	};

	const loadPaymentMethods = () => {
		apiFactory.get(`stripe/payment-methods`).then(
			({ data }) => {
				// console.log('loadPaymentMethods', data)
				let loadedCards = data || [];
				setCards(loadedCards);
				setDefaultCard(loadedCards);
			},
			(error) => {
				console.log('loadPaymentMethods error', error);
				const message = error.message || translate('generic_error');
				// alerts.error(translate('alerts.error'), message);
			}
		);
	};

	const loadPaypalClientToken = () => {
		apiFactory.post(`checkout/get-paypal-client-token`).then(
			({ data }) => {
				// console.log('loadPaypalClientToken', data.client_token)
				setPaypalClientToken(data.client_token);
			},
			(error) => {
				console.log('loadPaypalClientToken error', error);
				const message = error.message || translate('generic_error');
				// alerts.error(translate('alerts.error'), message);
			}
		);
	};

	const calculateOrderTotal = () => {
		const { subtotal, discount, cashback, small_order_fee, delivery_fee } = props.cartPrice;

		let total = subtotal - cashback - discount;
		if (props.delivery_info.handover_method == OrderType_Delivery) {
			total = total + small_order_fee;
			total = total + delivery_fee;

			// if (props.order_data.vendorData != null && props.order_data.vendorData.delivery_type == "Snapfood" && props.delivery_info.tip_rider > 0) {
			//     total = total + parseInt(props.delivery_info.tip_rider);
			// }
		}
		return total;
	};

	const orderBilled = () => {
		let splits = props.payment_info.splits || [];
		if (splits.length == 0) {
			return false;
		}

		let isBilled = true;
		splits.map((item) => {
			if (item.price == null) {
				isBilled = false;
			}
		});
		return isBilled;
	};

	const _renderPaymentMethod = () => {
		return (
			<View style={[Theme.styles.col_center_start, styles.sectionView]}>
				<View style={[Theme.styles.row_center, { width: '100%', marginBottom: 16 }]}>
					<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>{translate('cart.payment_method')}</Text>
				</View>
				<PayMethodItem
					data={translate(Pay_COD)}
					checked={props.payment_info.method == 'cash'}
					onPress={() => {
						props.setPaymentInfoCart({
							...props.payment_info,
							method: 'cash',
						});
					}}
				/>
				{props.order_data.vendorData != null && props.order_data.vendorData.online_payment == 1 && (
					<React.Fragment>
						<CardPayMethodItem
							checked={props.payment_info.method == 'stripe'}
							cards={cards}
							curCard={props.payment_info.selected_card}
							onPress={() => {
								props.setPaymentInfoCart({
									...props.payment_info,
									method: 'stripe',
								});
							}}
							onPressCard={(card) => {
								props.setPaymentInfoCart({
									...props.payment_info,
									selected_card: card,
								});
							}}
							onAddCard={() => {
								props.navigation.navigate(RouteNames.NewCardScreen);
							}}
						/>
						{/* {paypal_client_token != null && paypal_client_token != '' && (
							<PayMethodItem
								data={translate(Pay_Paypal)}
								checked={props.payment_info.method == 'paypal'}
								onPress={() => {
									props.setPaymentInfoCart({
										...props.payment_info,
										method: 'paypal',
									});
								}}
							/>
						)} */}
						{/* {Config.isAndroid == false && isApplePaySupported && (
							<PayMethodItem
								data={translate(Pay_Apple)}
								checked={props.payment_info.method == 'apple'}
								onPress={() => {
									props.setPaymentInfoCart({
										...props.payment_info,
										method: 'apple',
									});
								}}
							/>
						)} */}
					</React.Fragment>
				)}
			</View>
		);
	};

	const _renderOrderTotal = () => {
		return (
			<View style={[Theme.styles.col_center_start, styles.sectionView, { borderBottomWidth: 0 }]}>
				<View style={[Theme.styles.col_center_start, styles.sectionView]}>
					<InfoRow name={translate('cart.subtotal')} value={parseInt(props.cartPrice.subtotal) + ' L'} />
					{props.cartPrice.discount >= 0 && (
						<InfoRow
							name={translate('cart.discount_amount')}
							value={(props.cartPrice.discount > 0 ? '-' : '') + parseInt(props.cartPrice.discount) + ' L'}
						/>
					)}
					{props.cartPrice.cashback >= 0 && (
						<InfoRow
							name={translate('cart.cashback_amount')}
							value={(props.cartPrice.cashback > 0 ? '-' : '') + parseInt(props.cartPrice.cashback) + ' L'}
						/>
					)}
					{props.delivery_info.handover_method == OrderType_Delivery && props.cartPrice.small_order_fee > 0 && (
						<InfoRow
							keyItem={
								<View style={[Theme.styles.row_center_start, { flex: 1 }]}>
									<Text
										style={{
											marginRight: 8,
											fontSize: 14,
											fontFamily: Theme.fonts.medium,
											color: Theme.colors.text,
										}}
									>
										{translate('cart.small_order_fee')}
									</Text>
									<Tooltip
										isVisible={showSmallOrderFeeInfoPop}
										backgroundColor={'transparent'}
										content={
											<Text
												style={{
													fontSize: 12,
													fontFamily: Theme.fonts.medium,
													color: Theme.colors.text,
												}}
											>
												{translate('cart.small_order_fee_desc')
													.replace('{0}', props.cartPrice.min_order_price)
													.replace('{1}', props.cartPrice.small_order_fee)}
											</Text>
										}
										placement='top'
										tooltipStyle={{ backgroundColor: 'transparent' }}
										topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
										contentStyle={{ elevation: 7, borderRadius: 8 }}
										arrowStyle={{ elevation: 8 }}
										showChildInTooltip={false}
										disableShadow={false}
										onClose={() => setShowSmallOrderFeePop(false)}
									>
										<TouchableOpacity onPress={() => setShowSmallOrderFeePop(true)}>
											<Foundation name='info' size={20} color={Theme.colors.gray7} />
										</TouchableOpacity>
									</Tooltip>
								</View>
							}
							value={parseInt(props.cartPrice.small_order_fee) + ' L'}
							style={{ height: 40 }}
						/>
					)}
					{/* {
                    (props.delivery_info.handover_method == OrderType_Delivery &&
                        props.order_data.vendorData != null && props.order_data.vendorData.delivery_type == "Snapfood" &&
                        props.delivery_info.tip_rider >= 0) &&
                    <InfoRow name={translate('cart.leave_rider_tip')} value={`${props.delivery_info.tip_rider} L`} />
                } */}
					{props.delivery_info.handover_method == OrderType_Delivery && props.cartPrice.delivery_fee >= 0 && (
						<InfoRow
							name={translate('order_details.delivery_fee')}
							value={parseInt(props.cartPrice.delivery_fee) + ' L'}
						/>
					)}
					<InfoRow
						name={translate('cart.order_total')}
						value={parseInt(calculateOrderTotal()) + ' L'}
						keyStyle={{ fontFamily: Theme.fonts.bold }}
						valueStyle={{ fontFamily: Theme.fonts.bold }}
					/>
				</View>
				{props.payment_info.method != 'cash' && (
					<DotBorderButton
						title={translate('cart.split_bill')}
						style={{ width: '100%', marginTop: 16 }}
						onPress={() => {
							showBottomModal(true);
						}}
					/>
				)}
			</View>
		);
	};

	const _renderOrderBill = () => {
		const isEqual = () => {
			let equal = true;
			let tmpPrice = props.payment_info.splits[0].price;
			props.payment_info.splits.map((item, index) => {
				if (tmpPrice != item.price) {
					equal = false;
				}
			});
			return equal;
		};
		return (
			<View style={[Theme.styles.col_center, { width: '100%' }]}>
				<View style={[Theme.styles.col_center_start, styles.sectionView]}>
					<View
						style={[
							Theme.styles.row_center,
							{ width: '100%', justifyContent: 'flex-start', marginBottom: 8 },
						]}
					>
						<Text style={[styles.subjectTitle]}>Bill Split</Text>
						<Text style={[{ fontSize: 10, fontFamily: Theme.fonts.medium, color: Theme.colors.gray7 }]}>
							{' '}
							({translate('cart.among')} {props.payment_info.splits.length} {translate('cart.people')})
						</Text>
					</View>
					{isEqual() ? (
						<View style={{ width: '100%' }}>
							<InfoRow
								name={translate('you')}
								value={parseInt(props.payment_info.splits[0].price) + ' L'}
							/>
							<InfoRow
								name={translate('each_friend') + ' (x' + (props.payment_info.splits.length - 1) + ')'}
								value={parseInt(props.payment_info.splits[0].price) + ' L'}
							/>
						</View>
					) : (
						props.payment_info.splits.map((item, index) => (
							<InfoRow
								key={index}
								name={item.id == props.user.id ? translate('you') : item.full_name}
								value={parseInt(item.price) + ' L'}
							/>
						))
					)}
				</View>
				<View style={[Theme.styles.col_center_start, styles.sectionView, { borderBottomWidth: 0 }]}>
					<InfoRow name={translate('cart.total')} value={parseInt(props.cartPrice.subtotal) + ' L'} />
					{props.cartPrice.discount >= 0 && (
						<InfoRow
							name={translate('cart.discount_amount')}
							value={(props.cartPrice.discount > 0 ? '-' : '') + parseInt(props.cartPrice.discount) + ' L'}
						/>
					)}
					{props.cartPrice.cashback >= 0 && (
						<InfoRow
							name={translate('cart.cashback_amount')}
							value={(props.cartPrice.cashback > 0 ? '-' : '')+ parseInt(props.cartPrice.cashback) + ' L'}
						/>
					)}
					{props.delivery_info.handover_method == OrderType_Delivery &&
						props.cartPrice.small_order_fee >= 0 && (
							<InfoRow
								name={translate('cart.small_order_fee')}
								value={parseInt(props.cartPrice.small_order_fee) + ' L'}
							/>
						)}
					{/* {
                    (props.delivery_info.handover_method == OrderType_Delivery &&
                        props.order_data.vendorData != null && props.order_data.vendorData.delivery_type == "Snapfood" &&
                        props.delivery_info.tip_rider >= 0) &&
                    <InfoRow name={translate('cart.leave_rider_tip')} value={`${props.delivery_info.tip_rider} L`} />
                } */}
					{props.delivery_info.handover_method == OrderType_Delivery && props.cartPrice.delivery_fee >= 0 && (
						<InfoRow
							name={translate('order_details.delivery_fee')}
							value={parseInt(props.cartPrice.delivery_fee) + ' L'}
						/>
					)}
					<InfoRow
						name={translate('cart.order_total')}
						value={parseInt(calculateOrderTotal()) + ' L'}
						keyStyle={{ fontFamily: Theme.fonts.bold }}
						valueStyle={{ fontFamily: Theme.fonts.bold }}
					/>
				</View>
			</View>
		);
	};

	const _renderBottomModal = () => {
		const goSplit = () => {
			showBottomModal(false);
			props.navigation.navigate(RouteNames.CartSplitScreen);
		};
		const goSplitOrderNotuser = () => {
			showBottomModal(false);
			props.navigation.navigate(RouteNames.SnapfoodersSplitScreen);
		};
		return (
			<Modal
				testID={'modal'}
				isVisible={isBottomModal}
				backdropOpacity={0.33}
				onSwipeComplete={() => showBottomModal(false)}
				onBackdropPress={() => showBottomModal(false)}
				swipeDirection={['down']}
				style={{ justifyContent: 'flex-end', margin: 0 }}
			>
				<View style={[Theme.styles.col_center, styles.modalContent]}>
					<Text style={styles.modalTitle}>{translate('cart.split_with')}</Text>
					<TouchableOpacity
						onPress={goSplit}
						style={[Theme.styles.row_center, { width: '100%', height: 50 }]}
					>
						<Text style={styles.modalBtnTxt}>{translate('Friends')}</Text>
						<Feather name='chevron-right' size={22} color={Theme.colors.text} />
					</TouchableOpacity>
					{/*<View style={styles.divider} />*/}
					{/*<TouchableOpacity onPress={goSplitOrderNotuser} style={[Theme.styles.row_center, { width: '100%', height: 50 }]}>*/}
					{/*    <Text style={styles.modalBtnTxt}>{translate('social.snapfooders')}</Text>*/}
					{/*    <Feather name="chevron-right" size={22} color={Theme.colors.text} />*/}
					{/*</TouchableOpacity>*/}
				</View>
			</Modal>
		);
	};

	const doPay = async () => {
		const { method, selected_card, splits } = props.payment_info;
		if (method == 'paypal') {
			BraintreeDropIn.show({
				clientToken: paypal_client_token,
				orderTotal: calculateOrderTotal(),
				googlePay: false,
				applePay: false,
				vaultManager: false,
				cardDisabled: true,
			})
				.then((result) => {
					console.log('BraintreeDropIn ', result);
					finalizeCheckout(result.nonce);
				})
				.catch((error) => {
					if (error.code === 'USER_CANCELLATION') {
						console.log('BraintreeDropIn USER_CANCELLATION');
					} else {
						console.log('BraintreeDropIn error', error);
					}
				});
		} else if (method == 'apple') {
			if (!isApplePaySupported) return;

			doApplepay();
		} else {
			finalizeCheckout();
		}
	};

	const getOrderData = (paypal_nonce) => {
		// show loading
		const { items, vendorData, cutlery, coupon, comments } = props.order_data;
		let cartProducts = items.filter((i) => i.vendor_id == vendorData.id);
		const products = cartProducts.map((item) => {
			return {
				id: item.id,
				qty: item.quantity,
				options: item.options && item.options.length > 0 ? item.options.map((x) => x.id) : [],
				item_instructions: item.comments,
			};
		});

		const {
			address,
			handover_method,
			contactless_delivery,
			tip_rider,
			pickup_date,
			pickup_time,
			num_guests,
			reserve_for,
		} = props.delivery_info;
		const { cashback } = props.cartPrice;
		const { method, selected_card, splits } = props.payment_info;

		let orderData = {
			vendor_id: vendorData.id,
			products,
			order_note: comments,
			has_cutlery: cutlery > 0 ? 1 : 0,
			cutlery: cutlery,
			source: Config.isAndroid ? 'android' : 'ios',
			coupon_code: coupon.code,
			repeated: 0,
			handover_method: handover_method == 'Pickup at store' ? 'Pickup' : handover_method,
			delivery_instruction: props.delivery_info.comments,
			cashback: cashback,
			payment_method: method,
			contactless_delivery: contactless_delivery ? 1 : 0,
		};

		if (handover_method == OrderType_Reserve) {
			orderData.reserve_for = reserve_for.id;
			orderData.num_guests = parseInt(num_guests);
		}

		if (handover_method != OrderType_Delivery) {
			orderData.pickup_date = pickup_date;
			orderData.pickup_time = pickup_time;
		} else {
			orderData.address_id = address.id;

			// if (vendorData != null && vendorData.delivery_type == "Snapfood" && tip_rider > 0) {
			//     orderData.tip_rider = parseInt(tip_rider);
			// }
			// else {
			//     orderData.tip_rider = 0;
			// }
			orderData.tip_rider = 0;
		}

		if (method == 'stripe') {
			if (selected_card == null) {
				alerts.error(translate('warning'), translate('cart.select_card'));
				return null;
			} else {
				orderData.payment_method_id = selected_card.id;
			}
		}

		if (method == 'paypal') {
			orderData.paypal_nonce = paypal_nonce;
		}

		if (orderBilled() == true) {
			orderData.splits = splits.map((item) => {
				return {
					person_id: item.id,
					amount: item.price,
					person_name: item.full_name,
				};
			});
		}

		return orderData;
	};

	const finalizeCheckout = async (paypal_nonce) => {
		const { items, vendorData, cutlery, coupon, comments } = props.order_data;

		let orderData = getOrderData(paypal_nonce);
		if (orderData == null) {
			return;
		}
		console.log('orderData', orderData);
		setLoading(true);
		props.sendOrder(orderData).then(
			(order) => {
				console.log('order success', order);
				let cartItems = items.filter((i) => i.vendor_id != vendorData.id);
				props.setTmpOrder({});
				props.clearCart(cartItems);
				setLoading(false);
				if (props.hometab_navigation != null) {
					props.setDefaultOrdersTab('current');
					props.hometab_navigation.jumpTo(RouteNames.OrdersStack);
				}
				props.navigation.navigate(RouteNames.BottomTabs);
				props.navigation.navigate(RouteNames.OrderSummScreen, { order_id: order.id, isnew: true });
			},
			(error) => {
				console.log('sendOrder', error);
				setLoading(false);
				setOrderFailedMessage(error.message ? error.message : translate('cart.order_failed'));
				showOrderFailedModal(true);
				// alerts.error(translate('restaurant_details.we_are_sorry'), extractErrorMessage(error));
			}
		);
	};

	const doApplepay = async () => {
		let orderData = getOrderData();
		console.log('orderData', orderData);
		setLoading(true);
		apiFactory
			.post('checkout/get-applepay-client-secret', orderData)
			.then(async ({ data }) => {
				console.log('get-applepay-client-secret', data.client_secret);

				const { error } = await presentApplePay({
					cartItems: [{ label: translate('cart.total'), amount: '' + calculateOrderTotal() }],
					country: 'AL',
					currency: 'ALL',
				});
				if (error) {
					setLoading(false);
					console.log('presentApplePay error ', error);
				} else {
					console.log('do apple payment');
					const { error: confirmError } = await confirmApplePayPayment(data.client_secret);

					setLoading(false);
					if (confirmError) {
						console.log('confirmApplePayPayment error', confirmError);
					} else {
						finalizeCheckout();
					}
				}
			})
			.catch((error) => {
				console.log('doApplepay error ', error);
				setLoading(false);
				setOrderFailedMessage(error.message ? error.message : translate('cart.order_failed'));
				showOrderFailedModal(true);
			});
	};

	return (
		<View style={styles.container}>
			<Header1
				style={{ marginBottom: 0, paddingHorizontal: 20 }}
				onLeft={() => {
					props.navigation.goBack();
				}}
				title={translate('cart.title')}
			/>
			<View style={styles.formView}>
				<ScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 20 }}>
					{_renderPaymentMethod()}
					{orderBilled() ? _renderOrderBill() : _renderOrderTotal()}
				</ScrollView>
				<View style={{ width: '100%', padding: 20 }}>
					<MainBtn
						disabled={loading}
						loading={loading}
						title={
							props.payment_info.splits.length > 0
								? translate('cart.confirm_order')
								: translate('checkout_phone.proceed')
						}
						onPress={doPay}
					/>
				</View>
			</View>
			{_renderBottomModal()}
			<OrderFailedModal
				isVisible={isOrderFailedModal}
				message={OrderFailedMessage}
				onTryAgain={() => {
					showOrderFailedModal(false);
					doPay();
				}}
				onClose={() => showOrderFailedModal(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		paddingVertical: 20,
		backgroundColor: '#ffffff',
	},
	formView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
	},
	subjectTitle: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
	divider: { width: '100%', height: 1, backgroundColor: Theme.colors.gray9 },
	sectionView: {
		width: '100%',
		alignItems: 'flex-start',
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: Theme.colors.gray9,
	},
	modalContent: {
		width: '100%',
		paddingHorizontal: 20,
		paddingBottom: 30,
		padding: 20,
		backgroundColor: Theme.colors.white,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	modalTitle: {
		width: '100%',
		textAlign: 'left',
		fontSize: 16,
		fontFamily: Theme.fonts.bold,
		color: Theme.colors.text,
		marginVertical: 12,
	},
	modalBtnTxt: { flex: 1, fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
});

const mapStateToProps = ({ app, shop }) => ({
	user: app.user,
	hometab_navigation: app.hometab_navigation,
	order_data: shop,
	delivery_info: shop.delivery_info,
	payment_info: shop.payment_info,
	cartPrice: shop.cartPrice,
});

export default connect(mapStateToProps, {
	setPaymentInfoCart,
	sendOrder,
	setDeliveryInfoCart,
	clearCart,
	setTmpOrder,
	setDefaultOrdersTab
})(CartPaymentScreen);
