import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	StatusBar,
	Platform,
	TouchableOpacity,
	InteractionManager,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import { width } from 'react-native-dimension';
import { connect } from 'react-redux';
import Tooltip from 'react-native-walkthrough-tooltip';
import Foundation from 'react-native-vector-icons/Foundation';
import ContentLoader from '@sarmad1995/react-native-content-loader';
import { setInitHomeTab, setTmpOrder, goActiveScreenFromPush , setDefaultOrdersTab} from '../../../store/actions/app';
import { reOrder } from '../../../store/actions/shop';
import { getOrderDetail } from '../../../store/actions/orders';
import { extractErrorMessage, openExternalUrl } from '../../../common/services/utility';
import { translate } from '../../../common/services/translate';
import alerts from '../../../common/services/alerts';
import Theme from '../../../theme';
import Config from '../../../config';
import MainBtn from '../../../common/components/buttons/main_button';
import RoundIconBtn from '../../../common/components/buttons/round_icon_button';
import AddressItem from '../../../common/components/AddressItem';
import OrderStepper from '../../../common/components/order/OrderStepper';
import InfoRow from '../../../common/components/InfoRow';
import Header1 from '../../../common/components/Header1';
import RouteNames from '../../../routes/names';
import { OrderType_Delivery, OrderType_Reserve, OrderType_Pickup } from '../../../config/constants';

