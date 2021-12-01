import React from 'react';
import {
	ActivityIndicator,
	Keyboard,
	InteractionManager,
	ScrollView,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	View,
	StatusBar,
	Platform,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import FastImage from 'react-native-fast-image';
import Tooltip from 'react-native-walkthrough-tooltip';
import ContentLoader from '@sarmad1995/react-native-content-loader';
import { width } from 'react-native-dimension';
import { calculateCartTotal, extractErrorMessage } from '../../../common/services/utility';
import RouteNames from '../../../routes/names';
import { translate } from '../../../common/services/translate';
import styles from './styles/cart';
import apiFactory from '../../../common/services/apiFactory';
import Header1 from '../../../common/components/Header1';
import Theme from '../../../theme';
import Config from '../../../config';
import {
	updateCartItems,
	setCutleryCart,
	setCommentCart,
	setCouponCart,
	setPriceCart,
	setDeliveryInfoCart,
	setPaymentInfoCart,
	setVendorCart,
} from '../../../store/actions/shop';
import { setTmpFood, getAddresses } from '../../../store/actions/app';
import { getVendorDetail } from '../../../store/actions/vendors';
import alerts from '../../../common/services/alerts';
import GroceryFoodItem from '../components/GroceryFoodItem';
import CartItem from '../components/CartItem';
import CartDelivery from '../components/CartDelivery';
import FontelloIcon from '../../../common/components/FontelloIcon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Counter from '../../../common/components/buttons/counter';
import AuthInput from '../../../common/components/AuthInput';
import InfoRow from '../../../common/components/InfoRow';
import MainBtn from '../../../common/components/buttons/main_button';
import RoundIconBtn from '../../../common/components/buttons/round_icon_button';
import CommentView from '../components/CommentView';
import { OrderType_Delivery, OrderType_Pickup, OrderType_Reserve, Order_Pickedup } from '../../../config/constants';

class CartScreen extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			vendorData: {},
			cartItems: [],
			suggestedItems: [],
			maxDeliveryTime: 0,
			minOrderPrice: 0,
			smallOrderFee: 0,
			coupon: '',
			outOfDeliveryArea: false,
			loading_coupon: false,
			has_valid_coupon: false,
			showInfoPop: false,
			isReady: false,
		};
	}

	async componentDidMount() {
		this.setState({
			vendorData: this.props.vendorData,
			maxDeliveryTime: this.props.vendorData['maximum_delivery_time'] || 0,
			minOrderPrice: this.props.vendorData['delivery_minimum_order_price'] || 0,
			smallOrderFee: this.props.vendorData['small_order_fee'] || 0,
		});
		await this.loadSuggestedItems();
		if (this.props.delivery_info.address != null) {
			await this.getDeliveryFees(
				this.props.vendorData.id,
				this.props.delivery_info.address.lat,
				this.props.delivery_info.address.lng
			);
		}
		this.setState({
			isReady: true,
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.vendorData.id != prevProps.vendorData.id) {
			this.getDeliveryFees(this.props.vendorData.id);
			this.loadSuggestedItems();
			this.setState({
				vendorData: this.props.vendorData,
				maxDeliveryTime: this.props.vendorData['maximum_delivery_time'] || 0,
				minOrderPrice: this.props.vendorData['delivery_minimum_order_price'] || 0,
				smallOrderFee: this.props.vendorData['small_order_fee'] || 0,
			});
		}
		if (this.props.cartItems != prevProps.cartItems) {
			this.loadSuggestedItems();
		}
		if (
			this.props.delivery_info.address != null &&
			this.props.delivery_info.address.id != prevProps.delivery_info.address.id
		) {
			// address changed
			console.log('address changed : get delivery fee');
			this.getDeliveryFees(
				this.props.vendorData.id,
				this.props.delivery_info.address.lat,
				this.props.delivery_info.address.lng
			);
		}
	}

	// api
	validateCoupon = async (vendorId, total) => {
		const { coupon } = this.state;
		return new Promise((resolve, reject) => {
			apiFactory.get(`/coupons?subtotal=${total}&&vendor_id=${vendorId}&code=${coupon}`).then(
				async ({ data }) => {
					await this.setState({
						has_valid_coupon: true,
					});
					resolve(data.coupon);
				},
				async (error) => {
					await this.setState({
						has_valid_coupon: false,
					});
					const message = extractErrorMessage(error);
					reject(message);
				}
			);
		});
	};

	getDeliveryFees = async (vendor_id, latitude, longitude) => {
		try {
			if (vendor_id == null || vendor_id == '' || latitude == null || longitude == null) {
				this.props.setPriceCart({
					...this.props.cartPrice,
					delivery_fee: 0,
				});
				return;
			}

			const params = [`vendor_id=${vendor_id}`];
			params.push(`lat=${latitude}`);
			params.push(`lng=${longitude}`);

			const queryParams = params.join('&');

			let response = await apiFactory.get(`checkout/delivery-fee?${queryParams}`);
			let data = response.data;
			this.setState({
				maxDeliveryTime: data['deliveryTime'] || this.state.maxDeliveryTime,
				minOrderPrice: data['minimumOrder'] || this.state.minOrderPrice,
				outOfDeliveryArea: data['outOfDeliveryArea'] || false,
				smallOrderFee: data['small_order_fee'] || this.state.smallOrderFee,
			});

			this.props.setPriceCart({
				...this.props.cartPrice,
				delivery_fee: data['deliveryFee'] || 0,
			});
		} catch (error) {
			console.log('getDeliveryFees ', error);
			// alerts.error(translate('attention'), extractErrorMessage(error));
		}
	};

	loadSuggestedItems = async () => {
		try {
			const cartItems = this.props.cartItems;
			const { vendorData } = this.props;
			if (vendorData == null) {
				return;
			}
			let categories = vendorData.categories;
			if (categories == null) {
				const { latitude, longitude } = this.props.coordinates;

				let data = await getVendorDetail(
					vendorData.id,
					latitude,
					longitude,
					this.props.delivery_info.handover_method
				);
				this.props.setVendorCart(data);
				categories = data.categories;
			}

			let suggestedItems = [];
			cartItems.map((cartItm) => {
				let category = categories.find((cat) => cat.id == cartItm.category_id);

				if (category != null && category.products != null) {
					let tmpProducts = [];
					category.products.slice(0, 30).map((p) => {
						let foundCart = cartItems.find((i) => i.id == p.id);
						let foundSuggested = suggestedItems.find((i) => i.id == p.id);
						if (foundCart == null && foundSuggested == null) {
							tmpProducts.push(p);
						}
					});

					tmpProducts.sort(function (a, b) {
						return Math.abs(a.price - cartItm.price) - Math.abs(b.price - cartItm.price);
					});
					suggestedItems.push(...tmpProducts.slice(0, 6));
				}
			});
			suggestedItems
				.sort(function (a, b) {
					return a.price - b.price;
				})
				.slice(0, 10);
			this.setState({ suggestedItems: suggestedItems });
		} catch (error) {
			console.log('get Vendor Detail', error);
		}
	};
	// end api

	applyCoupon = (couponData) => {
		if (couponData == null) {
			return;
		}
		let discountValue = 0;
		if (couponData.type == 'fixed') {
			discountValue = couponData.value ? couponData.value : 0;
		} else if (couponData.type == 'percentage') {
			discountValue = couponData.value ? couponData.value : 0;
		} else if (couponData.type == 'discount') {
			let cartItemProduct = this.props.cartItems.filter((i) => i.id == couponData.product_id);
			if (cartItemProduct.length > 0) {
				let qty = cartItemProduct.quantity - (couponData.value ? couponData.value : 0); // discount
				if (qty < 0) {
					discountValue = cartItemProduct.price * cartItemProduct.quantity;
				} else {
					discountValue = cartItemProduct.price * qty;
				}
			}
		} else if (couponData.type == 'free_delivery') {
			this.props.setPriceCart({
				...this.props.cartPrice,
				delivery_fee: 0,
			});
			return;
		}

		this.props.setPriceCart({
			...this.props.cartPrice,
			discount: discountValue,
		});
	};

	getSubTotal = () => {
		let sub_total = calculateCartTotal(this.props.cartItems);
		return sub_total;
	};

	getSmallOrderFee = () => {
		if (this.props.delivery_info.handover_method == OrderType_Delivery) {
			let subTotal = this.getSubTotal();
			if (subTotal < this.state.minOrderPrice) {
				if (this.state.smallOrderFee != null) {
					return parseInt(this.state.smallOrderFee) || 0;
				}
			}
		}
		return 0;
	};

	getTotalPrice = () => {
		const { discount, cashback, delivery_fee } = this.props.cartPrice;

		let rider_tip = 0;
		// if (this.props.delivery_info.handover_method == OrderType_Delivery && this.props.vendorData.delivery_type == "Snapfood" && parseInt(this.props.delivery_info.tip_rider) > 0) {
		// 	rider_tip = parseInt(this.props.delivery_info.tip_rider);
		// }

		let subtotal = this.getSubTotal();
		let total = subtotal - discount - cashback + this.getSmallOrderFee() + delivery_fee + rider_tip;

		return total;
	};

	renderCartProducts = () => {
		const onPlusItem = async (p_id) => {
			try {
				let tmp = this.props.cartItems.slice(0, this.props.cartItems.length);
				let foundIndex = tmp.findIndex((i) => i.id == p_id);
				if (foundIndex != -1) {
					tmp[foundIndex].quantity = tmp[foundIndex].quantity + 1;
					await this.props.updateCartItems(tmp);
					console.log('onPlusItem', p_id);
				}
			} catch (error) {
				console.log('onPlusItem', error);
			}
		};

		const onMinusItem = async (p_id) => {
			try {
				let tmp = this.props.cartItems.slice(0, this.props.cartItems.length);
				let foundIndex = tmp.findIndex((i) => i.id == p_id);
				if (foundIndex != -1) {
					tmp[foundIndex].quantity = tmp[foundIndex].quantity - 1;
					await this.props.updateCartItems(tmp);
					console.log('onMinusItem', p_id);
				}
			} catch (error) {
				console.log('onMinusItem', error);
			}
		};

		const onRemoveItem = async (p_id) => {
			try {
				let curCartCount = this.props.cartItems.length;
				let tmp = this.props.cartItems.slice(0, this.props.cartItems.length);
				let foundIndex = tmp.findIndex((i) => i.id == p_id);
				if (foundIndex != -1) {
					tmp.splice(foundIndex, 1);
					await this.props.updateCartItems(tmp);
					console.log('on remove', p_id);
					if (curCartCount == 1) {
						this.props.navigation.goBack();
					}
				}
			} catch (error) {
				console.log('onRemoveItem', error);
			}
		};

		return (
			<View style={[Theme.styles.col_center, { width: '100%', padding: 20 }]}>
				<View style={[Theme.styles.row_center_start]}>
					<RoundIconBtn
						style={{ ...Theme.styles.col_center, ...styles.LogoView }}
						icon={
							this.props.vendorData != null && (
								<FastImage
									style={styles.Logo}
									resizeMode={FastImage.resizeMode.contain}
									source={{ uri: Config.IMG_BASE_URL + this.props.vendorData.logo_thumbnail_path }}
								/>
							)
						}
						onPress={() => { }}
					/>
					<Text style={styles.LogoText}>{this.props.vendorData != null && this.props.vendorData.title}</Text>
				</View>
				<View style={[Theme.styles.row_center, { marginTop: 12 }]}>
					<Text style={[{ flex: 1, fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold }]}>
						{translate('cart.your_items')}
					</Text>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.navigate(RouteNames.VendorScreen);
						}}
					>
						<Text style={{ fontSize: 14, color: Theme.colors.cyan2, fontFamily: Theme.fonts.semiBold }}>
							{translate('cart.see_menu')}
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={[
						Theme.styles.col_center,
						{
							width: '100%',
							marginTop: 16,
							padding: 12,
							paddingTop: 18,
							paddingBottom: 18,
							backgroundColor: Theme.colors.gray8,
							borderRadius: 15,
						},
					]}
				>
					{this.props.cartItems.map((item, index) => (
						<CartItem
							key={index}
							data={item}
							onPlus={onPlusItem}
							onMinus={onMinusItem}
							onDelete={onRemoveItem}
						/>
					))}
				</View>
			</View>
		);
	};

	renderCutlery = () => {
		return (
			<View style={[Theme.styles.col_center_start, { paddingHorizontal: 20 }]}>
				<View style={[Theme.styles.row_center, styles.sectionView]}>
					<View style={{ justifyContent: 'center', flex: 1 }}>
						<Text style={styles.subjectTitle}>{translate('cart.cutlery_description_off')}</Text>
					</View>
					<Counter
						value={this.props.cutlery}
						onPlus={() => this.props.setCutleryCart(this.props.cutlery + 1)}
						onMinus={() => {
							if (this.props.cutlery >= 1) {
								this.props.setCutleryCart(this.props.cutlery - 1);
							}
						}}
						style={{
							width: 122,
							height: 40,
							padding: 6,
							paddingHorizontal: 12,
							borderWidth: 1,
							borderColor: Theme.colors.gray6,
							backgroundColor: Theme.colors.white,
						}}
						btnColor={Theme.colors.cyan2}
						btnSize={20}
					/>
				</View>
			</View>
		);
	};

	renderCashBack = () => {
		return (
			<View style={[Theme.styles.col_center_start, { paddingHorizontal: 20 }]}>
				<View style={[Theme.styles.row_center, styles.sectionView]}>
					<View style={{ justifyContent: 'center', flex: 1 }}>
						<Text style={styles.subjectTitle}>{translate('cart.want_use_cashback')}</Text>
						<Text
							style={{
								marginTop: 5,
								fontSize: 13,
								fontFamily: Theme.fonts.medium,
								color: Theme.colors.gray7,
							}}
						>
							{translate('wallet.balance')} {parseInt(this.props.user.cashback_amount) || 0} L
						</Text>
					</View>
					<AuthInput
						style={{
							width: 122,
							height: 40,
							borderWidth: 1,
							borderColor: Theme.colors.gray6,
							backgroundColor: Theme.colors.white,
						}}
						placeholder={translate('cart.enter_cashback_value')}
						textAlign='center'
						keyboardType='decimal-pad'
						editable={parseInt(this.props.user.cashback_amount) > 0}
						value={this.props.cartPrice.cashback == 0 ? '' : '' + this.props.cartPrice.cashback}
						onChangeText={(t) => {
							let int_val = t != '' ? parseInt(t) : 0;
							let balance = this.props.user.cashback_amount || 0;

							if (int_val <= balance) {
								this.props.setPriceCart({
									...this.props.cartPrice,
									cashback: int_val,
								});
							}
						}}
					/>
				</View>
			</View>
		);
	};

	renderLeaveTip = () => {
		return (
			<View style={[Theme.styles.col_center_start, { paddingHorizontal: 20 }]}>
				<View style={[Theme.styles.row_center, styles.sectionView]}>
					<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>{translate('cart.leave_rider_tip')}</Text>
					<AuthInput
						style={{
							width: 122,
							height: 40,
							borderWidth: 1,
							borderColor: Theme.colors.gray6,
							backgroundColor: Theme.colors.white,
						}}
						placeholder={'0'}
						textAlign='center'
						keyboardType='decimal-pad'
						value={this.props.delivery_info.tip_rider == 0 ? '' : '' + this.props.delivery_info.tip_rider}
						onChangeText={(t) => {
							let int_val = t != '' ? parseInt(t) : 0;

							if (int_val < 0) {
								return;
							}
							this.props.setDeliveryInfoCart({
								tip_rider: int_val,
							});
						}}
					/>
				</View>
			</View>
		);
	};

	renderSuggestedProducts = () => {
		const onAddCart = async (data) => {
			try {
				let tmp = this.props.cartItems.slice(0, this.props.cartItems.length);
				let foundIndex = tmp.findIndex((i) => i.id == data.id);
				if (foundIndex != -1) {
					tmp[foundIndex].quantity = tmp[foundIndex].quantity + 1;
				} else {
					let cartItem = data;
					cartItem.quantity = 1;
					cartItem.comments = '';
					cartItem.options = [];

					tmp.push(cartItem);
				}
				await this.props.updateCartItems(tmp);
			} catch (error) {
				console.log('onAddCart', error);
			}
		};

		if (this.state.suggestedItems.length == 0) {
			return null;
		}
		return (
			<View style={[Theme.styles.col_center, { width: '100%', paddingLeft: 20, paddingTop: 20 }]}>
				<View style={[Theme.styles.row_center]}>
					<Text style={[{ flex: 1, fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold }]}>
						{translate('cart.suggested_items')}
					</Text>
				</View>
				<ScrollView horizontal={true} style={{ width: '100%', marginTop: 16, paddingBottom: 15 }}>
					{this.state.suggestedItems.map((item, index) => (
						<GroceryFoodItem
							key={index}
							data={item}
							food_id={item.id}
							title_lines={1}
							hideFav={true}
							style={{ width: 140, padding: 10, marginRight: 8 }}
							onAddCart={onAddCart}
							onRmvCart={() => { }}
							onFavChange={() => { }}
							onSelect={() => { }}
						/>
					))}
				</ScrollView>
				<View style={styles.scrollviewHider} />
				<View style={styles.divider} />
			</View>
		);
	};

	renderCouponInput = () => {
		const { coupon, loading_coupon, has_valid_coupon } = this.state;

		const checkCoupon = async () => {
			try {
				this.setState({ loading_coupon: true });
				let couponData = await this.validateCoupon(this.state.vendorData.id, this.getSubTotal());
				this.props.setCouponCart(couponData);
				this.applyCoupon(couponData);
			} catch (message) {
				console.log('checkCoupon', message);
				if (typeof message === 'string') {
					alerts.error(translate('alerts.error'), message);
				}
			}
			this.setState({ loading_coupon: false });
		};

		const removeCoupon = () => {
			Keyboard.dismiss();
			this.setState({ has_valid_coupon: false, coupon: '' });
			this.props.setCouponCart(null);
		};

		return (
			<View
				style={{
					flex: 1,
					paddingVertical: 20,
					flexDirection: 'row',
					alignItems: 'center',
					marginHorizontal: 20,
					borderTopWidth: 1,
					borderTopColor: Theme.colors.gray9,
				}}
			>
				{!has_valid_coupon && (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							borderWidth: 1,
							borderColor: Theme.colors.gray6,
							borderRadius: 12,
						}}
					>
						<TextInput
							style={{
								flex: 1,
								paddingVertical: 12,
								paddingLeft: 10,
							}}
							value={coupon}
							placeholder={translate('cart.coupon.placeholder')}
							onChangeText={(coupon) => this.setState({ coupon })}
							autoCapitalize={'none'}
							autoCorrect={false}
							returnKeyType={'done'}
							placeholderTextColor={Theme.colors.gray5}
						/>
						{coupon != null && coupon.length > 0 && (
							<TouchableOpacity
								style={{
									position: 'absolute',
									right: 10,
								}}
								onPress={() => checkCoupon()}
							>
								{loading_coupon ? (
									<ActivityIndicator color={Theme.colors.primary} />
								) : (
									<FontelloIcon
										icon='ok-1'
										size={Theme.icons.small}
										color={has_valid_coupon ? Theme.colors.cyan2 : Theme.colors.placeholder}
									/>
								)}
							</TouchableOpacity>
						)}
					</View>
				)}
				{coupon != null && coupon.length > 0 && has_valid_coupon && (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							borderWidth: 1,
							borderColor: Theme.colors.gray6,
							borderRadius: 12,
						}}
					>
						<View
							style={[
								Theme.styles.row_center_start,
								{
									flex: 1,
									paddingVertical: 18,
									paddingLeft: 10,
								},
							]}
						>
							<Text
								style={{
									marginRight: 8,
									fontSize: 12,
									fontFamily: Theme.fonts.semiBold,
									color: Theme.colors.text,
								}}
							>
								{coupon}
							</Text>
							<AntDesign name='checkcircle' size={16} color={'#00C22D'} />
						</View>

						<TouchableOpacity
							style={{
								position: 'absolute',
								right: 10,
							}}
							onPress={() => removeCoupon()}
						>
							{loading_coupon ? (
								<ActivityIndicator color={Theme.colors.primary} />
							) : (
								<Text
									style={{
										fontSize: 12,
										fontFamily: Theme.fonts.semiBold,
										color: Theme.colors.gray7,
									}}
								>
									Remove
								</Text>
							)}
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	};

	renderPriceInfo = () => {
		return (
			<View style={[Theme.styles.col_center, { width: '100%', paddingHorizontal: 20 }]}>
				<InfoRow name={translate('cart.subtotal')} value={parseInt(this.getSubTotal()) + ' L'} />
				<InfoRow
					name={translate('cart.discount')}
					value={
						parseInt(this.props.cartPrice.discount || 0) == 0
							? '0 L'
							: `-${parseInt(this.props.cartPrice.discount)} L`
					}
				/>
				<InfoRow
					name={translate('wallet.cashback')}
					value={
						parseInt(this.props.cartPrice.cashback || 0) == 0
							? '0 L'
							: `-${parseInt(this.props.cartPrice.cashback)} L`
					}
				/>
				{/* {
					this.props.delivery_info.handover_method == OrderType_Delivery &&
					this.props.vendorData.delivery_type == "Snapfood" &&
					<InfoRow name={translate('cart.leave_rider_tip')} value={(parseInt(this.props.delivery_info.tip_rider) || 0) + ' L'} />
				} */}
				{this.props.delivery_info.handover_method == OrderType_Delivery && this.getSmallOrderFee() > 0 && (
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
									isVisible={this.state.showInfoPop}
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
												.replace('{0}', this.state.minOrderPrice)
												.replace('{1}', this.getSmallOrderFee())}
										</Text>
									}
									placement='top'
									tooltipStyle={{ backgroundColor: 'transparent' }}
									topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
									contentStyle={{ elevation: 7, borderRadius: 8 }}
									arrowStyle={{ elevation: 8 }}
									showChildInTooltip={false}
									disableShadow={false}
									onClose={() => this.setState({ showInfoPop: false })}
								>
									<TouchableOpacity
										ref={(r) => (this.info = r)}
										onPress={() => this.setState({ showInfoPop: true })}
									>
										<Foundation name='info' size={20} color={Theme.colors.gray7} />
									</TouchableOpacity>
								</Tooltip>
							</View>
						}
						value={parseInt(this.getSmallOrderFee()) + ' L'}
						style={{ height: 40 }}
					/>
				)}
				{this.props.delivery_info.handover_method == OrderType_Delivery && (
					<InfoRow
						name={translate('order_details.delivery_fee')}
						value={parseInt(this.props.cartPrice.delivery_fee) + ' L'}
					/>
				)}
				<InfoRow
					name={translate('cart.order_total')}
					value={parseInt(this.getTotalPrice()) + ' L'}
					keyStyle={{ fontFamily: Theme.fonts.bold }}
					valueStyle={{ fontFamily: Theme.fonts.bold }}
				/>
			</View>
		);
	};

	onProceed = () => {
		if (this.props.delivery_info.handover_method == OrderType_Delivery) {
			if (this.props.delivery_info.address == null) {
				return alerts.error(
					translate('restaurant_details.we_are_sorry'),
					translate('checkout.select_address_to_checkout')
				);
			}
			if (this.state.outOfDeliveryArea == true) {
				return alerts.error(
					translate('restaurant_details.we_are_sorry'),
					translate('restaurant_details.no_in_vendor_support_zone')
				);
			}
		} else if (this.props.delivery_info.handover_method == OrderType_Reserve) {
			if (this.props.user == null) {
				return;
			}
			this.props.setDeliveryInfoCart({
				reserve_for: this.props.user,
			});
		}

		if (this.getTotalPrice() < 0) {
			return alerts.error(translate('restaurant_details.we_are_sorry'), translate('cart.order_is_under_0'));
		}

		this.props.setPriceCart({
			...this.props.cartPrice,
			subtotal: this.getSubTotal(),
			small_order_fee: this.getSmallOrderFee(),
			order_total: this.getTotalPrice(),
			min_order_price: this.state.minOrderPrice,
		});
		this.props.setPaymentInfoCart({
			...this.props.payment_info,
			splits: [],
		});
		this.props.navigation.navigate(RouteNames.CartPaymentScreen);
	};

	render() {
		return (
			<View style={styles.container}>
				<Header1
					style={{ width: width(100), paddingLeft: 20, paddingRight: 20, marginBottom: 0 }}
					onLeft={() => {
						this.props.navigation.goBack();
					}}
					title={translate('cart.title')}
				/>
				{this.state.isReady == false ? (
					<View style={{ width: width(100), marginTop: 20 }}>
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
				) : (
					this.props.cartItems.length > 0 && (
						<KeyboardAwareScrollView style={[{ flex: 1, width: width(100) }]} keyboardShouldPersistTaps='handled'>
							<CartDelivery
								navigation={this.props.navigation}
								outOfDeliveryArea={this.state.outOfDeliveryArea}
							/>
							{this.renderCartProducts()}
							{this.renderCutlery()}
							{this.renderCashBack()}
							{/* {this.props.delivery_info.handover_method == OrderType_Delivery && this.props.vendorData.delivery_type == "Snapfood" && this.renderLeaveTip()} */}
							{this.renderSuggestedProducts()}
							{this.renderCouponInput()}
							{this.renderPriceInfo()}
							<View
								style={{
									marginVertical: 20,
									paddingVertical: 18,
									flexDirection: 'row',
									alignItems: 'center',
									marginHorizontal: 20,
									borderTopWidth: 1,
									borderTopColor: Theme.colors.gray9,
								}}
							>
								<CommentView
									comments={this.props.comments}
									onChangeText={(text) => this.props.setCommentCart(text)}
								/>
							</View>
							<View style={{ width: '100%', paddingHorizontal: 20, marginBottom: 40 }}>
								<MainBtn
									// disabled={loading}
									// loading={loading}
									title={translate('cart.continue_to_payment')}
									onPress={this.onProceed}
								/>
							</View>
						</KeyboardAwareScrollView>
					)
				)}
			</View>
		);
	}
}

const mapStateToProps = ({ app, shop }) => ({
	user: app.user,
	isLoggedIn: app.isLoggedIn,
	coordinates: app.coordinates,

	cartItems: shop.items || [],
	cutlery: shop.cutlery,
	coupon: shop.coupon,
	comments: shop.comments,
	cartPrice: shop.cartPrice,
	vendorData: shop.vendorData || {},

	delivery_info: shop.delivery_info,
	payment_info: shop.payment_info,
});

export default connect(mapStateToProps, {
	updateCartItems,
	setCutleryCart,
	setCommentCart,
	setCouponCart,
	setPriceCart,
	setTmpFood,
	setDeliveryInfoCart,
	getAddresses,
	setPaymentInfoCart,
	setVendorCart,
})(withNavigation(CartScreen));
