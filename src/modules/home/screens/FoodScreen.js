import React, { useEffect, useState } from 'react';
import {
	Image,
	InteractionManager,
	Share,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Text,
	View,
	StyleSheet,
	ImageBackground,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { width, height } from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import Gallery from 'react-native-image-gallery';
import { connect } from 'react-redux';
import { setTmpFood } from '../../../store/actions/app';
import { AddProduct2Cart, updateCartItems } from '../../../store/actions/shop';
import { toggleProductFavourite } from '../../../store/actions/vendors';
import ImageCarousel from '../../../common/components/image_carousel/Carousel';
import { translate } from '../../../common/services/translate';
import alerts from '../../../common/services/alerts';
import ConfirmModal from '../../../common/components/modals/ConfirmModal';
import Theme from '../../../theme';
import Config from '../../../config';
import RoundIconBtn from '../../../common/components/buttons/round_icon_button';
import RadioBtn from '../../../common/components/buttons/radiobtn';
import Counter from '../../../common/components/buttons/counter';
import MainBtn from '../../../common/components/buttons/main_button';
import CommentView from '../components/CommentView';
import RouteNames from '../../../routes/names';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const FoodScreen = (props) => {
	const [loading, setLoading] = useState(false);
	const [curModifier1, setModi1] = useState({});
	const [curModifier2, setModi2] = useState({});
	const [comments, setComments] = useState('');
	const [cartNum, setCartNum] = useState(1);

	useEffect(() => {
		return () => {
			console.log('FoodScreen screen unmount');
		};
	}, []);

	useEffect(() => {
		let foundIndex = props.cartItems.findIndex((i) => i.id == props.tmpFoodData.id);
		if (foundIndex != -1) {
			setCartNum(props.cartItems[foundIndex].quantity);
			setComments(props.cartItems[foundIndex].comments || '');

			if (props.cartItems[foundIndex].options != null && props.cartItems[foundIndex].options.length > 0) {
				props.cartItems[foundIndex].options.map((option) => {
					if (option.name == 'addition') {
						setModi1(option);
					} else {
						setModi2(option);
					}
				});
			}
		} else {
			setCartNum(1);
		}
	}, [props.cartItems, props.tmpFoodData]);

	const onPressFav = () => {
		props
			.toggleProductFavourite(props.tmpFoodData.id, props.tmpFoodData.isFav == 1 ? 0 : 1)
			.then((res) => {
				props.setTmpFood({ ...props.tmpFoodData, isFav: props.tmpFoodData.isFav == 1 ? 0 : 1 });
			})
			.catch((error) => {
				console.log('onPressFav', error);
			});
	};

	const onShare = async () => {
		const shareOptions = {
			title: 'Snapfood Vendor',
			message:
				Platform.OS === 'android'
					? `https://snapfood.al/restaurant/${props.vendorData['hash_id']}/${props.vendorData['slug']}`
					: '',
			url: `https://snapfood.al/restaurant/${props.vendorData['hash_id']}/${props.vendorData['slug']}`,
			subject: 'Link for Snapfood',
		};
		await Share.share(shareOptions);
	};

	const onPressAddCart = () => {
		let items = props.cartItems.filter((i) => i.vendor_id != props.vendorData.id);
		if (items.length > 0) {
			alerts
				.confirmation(
					translate('restaurant_details.new_order_question'),
					translate('restaurant_details.new_order_text'),
					translate('confirm'),
					translate('cancel')
				)
				.then(() => {
					onConfirmReset();
				});
		} else {
			if (cartNum <= 0) {
				// remove item from cart
				onRemoveItem();
			} else {
				onAddCart();
			}
		}
	};

	const onConfirmReset = async () => {
		let selectedOptions = [];
		if (curModifier1.id != null) {
			selectedOptions.push(curModifier1);
		}
		if (curModifier2.id != null) {
			selectedOptions.push(curModifier2);
		}

		// option_selected_required

		let cartItem = props.tmpFoodData;
		cartItem.quantity = cartNum;
		cartItem.comments = comments;
		cartItem.options = selectedOptions;

		setLoading(true);
		await props.updateCartItems([cartItem]);
		setTimeout(() => {
			setLoading(false);
			props.navigation.goBack();
		}, 700);
	};

	const onAddCart = () => {
		let selectedOptions = [];
		if (curModifier1.id != null) {
			selectedOptions.push(curModifier1);
		}
		if (curModifier2.id != null) {
			selectedOptions.push(curModifier2);
		}

		// option_selected_required

		let cartItem = props.tmpFoodData;
		cartItem.quantity = cartNum;
		cartItem.comments = comments;
		cartItem.options = selectedOptions;

		setLoading(true);
		props.AddProduct2Cart(cartItem);
		setTimeout(() => {
			setLoading(false);
			props.navigation.goBack();
		}, 700);
	};

	const onRemoveItem = async () => {
		try {
			let tmp = props.cartItems.slice(0, props.cartItems.length);
			let foundIndex = tmp.findIndex((i) => i.id == props.tmpFoodData.id);

			setLoading(true);

			if (foundIndex != -1) {
				tmp = tmp.filter((i) => i.id != props.tmpFoodData.id);
				await props.updateCartItems(tmp);
			}

			setTimeout(() => {
				setLoading(false);
				props.navigation.goBack();
			}, 700);
		} catch (error) {
			setLoading(false);
			console.log('onRemoveItem', error);
		}
	};

	const _renderHeader = () => {
		return (
			<View style={[Theme.styles.row_center, styles.header]}>
				<RoundIconBtn
					style={styles.headerBtn}
					icon={<Feather name='chevron-left' size={22} color={Theme.colors.text} />}
					onPress={() => {
						props.navigation.goBack();
					}}
				/>
				<View style={[Theme.styles.row_center_end, { flex: 1, alignItems: 'flex-end' }]}>
					<RoundIconBtn
						style={styles.headerBtn}
						icon={<Entypo name='share' size={20} color={Theme.colors.text} />}
						onPress={onShare}
					/>
					<RoundIconBtn
						style={{ width: 33, height: 33, borderRadius: 8, backgroundColor: '#fff', marginLeft: 6 }}
						icon={
							<Entypo
								name='heart'
								size={22}
								color={props.tmpFoodData.isFav == 1 ? Theme.colors.cyan2 : Theme.colors.gray5}
							/>
						}
						onPress={onPressFav}
					/>
				</View>
			</View>
		);
	};

	const _renderInfoView = () => {
		return (
			<View style={[Theme.styles.col_center_start, styles.infoView]}>
				<Text style={styles.title}>{props.tmpFoodData.title}</Text>
				<Text style={styles.descTxt}>{props.tmpFoodData.description}</Text>
				<Text style={styles.title}>{parseInt(props.tmpFoodData.price)} L</Text>
			</View>
		);
	};

	const _renderOptionList = (name) => {
		let list = [];
		if (props.tmpFoodData['product_options'] && props.tmpFoodData['product_options'].length > 0) {
			props.tmpFoodData['product_options'].map((option) => {
				if (option.type == name) {
					list.push(option);
				}
			});
		}

		return list.length == 0 ? null : (
			<View style={[Theme.styles.col_center_start, styles.infoView]}>
				<Text style={styles.subTitle}>
					{name == 'addition'
						? translate('restaurant_details.extras')
						: translate('restaurant_details.options')}
				</Text>
				{list.map((item, index) => (
					<View key={index} style={[Theme.styles.row_center, styles.optionItem]}>
						<Text style={styles.optionTxt}>{item.title}</Text>
						{name == 'addition' ? (
							<RadioBtn checked={item.id == curModifier1.id} onPress={() => setModi1(item)} />
						) : (
							<RadioBtn checked={item.id == curModifier2.id} onPress={() => setModi2(item)} />
						)}
					</View>
				))}
			</View>
		);
	};

	const _renderCartBtns = () => {
		return (
			<View style={[Theme.styles.row_center, styles.cartBtns]}>
				<Counter
					value={cartNum}
					onPlus={() => setCartNum(cartNum + 1)}
					onMinus={() => {
						let foundIndex = props.cartItems.findIndex((i) => i.id == props.tmpFoodData.id);
						if (foundIndex != -1) {
							// if edit ?
							setCartNum(cartNum > 0 ? cartNum - 1 : cartNum);
						} else {
							setCartNum(cartNum > 1 ? cartNum - 1 : cartNum);
						}
					}}
				/>
				<View style={[Theme.styles.row_center_end, { flex: 1, marginLeft: 20 }]}>
					<MainBtn
						disabled={loading}
						loading={loading}
						title={translate('restaurant_details.add_to_cart')}
						style={{ width: '100%' }}
						onPress={onPressAddCart}
					/>
				</View>
			</View>
		);
	};

	return (
		<React.Fragment>
			<KeyboardAwareScrollView style={[{ flex: 1, backgroundColor: '#fff' }]} keyboardShouldPersistTaps='handled'>
				<View style={[Theme.styles.col_center_start, Theme.styles.background, { padding: 0 }]}>
					{props.tmpFoodData.image_path != null && props.tmpFoodData.image_path != '' ? (
						<FastImage
							source={{ uri: `${Config.IMG_BASE_URL}${props.tmpFoodData.image_path}?w=600&h=600` }}
							style={[styles.img]}
							resizeMode={FastImage.resizeMode.cover}
						/>
					) : (
						<View style={{ height: 100 }} />
					)}
					{
						<View style={{ padding: 20, width: '100%' }}>
							{_renderInfoView()}
							{_renderOptionList('addition')}
							{_renderOptionList('option')}
							<View style={{ height: 12 }} />
							<CommentView
								title={translate('restaurant_details.additional_note')}
								placeholder={translate('restaurant_details.add_additional_note')}
								comments={comments}
								onChangeText={(text) => setComments(text)}
							/>
							{_renderCartBtns()}
						</View>
					}
					{_renderHeader()}
				</View>
			</KeyboardAwareScrollView>
		</React.Fragment>
	);
};

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		top: 40,
		left: 20,
		right: 20,
		height: 50,
		width: width(100) - 40,
		alignItems: 'flex-end',
	},
	headerBtn: { width: 33, height: 33, borderRadius: 8, backgroundColor: Theme.colors.white },
	title: { fontSize: 18, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	descTxt: {
		marginTop: 8,
		marginBottom: 8,
		lineHeight: 14,
		textAlign: 'left',
		fontSize: 12,
		fontFamily: Theme.fonts.medium,
		color: Theme.colors.gray7,
	},
	divider: { width: '100%', height: 1, backgroundColor: '#F6F6F9' },
	infoView: {
		width: '100%',
		alignItems: 'flex-start',
		paddingBottom: 20,
		backgroundColor: Theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: '#F6F6F9',
	},
	subTitle: {
		marginTop: 24,
		marginBottom: 12,
		fontSize: 14,
		fontFamily: Theme.fonts.semiBold,
		color: Theme.colors.text,
	},
	optionItem: { height: 40, width: '100%' },
	optionTxt: { flex: 1, fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
	commentView: { width: '100%', alignItems: 'flex-start' },
	commentInput: {
		maxHeight: '90%',
		width: '100%',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Theme.colors.gray6,
		textAlignVertical: 'top',
		padding: 16,
		fontSize: 12,
		fontFamily: Theme.fonts.medium,
		color: Theme.colors.text,
	},
	cartBtns: { width: '100%', marginTop: 12, marginBottom: 40 },
	img: { width: '100%', height: 190, resizeMode: 'cover' },
});

const mapStateToProps = ({ app, shop }) => ({
	tmpFoodData: app.tmpFoodData,
	cartItems: shop.items,
	vendorData: shop.vendorData,
});

export default connect(mapStateToProps, {
	AddProduct2Cart,
	setTmpFood,
	toggleProductFavourite,
	updateCartItems,
})(FoodScreen);