const OrderSummScreen = (props) => {
	const { order } = props;
	const isNew = props.route.params.isnew ?? false;
	const isFromPush = props.route.params.fromPush ?? false;
	const order_status = props.route.params.order_status ?? false;

	const past_status = ['delivered', 'picked_up', 'reserved'];

	const [isReady, setReady] = useState(false);
	const [isLoaded, setLoaded] = useState(false);
	const [showSmallOrderFeeInfoPop, setShowSmallOrderFeePop] = useState(false);

	useEffect(() => {
		setReady(true);
		setLoaded(false);
		getOrderDetail(props.route.params.order_id)
			.then((order_data) => {
				props.setTmpOrder(order_data);
				setLoaded(true);
			})
			.catch((error) => {
				setLoaded(true);
				console.log('getOrderDetail', error);
			});

		return () => {
			console.log('OrderSummScreen unmount')
			props.goActiveScreenFromPush({
				isOrderSummVisible: false,
			});
		}
	}, [props.route.params.order_id, order_status]);

	const reorderRequest = async (order, restaurant) => {
		props.reOrder(order, restaurant).then(
			async (items) => {
				props.navigation.navigate(RouteNames.CartScreen);
			},
			async (error) => {
				alerts.error(translate('restaurant_details.we_are_sorry'), extractErrorMessage(error));
			}
		);
	};

	const reorder = () => {
		const restaurant = order.vendor;
		if (restaurant == null) {
			return alerts.error(translate('restaurant_details.we_are_sorry'), translate('order_summary.reorder_unavailable_vendor'));
		}

		let items = props.cartItems.filter((i) => i.vendor_id != restaurant.id);
		if (items.length > 0) {
			alerts
				.confirmation(
					translate('restaurant_details.new_order_question'),
					translate('restaurant_details.new_order_text'),
					translate('confirm'),
					translate('cancel')
				)
				.then(() => {
					reorderRequest(order, restaurant);
				});
		} else {
			reorderRequest(order, restaurant);
		}
	};

	const isPastOrder = (order) => {
		if (past_status.find((i) => i == order.status) == null) {
			return false;
		}
		return true;
	};

	const getDiscountAmount = (order) => {
		if (order.coupon_amount != null && parseInt(order.coupon_amount) > 0) {
			return parseInt(order.coupon_amount);
		} else if (order.discount_amount != null && parseInt(order.discount_amount) > 0) {
			return parseInt(order.discount_amount);
		}
		return 0;
	};

	const _renderAddress = () => {
		return (
			<View style={[Theme.styles.col_center_start, styles.sectionView, { paddingBottom: 0 }]}>
				<AddressItem data={order.address || {}} editable={false} textSize={14} showNotes={true} />
			</View>
		);
	};

	const OrderPItem = ({ data }) => {
		return (
			<View style={[Theme.styles.row_center, styles.orderitem_container]}>
				<Text style={styles.item_qty}>x {data.quantity}</Text>
				<View style={styles.item_divider} />
				<View style={[Theme.styles.row_center, styles.item_infoview]}>
					<Text style={[styles.item_title]}>{data.title}</Text>
					<Text style={[styles.item_price]}>{parseInt(data.price)} L</Text>
				</View>
			</View>
		);
	};

	const _renderOrderDetail = () => {
		return (
			<View style={[Theme.styles.col_center_start, styles.sectionView, { borderBottomWidth: 0 }]}>
				<View style={[Theme.styles.row_center, { width: '100%', marginBottom: 16 }]}>
					{
						order.vendor != null &&
						<View style={[Theme.styles.row_center_start, { flex: 1 }]}>
							<RoundIconBtn
								style={{ ...Theme.styles.col_center, ...styles.LogoView }}
								icon={
									<FastImage
										style={styles.Logo}
										resizeMode={FastImage.resizeMode.contain}
										source={{ uri: Config.IMG_BASE_URL + order.vendor.logo_thumbnail_path }}
									/>
								}
								onPress={() => { }}
							/>
							<Text style={styles.LogoText}>{order.vendor.title}</Text>
						</View>
					}
					{/* {
                    (order.status == 'new' || order.status == 'processing' || order.status == 'picked_by_rider') &&
						<TouchableOpacity>
							<Text style={[styles.cancelOrdertxt]}>Cancel Order</Text>
						</TouchableOpacity>
					} */}
				</View>
				<View style={[Theme.styles.col_center, styles.orderInfoView]}>
					{order.products != null &&
						order.products.map((item, index) => <OrderPItem key={index} data={item} />)}
					{order.order_note != null && order.order_note != '' &&
						<View
							style={[
								Theme.styles.row_center,
								{
									marginTop: 15,
									marginBottom: 6,
									paddingTop: 15,
									borderTopWidth: 1,
									borderTopColor: Theme.colors.gray9,
								},
							]}
						>
							<Text style={[Theme.styles.flex_1, styles.cancelOrdertxt]}>
								<Text style={[styles.item_title]}>{translate('order_details.order_notes')}:  </Text>
								{order.order_note}
							</Text>
						</View>
					}
					{order.total_price != null &&
						<View
							style={[
								Theme.styles.row_center,
								{
									marginBottom: 6,
									paddingTop: 15,
								},
								(order.order_note == null || order.order_note == '') &&
								{
									marginTop: 15,
									borderTopWidth: 1,
									borderTopColor: Theme.colors.gray9,
								}
							]}
						>
							<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>{translate('cart.order_total')}</Text>
							<Text style={[styles.orderTotalTxt]}>{parseInt(order.total_price)} L</Text>
						</View>
					}
					{order.splits != null && order.splits.length > 0 && (
						<Text style={[styles.cancelOrdertxt]}>
							{translate('split.bill_split_among')} {order.splits.length} {translate('cart.people')}
						</Text>
					)}
					{
						order.sub_total != null &&
						<View style={[Theme.styles.row_center, { marginTop: 3 }]}>
							<Text style={[Theme.styles.flex_1, styles.cancelOrdertxt]}>
								{translate('order_details.subtotal')}
							</Text>
							<Text style={[styles.cancelOrdertxt]}>{parseInt(order.sub_total)} L</Text>
						</View>
					}
					{order.cashback != null && parseInt(order.cashback) >= 0 && (
						<View style={[Theme.styles.row_center, { marginTop: 3 }]}>
							<Text style={[Theme.styles.flex_1, styles.cancelOrdertxt]}>
								{translate('filter.cashback')}
							</Text>
							<Text style={[styles.cancelOrdertxt]}>
								{parseInt(order.cashback) > 0 ? `-${parseInt(order.cashback)}` : `0`} L</Text>
						</View>
					)}
					{order.total_price != null && getDiscountAmount(order) >= 0 && (
						<View style={[Theme.styles.row_center, { marginTop: 3 }]}>
							<Text style={[Theme.styles.flex_1, styles.cancelOrdertxt]}>
								{translate('filter.discount')}
							</Text>
							<Text style={[styles.cancelOrdertxt]}>
								{parseInt(getDiscountAmount(order)) > 0 ? `-${parseInt(getDiscountAmount(order))}` : `0`} L</Text>
						</View>
					)}
					{order.order_type == OrderType_Delivery &&
						order.small_order_fee != null &&
						parseInt(order.small_order_fee) > 0 && (
							<InfoRow
								keyItem={
									<View style={[Theme.styles.row_center_start, { flex: 1 }]}>
										<Text style={[styles.cancelOrdertxt, { marginRight: 8 }]}>
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
														.replace('{0}', order.delivery_minimum_order_price)
														.replace('{1}', parseInt(order.small_order_fee))}
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
								value={parseInt(order.small_order_fee) + ' L'}
								style={{ height: 35 }}
								valueStyle={styles.cancelOrdertxt}
							/>
						)}
					{/* {
                    order.tip_rider != null &&
                    <View style={[Theme.styles.row_center, { marginTop: 3, }]}>
                        <Text style={[Theme.styles.flex_1, styles.cancelOrdertxt,]}>{translate('cart.leave_rider_tip')}</Text>
                        <Text style={[styles.cancelOrdertxt,]}>{order.tip_rider} L</Text>
                    </View>
                } */}
					{order.delivery_fee != null && parseInt(order.delivery_fee) >= 0 && (
						<View style={[Theme.styles.row_center, { marginTop: 3 }]}>
							<Text style={[Theme.styles.flex_1, styles.cancelOrdertxt]}>
								{translate('checkout.delivery_fee')}
							</Text>
							<Text style={[styles.cancelOrdertxt]}>{parseInt(order.delivery_fee)} L</Text>
						</View>
					)}
				</View>
			</View>
		);
	};

	const _renderOrderReview = (review) => {
		if (!isReady) {
			return null;
		}
		return (
			<View style={[Theme.styles.col_center, styles.review]}>
				<Text style={styles.backTxt}>{translate('order_review.your_reviewed')}</Text>
				<View style={[Theme.styles.row_center, { marginTop: 25 }]}>
					<View style={[Theme.styles.col_center, { flex: 1 }]}>
						<Text style={[styles.review_title, { marginBottom: 6 }]}>
							{translate('order_review.restaurant')}
						</Text>
						<StarRating
							disabled={true}
							maxStars={5}
							rating={review.vendor_review != null ? review.vendor_review.rating : 0}
							starSize={16}
							fullStarColor={Theme.colors.red1}
							emptyStar={'star'}
							emptyStarColor={Theme.colors.gray7}
							starStyle={{ marginRight: 4 }}
						/>
					</View>
					<View style={[Theme.styles.col_center, { flex: 1 }]}>
						<Text style={[styles.review_title, { marginBottom: 6 }]}>{translate('order_review.dish')}</Text>
						<StarRating
							disabled={true}
							maxStars={5}
							rating={review.product_review != null ? review.product_review.rating : 0}
							starSize={16}
							fullStarColor={Theme.colors.red1}
							emptyStar={'star'}
							emptyStarColor={Theme.colors.gray7}
							starStyle={{ marginRight: 4 }}
						/>
					</View>
					<View style={[Theme.styles.col_center, { flex: 1 }]}>
						<Text style={[styles.review_title, { marginBottom: 6 }]}>
							{translate('order_review.rider')}
						</Text>
						<StarRating
							disabled={true}
							maxStars={5}
							rating={review.rider_review != null ? review.rider_review.rating : 0}
							starSize={16}
							fullStarColor={Theme.colors.red1}
							emptyStar={'star'}
							emptyStarColor={Theme.colors.gray7}
							starStyle={{ marginRight: 4 }}
						/>
					</View>
				</View>
			</View>
		);
	};

	const getTitle = () => {
		if (order != null && isFromPush == true) {
			if (order.status == 'new') {
				return translate('order_delivery_status.pending');
			}
			if (order.status == 'processing') {
				return translate('order_delivery_status.prepare_order');
			}
			if (order.status == 'picked_by_rider') {
				return translate('order_delivery_status.out_for_delivery');
			}
			if (order.status == 'delivered') {
				return translate('order_delivery_status.delivered');
			}
			if (order.status == 'accepted') {
				return translate('order_delivery_status.accepted_order');
			}
			if (order.status == 'ready_to_pickup') {
				return translate('order_delivery_status.ready_for_pickup');
			}
			if (order.status == 'picked_up') {
				return translate('order_delivery_status.picked_up');
			}
			if (order.status == 'reserved') {
				return translate('order_delivery_status.reserved');
			}
			if (order.status == 'canceled') {
				return translate('orders.status_canceled');
			}
			if (order.status == 'declined') {
				return translate('orders.order_declined');
			}
		}
		return translate('order_summary.title');
	};

	const renderBody = () => {
		if (isLoaded == false) {
			return (
				<View style={{ marginTop: 20 }}>
					<ContentLoader
						primaryColor={Theme.colors.gray8}
						secondaryColor={Theme.colors.gray8}
						pRows={1}
						title={false}
						pHeight={[200]}
						pWidth={[width(100) - 20]}
					/>
					<ContentLoader
						primaryColor={Theme.colors.gray8}
						secondaryColor={Theme.colors.gray8}
						pRows={1}
						title={false}
						pHeight={[60]}
						pWidth={[width(100) - 20]}
					/>
					<ContentLoader
						primaryColor={Theme.colors.gray8}
						secondaryColor={Theme.colors.gray8}
						pRows={1}
						title={false}
						pHeight={[300]}
						pWidth={[width(100) - 20]}
					/>
				</View>
			);
		}
		return (
			<View style={styles.formView}>
				<ScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 20 }}>
					<View style={[Theme.styles.col_center, styles.sectionView, { paddingVertical: 10 }]}>
						{
							order.id != null &&
							<OrderStepper
								order={order}
								onTrackOrder={() => {
									props.navigation.navigate(RouteNames.TrackOrderScreen, { order: order });
								}}
							/>
						}
						{order.status == 'canceled' && (
							<Text style={styles.orderCancelledTxt}>{translate('order_summary.order_cancelled')}</Text>
						)}
					</View>
					{order.order_type == OrderType_Delivery && _renderAddress()}
					{_renderOrderDetail()}
					{isPastOrder(order) && order.order_review && _renderOrderReview(order.order_review)}
					<View style={{ height: 40 }} />
				</ScrollView>
				{isPastOrder(order) && !order.order_review && (
					<View style={[{ width: '100%', paddingHorizontal: 20, paddingBottom: 10 }]}>
						<MainBtn
							// disabled={loading}
							// loading={loading}
							title={translate('order_summary.review_order')}
							onPress={() => {
								props.navigation.navigate(RouteNames.OrderReviewScreen);
							}}
						/>
					</View>
				)}
				{isPastOrder(order) && (
					<View style={[Theme.styles.col_center_start, styles.bottom]}>
						<TouchableOpacity onPress={reorder}>
							<Text style={styles.backTxt}>{translate('order_summary.order_again')}</Text>
						</TouchableOpacity>
					</View>
				)}
				{isNew && (
					<View style={[{ width: '100%', paddingHorizontal: 20, paddingBottom: 10 }]}>
						<MainBtn
							// disabled={loading}
							// loading={loading}
							title={translate('order_summary.my_orders')}
							onPress={() => {
								if (props.hometab_navigation != null) {
									props.setDefaultOrdersTab('current');
									props.hometab_navigation.jumpTo(RouteNames.OrdersStack);
								}

								props.navigation.navigate(RouteNames.BottomTabs);
							}}
						/>
					</View>
				)}
				{isNew && (
					<View style={[Theme.styles.col_center_start, styles.bottom]}>
						<TouchableOpacity
							onPress={() => {
								if (props.hometab_navigation != null) {
									props.hometab_navigation.jumpTo(RouteNames.HomeStack);
								}
								props.navigation.navigate(RouteNames.BottomTabs);
							}}
						>
							<Text style={styles.backTxt}>{translate('order_summary.go_back_home')}</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Header1
				style={{ marginBottom: 0, paddingHorizontal: 20 }}
				onLeft={() => {
					if (isFromPush == true) {
						if (props.hometab_navigation != null) {
							props.hometab_navigation.jumpTo(RouteNames.HomeStack);
						}

						props.navigation.navigate(RouteNames.BottomTabs);
					}
					else {
						props.navigation.goBack();
					}
				}}
				left={isNew && <View />}
				title={getTitle()}
			/>
			{renderBody()}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 20,
		alignItems: 'center',
		backgroundColor: '#ffffff',
	},
	formView: {
		marginTop: 20,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
	},
	subjectTitle: { fontSize: 16, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
	divider: { width: '100%', height: 1, backgroundColor: Theme.colors.gray9 },
	sectionView: {
		width: '100%',
		alignItems: 'flex-start',
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: Theme.colors.gray9,
	},
	LogoText: { color: Theme.colors.text, fontSize: 18, fontFamily: Theme.fonts.bold, marginLeft: 10 },
	LogoView: { width: 34, height: 34, borderRadius: 8, backgroundColor: Theme.colors.white },
	Logo: { width: 28, height: 28 },
	bottom: { width: '100%', height: 75, paddingHorizontal: 20, paddingTop: 20, backgroundColor: Theme.colors.white },
	backTxt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
	cancelOrdertxt: { fontSize: 14, lineHeight: 20, fontFamily: Theme.fonts.medium, color: Theme.colors.gray7 },

	orderInfoView: {
		alignItems: 'flex-start',
		width: '100%',
		padding: 16,
		borderRadius: 15,
		backgroundColor: Theme.colors.gray8,
	},
	orderitem_container: { width: '100%' },
	item_divider: { width: 1, height: '100%', backgroundColor: Theme.colors.gray6 },
	item_qty: { width: 35, fontSize: 14, color: Theme.colors.red1, fontFamily: Theme.fonts.semiBold },
	item_title: { flex: 1, marginTop: 8, fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.medium },
	item_price: {
		marginTop: 8,
		marginBottom: 12,
		fontSize: 14,
		color: Theme.colors.text,
		fontFamily: Theme.fonts.medium,
	},
	item_infoview: { flex: 1, alignItems: 'stretch', marginLeft: 12 },
	orderTotalTxt: { fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	orderNoteTxt : {fontSize: 14,color: Theme.colors.text, fontFamily: Theme.fonts.medium,},
	orderCancelledTxt: {
		width: '100%',
		textAlign: 'center',
		marginBottom: 10,
		fontSize: 14,
		fontFamily: Theme.fonts.semiBold,
		color: Theme.colors.red1,
	},
	review: { width: '100%', paddingTop: 20, borderTopWidth: 1, borderTopColor: Theme.colors.gray9 },
	review_title: { fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.medium },
});

const mapStateToProps = ({ app, shop }) => ({
	order: app.tmp_order,
	hometab_navigation: app.hometab_navigation,
	cartItems: shop.items,
});

export default connect(mapStateToProps, {
	setInitHomeTab,
	setTmpOrder,
	reOrder,
	goActiveScreenFromPush,
	setDefaultOrdersTab
})(OrderSummScreen);
