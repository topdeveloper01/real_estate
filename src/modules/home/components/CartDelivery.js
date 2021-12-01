import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import moment from 'moment';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Picker from '@gregfrench/react-native-wheel-picker';
var PickerItem = Picker.Item;
import { connect } from 'react-redux';
import { saveAddress, getAddresses, setTmpLocationPicked } from '../../../store/actions/app';
import { setDeliveryInfoCart } from '../../../store/actions/shop';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import RouteNames from '../../../routes/names';
import { OrderType_Delivery, OrderType_Pickup, OrderType_Reserve, Order_Pickedup } from '../../../config/constants';
import DotBorderButton from '../../../common/components/buttons/dot_border_button';
import AuthInput from '../../../common/components/AuthInput';
import AddressItem from '../../../common/components/AddressItem';
import Dropdown from './Dropdown';
import CommentView from './CommentView';
import ReserveItem from './ReserveItem';

const CartDelivery = (props) => {
	const [isNoteEdit, setNoteEdit] = useState(false);

	const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
	const [time, setTime] = useState(moment(new Date()).format('h') + ':00');
	const [apm, setApm] = useState(moment(new Date()).format('A'));

	const dates = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const times = [
		'0:00',
		'1:00',
		'2:00',
		'3:00',
		'4:00',
		'5:00',
		'6:00',
		'7:00',
		'8:00',
		'9:00',
		'10:00',
		'11:00',
		'12:00',
	];
	const apms = ['PM', 'AM'];

	const [order_methods, setOrderMethods] = useState([]);

	useEffect(() => {
		if (props.addresses != null && props.addresses.length > 0) {
			let comments = '';
			if (props.delivery_info.handover_method == OrderType_Delivery) {
				comments = props.addresses[0].notes;
			}
			props.setDeliveryInfoCart({
				address: props.addresses[0],
				comments: comments,
			});
		} else {
			props.setDeliveryInfoCart({
				address: {},
			});
		}
	}, [props.addresses]);

	useEffect(() => {
		if (props.vendorData.order_method != null) {
			let supported_order_methods = props.vendorData.order_method.split('-');
			if (supported_order_methods.length > 0) {
				setOrderMethods(supported_order_methods);
				props.setDeliveryInfoCart({
					handover_method: supported_order_methods[0],
				});
			}
		}
	}, [props.vendorData.id]);

	useEffect(() => {
		let pickup_time = time;
		if (apm == 'PM') {
			pickup_time = parseInt(time.split(':')[0]) + 12 + ':00';
		}

		props.setDeliveryInfoCart({
			pickup_date: date,
			pickup_time: pickup_time,
		});
	}, []);

	const getDays = () => {
		let days = [];
		for (let i = 0; i < 7; i++) {
			let day = moment(new Date()).add(i, 'days').toDate();
			days.push({
				date: moment(day).format('YYYY-MM-DD'),
				day: dates[day.getDay()],
			});
		}
		days[0].day = 'Today';
		days[1].day = 'Tomorrow';
		return days;
	};

	const _renderHandover = () => {
		return (
			<View style={[Theme.styles.col_center_start, styles.sectionView]}>
				<View style={[Theme.styles.row_center, { width: '100%' }]}>
					<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>
						{translate('vendor_profile.handover_method')}
					</Text>
					<Dropdown
						list_items={order_methods}
						style={{ width: 155 }}
						item_height={40}
						value={props.delivery_info.handover_method}
						onChange={(method) => {
							let comments = '';
							if (method == OrderType_Delivery && props.delivery_info.address != null) {
								comments = props.delivery_info.address.notes;
							}
							props.setDeliveryInfoCart({
								handover_method: method,
								comments: comments,
								tip_rider: 0,
							});
						}}
					/>
				</View>
			</View>
		);
	};

	const _renderDeliveryInfo = () => {
		const onGoAddress = () => {
			props.navigation.navigate(RouteNames.AddressesScreen, { isFromCart: true });
		};
		return (
			<View style={[Theme.styles.col_center_start, styles.sectionView]}>
				<View style={[Theme.styles.row_center, { width: '100%', marginBottom: 8 }]}>
					<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>{translate('cart.delivery_info')}</Text>
				</View>
				{props.delivery_info.address != null && props.delivery_info.address.id != null ? (
					<AddressItem
						data={props.delivery_info.address}
						onEdit={onGoAddress}
						edit_text={translate('cart.change_address')}
						outOfDeliveryArea={props.outOfDeliveryArea == true}
						textSize={13}
					/>
				) : (
					<DotBorderButton
						title={translate('address_list.add_new_address')}
						style={{ width: '100%' }}
						onPress={onGoAddress}
					/>
				)}
				<TouchableOpacity onPress={() => setNoteEdit(!isNoteEdit)}>
					<View style={[Theme.styles.row_center, { marginTop: 8 }]}>
						<Text style={[styles.item_txt, { marginRight: 3 }]}>{translate('cart.delivery_note')}</Text>
						<FeatherIcon name='chevron-right' size={16} color={Theme.colors.text} />
					</View>
				</TouchableOpacity>
				<View style={{ width: '100%', paddingTop: 8 }}>
					{
						isNoteEdit == true ? (
							<CommentView
								hide_label={true}
								placeholder={translate('cart.delivery_note')}
								comments={props.delivery_info.comments}
								onChangeText={(text) => {
									props.setDeliveryInfoCart({
										comments: text,
									});
								}}
							/>
						) : null
						// <TouchableOpacity onPress={()=>setNoteEdit(!isNoteEdit)}>
						//     <Text style={[Theme.styles.flex_1, styles.delivery_note_txt]}>{props.delivery_info.comments}</Text>
						// </TouchableOpacity>
					}
				</View>
			</View>
		);
	};

	const _renderPickupInfo = () => {
		return (
			<View style={[Theme.styles.col_center_start, styles.sectionView]}>
				<View style={{ width: '100%', paddingBottom: 20 }}>
					<CommentView
						title={translate('cart.pickup_note')}
						placeholder={translate('cart.add_your_note')}
						comments={props.delivery_info.comments}
						onChangeText={(text) => {
							props.setDeliveryInfoCart({
								comments: text,
							});
						}}
					/>
				</View>
				<Text style={styles.notiTxt}>{translate('cart.pickup_after_30')}</Text>
				{_renderPickupTime()}
			</View>
		);
	};

	const _renderReserveInfo = () => {
		return (
			<View style={[Theme.styles.col_center_start, styles.sectionView]}>
				<View style={[Theme.styles.row_center, { width: '100%', marginBottom: 16 }]}>
					<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>{translate('cart.reserve_for')}</Text>
				</View>
				{
					<ReserveItem
						data={props.user}
						onEdit={() => {
							// onEditUser()
						}}
						onSelect={() => {}}
					/>
				}
				{_renderNumGuests()}
				{_renderPickupTime()}
			</View>
		);
	};

	const _renderContactless = () => {
		return (
			<View style={[Theme.styles.col_center_start, styles.sectionView]}>
				<View style={[Theme.styles.row_center, { width: '100%' }]}>
					<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>
						{translate('cart.contactless_delivery')}
					</Text>
					<Switch
						style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.65 }] }}
						trackColor={{ false: '#C0EBEC', true: '#C0EBEC' }}
						thumbColor={props.delivery_info.contactless_delivery ? Theme.colors.cyan2 : '#C0EBEC'}
						ios_backgroundColor='#C0EBEC'
						onValueChange={() => {
							props.setDeliveryInfoCart({
								contactless_delivery: !props.delivery_info.contactless_delivery,
							});
						}}
						value={props.delivery_info.contactless_delivery == true}
					/>
				</View>
			</View>
		);
	};

	const _renderNumGuests = () => {
		return (
			<View style={[Theme.styles.row_center, { width: '100%', marginBottom: 10 }]}>
				<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>{translate('cart.num_guests')}</Text>
				<AuthInput
					style={{
						width: 122,
						height: 40,
						borderWidth: 1,
						borderColor: Theme.colors.gray6,
						backgroundColor: Theme.colors.white,
					}}
					placeholder=''
					textAlign='center'
					fontSize={12}
					keyboardType='number-pad'
					value={props.delivery_info.num_guests || ''}
					onChangeText={(text) => {
						props.setDeliveryInfoCart({
							num_guests: text,
						});
					}}
				/>
			</View>
		);
	};

	const _renderPickupTime = () => {
		const onChangeDay = (_date) => {
			setDate(_date);
			props.setDeliveryInfoCart({
				pickup_date: _date,
			});
		};
		const onChangeTime = (_time) => {
			setTime(_time);
			let pickup_time = _time;
			if (apm == 'PM') {
				pickup_time = parseInt(_time.split(':')[0]) + 12 + ':00';
			}
			props.setDeliveryInfoCart({
				pickup_time: pickup_time,
			});
		};
		const onChangeAP = (_apm) => {
			setApm(_apm);
			let pickup_time = time;
			if (_apm == 'PM') {
				pickup_time = parseInt(time.split(':')[0]) + 12 + ':00';
			}
			props.setDeliveryInfoCart({
				pickup_time: pickup_time,
			});
		};

		return (
			<View style={[Theme.styles.col_center_start]}>
				<View style={[Theme.styles.row_center, { width: '100%', marginBottom: 16 }]}>
					<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>
						{props.delivery_info.handover_method == OrderType_Pickup
							? translate('cart.custom_pickup')
							: translate('cart.date_time')}
					</Text>
				</View>
				<View style={[Theme.styles.row_center, styles.pickup]}>
					<Picker
						style={{ width: '50%', height: 120, backgroundColor: Theme.colors.white }}
						lineColor={Theme.colors.white}
						selectedValue={getDays().findIndex((i) => i.date == date)}
						itemStyle={styles.wheelItemTxt}
						itemSpace={40}
						onValueChange={(index) => {
							onChangeDay(getDays()[index].date);
						}}
					>
						{getDays().map((item, i) => (
							<PickerItem label={item.day} value={i} key={i} />
						))}
					</Picker>
					<Picker
						style={{ width: '25%', height: 120, backgroundColor: Theme.colors.white }}
						lineColor={Theme.colors.white}
						selectedValue={times.findIndex((i) => i == time)}
						itemStyle={styles.wheelItemTxt}
						itemSpace={40}
						textColor={'#000'}
						onValueChange={(index) => {
							onChangeTime(times[index]);
						}}
					>
						{times.map((value, i) => (
							<PickerItem label={value} value={i} key={i} />
						))}
					</Picker>
					<Picker
						style={{ width: '25%', height: 120, backgroundColor: Theme.colors.white }}
						lineColor={Theme.colors.white}
						selectedValue={apms.findIndex((i) => i == apm)}
						itemStyle={styles.wheelItemTxt}
						itemSpace={40}
						onValueChange={(index) => {
							onChangeAP(apms[index]);
						}}
					>
						{apms.map((value, i) => (
							<PickerItem label={value} value={i} key={i} />
						))}
					</Picker>
					{Platform.OS == 'android' && (
						<View
							style={{
								width: '100%',
								height: 1,
								position: 'absolute',
								top: 40,
								backgroundColor: Theme.colors.gray9,
							}}
						></View>
					)}
					{Platform.OS == 'android' && (
						<View
							style={{
								width: '100%',
								height: 1,
								position: 'absolute',
								top: 80,
								backgroundColor: Theme.colors.gray9,
							}}
						></View>
					)}
				</View>
			</View>
		);
	};

	return (
		<View style={{ flex: 1, width: '100%', paddingHorizontal: 20 }}>
			{props.vendorData.order_method != 'Delivery' && order_methods.length > 0 && _renderHandover()}
			{props.delivery_info.handover_method == OrderType_Delivery && _renderDeliveryInfo()}
			{props.delivery_info.handover_method == OrderType_Pickup && _renderPickupInfo()}
			{props.delivery_info.handover_method == OrderType_Reserve && _renderReserveInfo()}
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
	applyBtn: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.cyan2 },
	categ_view: { height: 47, width: '100%', paddingLeft: 20, borderTopWidth: 1, borderTopColor: '#F6F6F9' },
	categ_txt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: '#AAA8BF' },
	listItem: {
		height: 54,
		width: '100%',
		marginBottom: 12,
		borderRadius: 15,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: '#FAFAFC',
	},
	item_txt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },

	subjectTitle: { fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	divider: { width: '100%', height: 1, backgroundColor: Theme.colors.gray9 },
	sectionView: {
		width: '100%',
		alignItems: 'flex-start',
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: Theme.colors.gray9,
	},

	notiTxt: {
		marginBottom: 20,
		width: '100%',
		textAlign: 'center',
		fontSize: 12,
		fontFamily: Theme.fonts.semiBold,
		color: Theme.colors.red1,
	},
	pickup: { width: '100%', height: 120 },
	wheelItemTxt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, fontWeight: '900', color: '#000' },

	delivery_note_txt: { paddingHorizontal: 6, fontSize: 12, color: Theme.colors.text, fontFamily: Theme.fonts.medium },
});

const mapStateToProps = ({ app, shop }) => ({
	user: app.user,
	addresses: app.addresses,
	delivery_info: shop.delivery_info,
	vendorData: shop.vendorData || {},
});

export default connect(mapStateToProps, {
	saveAddress,
	getAddresses,
	setTmpLocationPicked,
	setDeliveryInfoCart,
})(CartDelivery);
