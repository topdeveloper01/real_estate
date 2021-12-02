import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Keyboard, StatusBar, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-date-picker';
import { updateProfileDetails } from '../../../store/actions/auth';
import { MainBtn } from '../../../common/components';
import { translate } from '../../../common/services/translate';
import { createListing } from '../../../store/actions/listings'
import alerts from '../../../common/services/alerts';
import { getImageFullURL, isEmpty, validateUserData } from '../../../common/services/utility';
import { channel_collection, updateChannelUserInfo } from '../../../common/services/chat';
import Theme from '../../../theme';
import AuthInput from '../../../common/components/AuthInput';
import ImgPickOptionModal from '../../../common/components/modals/ImgPickOptionModal';
import Header1 from '../../../common/components/Header1';
import moment from 'moment';
import { RadioBtn } from '../../../common/components';
import { FOR_PERSONAL, FOR_BUSINESS } from '../../../config/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { uploadPhoto } from '../../../common/services/fbstorage';
// Svg
import Svg_addphoto from '../../../common/assets/svgs/admin/add_a_photo.svg';

const AddListingScreen = (props) => {
	const [isLoading, ShowLoading] = useState(false);
	const [showPickerModal, setShowPickerModal] = useState(false);
	const [photo, setPhoto] = useState(null);


	const [value1, setValue1] = useState(null);
	const [value2, setValue2] = useState(null);
	const [value3, setValue3] = useState(null);
	const [value4, setValue4] = useState(null);
	const [value5, setValue5] = useState(null);
	const [value6, setValue6] = useState(null);

	const [open1, setOpen1] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);
	const [open4, setOpen4] = useState(false);
	const [open5, setOpen5] = useState(false);
	const [open6, setOpen6] = useState(false);

	const onOpen1 = useCallback(() => {
		setOpen2(false);
		setOpen3(false);
		setOpen4(false);
		setOpen5(false);
		setOpen6(false);
	}, []);
	const onOpen2 = useCallback(() => {
		setOpen1(false);
		setOpen3(false);
		setOpen4(false);
		setOpen5(false);
		setOpen6(false);
	}, []);
	const onOpen3 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen4(false);
		setOpen5(false);
		setOpen6(false);
	}, []);
	const onOpen4 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen3(false);
		setOpen5(false);
		setOpen6(false);
	}, []);
	const onOpen5 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen3(false);
		setOpen4(false);
		setOpen6(false);
	}, []);
	const onOpen6 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen3(false);
		setOpen4(false);
		setOpen5(false);
	}, []);


	const [type_use_items, setTypeUseItems] = useState([
		{ label: '私人住宅物業', value: FOR_PERSONAL },
		{ label: '商業用途', value: FOR_BUSINESS }
	]);

	const [living_rooms, setLivingRooms] = useState([
		{ label: '1廳', value: 1 },
		{ label: '2廳', value: 2 },
		{ label: '3廳以上', value: 3 }
	]);

	const [rooms, setRooms] = useState([
		{ label: '開放式單位 ', value: 0 },
		{ label: '1房 ', value: 1 },
		{ label: '2房 ', value: 2 },
		{ label: '3房 ', value: 3 },
		{ label: '4房 ', value: 4 },
		{ label: '5房以上  ', value: 5 }
	]);

	const [toilets, setToilets] = useState([
		{ label: '1廁 ', value: 1 },
		{ label: '2廁 ', value: 2 },
		{ label: '3廁 ', value: 3 },
		{ label: '4廁 ', value: 4 },
		{ label: '5廁以上  ', value: 5 }
	]);

	const [room_toilets, setRoomToilets] = useState([
		{ label: '1套廁 ', value: 1 },
		{ label: '2套廁 ', value: 2 },
		{ label: '3套廁 ', value: 3 },
		{ label: '4套廁 ', value: 4 },
		{ label: '5套廁以上  ', value: 5 }
	]);

	const [helper_rooms, setHelperRooms] = useState([
		{ label: '1工人房', value: 1 },
		{ label: '2工人房', value: 2 },
		{ label: '3工人房以上', value: 3 }
	]);


	const [state, setState] = useState({})

	useEffect(() => { }, []);

	const onImageUpload = () => {
		ImagePicker.openPicker({
			mediaType: 'photo',
			cropping: true,
			includeBase64: true,
		}).then((image) => {
			setPhoto(image);
			setShowPickerModal(false);
		});
	};
	const onCapture = () => {
		ImagePicker.openCamera({
			cropping: true,
			includeBase64: true,
		}).then((image) => {
			setPhoto(image);
			setShowPickerModal(false);
		});
	};

	const validateInputs = () => {
		if (photo == null) {
			alerts.error('', '選擇一張照片');
			return false;
		}
		if (isEmpty(state.title) || isEmpty(state.type_use) || isEmpty(state.area) ||
			isEmpty(state.street) || isEmpty(state.building) || isEmpty(state.floor) ||
			isEmpty(state.size) || isEmpty(state.living_rooms) || isEmpty(state.rooms) ||
			isEmpty(state.toilets) || isEmpty(state.room_toilets) || isEmpty(state.helper_rooms)) {
			alerts.error('', '填寫所有字段');
			return false
		}
		if (isEmpty(state.isSell) && isEmpty(state.isRent)) {
			alerts.error('', '填寫所有字段');
			return false
		}
		if (state.isSell == true && isEmpty(state.price)) {
			alerts.error('', '填寫所有字段');
			return false
		}
		if (state.isRent == true && isEmpty(state.rent_price)) {
			alerts.error('', '填寫所有字段');
			return false
		}
		return true;
	}

	const onSave = async () => {
		if (validateInputs()) {
			try {
				ShowLoading(true);
				let photoUrl = ''
				if (photo != null) {
					photoUrl = await uploadPhoto(`users/photo/${new Date().getTime()}.jpg`, photo.path);
				}
				if (isEmpty(photoUrl)) {
					ShowLoading(false);
					alerts.error('警告', '出了些問題');
					return
				}
				let newListingData = {
					...state,
					photo: photoUrl
				}
				await createListing(newListingData);
				 
				ShowLoading(false);
				alerts.info('', '您已成功創建列表').then((res) => {
					props.navigation.goBack();
				});
			} catch (error) {
				ShowLoading(false);
				console.log('on Save', error);
				alerts.error('警告', '出了些問題');
			}
		}
	};


	return (
		<View style={styles.container}>
			<Header1
				onLeft={() => {
					props.navigation.goBack();
				}}
				style={{ paddingHorizontal: 20, marginBottom: 0 }}
				title={'新增單位'}
			/>
			<View style={styles.formView}>
				<KeyboardAwareScrollView style={styles.scrollview} keyboardShouldPersistTaps='handled'>
					<View style={{ height: 20 }}></View>
					<View style={Theme.styles.col_center}>
						<View style={[Theme.styles.col_center, { width: 116, height: 116 }]}>
							<View style={[Theme.styles.col_center, styles.photoView]}>
								{
									photo &&
									<FastImage
										source={{ uri: photo.path }}
										style={styles.avatarImg}
										resizeMode={FastImage.resizeMode.cover}
									/>
								}
								<TouchableOpacity
									onPress={() => setShowPickerModal(true)}
									style={[Theme.styles.col_center, {padding: 20}]}
								>
									<Svg_addphoto />
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<AuthInput
						placeholder={'標題'}
						underlineColorAndroid={'transparent'}
						keyboardType={'default'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(title) => setState({ ...state, title })}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={state.title}
						secure={false}
						style={{ marginTop: 25, marginBottom: 12 }}
					/>
					<DropDownPicker
						open={open1}
						setOpen={setOpen1}
						onOpen={onOpen1}
						value={value1}
						setValue={setValue1}
						placeholder={'物業類型 '}
						items={type_use_items}
						setItems={setTypeUseItems}
						onChangeValue={(type_use) => setState({ ...state, type_use })}
						style={{
							borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 100
						}}
						onPress={()=>{
							Keyboard.dismiss()
						}}
					/>
					<AuthInput
						placeholder={'地區 '}
						underlineColorAndroid={'transparent'}
						keyboardType={'default'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(area) => setState({ ...state, area })}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={state.area}
						secure={false}
						style={{ marginBottom: 12 }}
					/>
					<AuthInput
						placeholder={'街道 '}
						underlineColorAndroid={'transparent'}
						keyboardType={'default'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(street) => setState({ ...state, street })}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={state.street}
						secure={false}
						style={{ marginBottom: 12 }}
					/>
					<AuthInput
						placeholder={'大廈 / 屋苑 '}
						underlineColorAndroid={'transparent'}
						keyboardType={'default'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(building) => setState({ ...state, building })}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={state.building}
						secure={false}
						style={{ marginBottom: 12 }}
					/>
					<AuthInput
						placeholder={'樓層 / 房號 '}
						underlineColorAndroid={'transparent'}
						keyboardType={'default'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(floor) => setState({ ...state, floor })}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={state.floor}
						secure={false}
						style={{ marginBottom: 12 }}
					/>
					<AuthInput
						placeholder={'實用面積 '}
						underlineColorAndroid={'transparent'}
						keyboardType={'default'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(size) => setState({ ...state, size })}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={state.size}
						secure={false}
						style={{ marginBottom: 12 }}
					/>
					<DropDownPicker
						open={open2}
						setOpen={setOpen2}
						onOpen={onOpen2}
						value={value2}
						setValue={setValue2}
						placeholder={'多少廳'}
						items={living_rooms}
						setItems={setLivingRooms}
						onChangeValue={(living_rooms) => {
							setState({ ...state, living_rooms })
						}}
						style={{
							borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 99
						}}
						onPress={()=>{
							Keyboard.dismiss()
						}}
					/>
					<DropDownPicker
						open={open3}
						setOpen={setOpen3}
						onOpen={onOpen3}
						value={value3}
						setValue={setValue3}
						placeholder={'多少房'}
						items={rooms}
						setItems={setRooms}
						onChangeValue={(rooms) => {
							setState({ ...state, rooms })
						}}
						style={{
							borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 98
						}}
						onPress={()=>{
							Keyboard.dismiss()
						}}
					/>
					<DropDownPicker
						open={open4}
						setOpen={setOpen4}
						onOpen={onOpen4}
						value={value4}
						setValue={setValue4}
						placeholder={'多少廁'}
						items={toilets}
						setItems={setToilets}
						onChangeValue={(toilets) => {
							setState({ ...state, toilets })
						}}
						style={{
							borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 97
						}}
						onPress={()=>{
							Keyboard.dismiss()
						}}
					/>
					<DropDownPicker
						open={open5}
						setOpen={setOpen5}
						onOpen={onOpen5}
						value={value5}
						setValue={setValue5}
						placeholder={'多少套廁'}
						items={room_toilets}
						setItems={setRoomToilets}
						onChangeValue={(room_toilets) => {
							setState({ ...state, room_toilets })
						}}
						style={{
							borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 96
						}}
						onPress={()=>{
							Keyboard.dismiss()
						}}
					/>
					<DropDownPicker
						open={open6}
						setOpen={setOpen6}
						onOpen={onOpen6}
						value={value6}
						setValue={setValue6}
						placeholder={'多少工人房'}
						items={helper_rooms}
						setItems={setHelperRooms}
						onChangeValue={(helper_rooms) => {
							setState({ ...state, helper_rooms })
						}}
						style={{
							borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 95
						}}
						onPress={()=>{
							Keyboard.dismiss()
						}}
					/>
					<AuthInput
						placeholder={'售價錢'}
						underlineColorAndroid={'transparent'}
						keyboardType='decimal-pad'
						selectionColor={Theme.colors.cyan2}
						onChangeText={(price) => setState({ ...state, price })}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={state.price}
						secure={false}
						style={{ marginBottom: 12 }}
					/>
					<AuthInput
						placeholder={'租價錢'}
						underlineColorAndroid={'transparent'}
						keyboardType='decimal-pad'
						selectionColor={Theme.colors.cyan2}
						onChangeText={(rent_price) => setState({ ...state, rent_price })}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={state.rent_price}
						secure={false}
						style={{ marginBottom: 12 }}
					/>
					<View style={[Theme.styles.row_center_start, { marginTop: 8, marginVertical: 16 }]}>
						<RadioBtn
							checked={state.isSell == true}
							onPress={() => {
								setState({ ...state, isSell: true })
							}}
							text='售'
							style={{ marginRight: '30%' }}
							textStyle={{ marginLeft: 12, fontSize: 16, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text }}
						/>
						<RadioBtn
							checked={state.isRent == false}
							onPress={() => {
								setState({ ...state, isRent: false })
							}}
							text='租'
							textStyle={{ marginLeft: 12, fontSize: 16, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text }}
						/>
					</View>
					<AuthInput
						placeholder={'單位資訊 '}
						underlineColorAndroid={'transparent'}
						keyboardType={'default'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(other) => setState({ ...state, other })}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={state.other}
						secure={false}
						textAlignVertical={'top'}
						numberOfLines={4}
						multiline={true}
						style={{ marginBottom: 12 }}
					/>
					<View style={{ height: 20 }}></View>
				</KeyboardAwareScrollView>
				<View style={{ width: '100%' }}>
					<MainBtn
						disabled={isLoading}
						loading={isLoading}
						style={{ borderRadius: 0 }}
						title={'確認新增'}
						onPress={onSave}
					/>
				</View>

			</View>
			<ImgPickOptionModal
				showModal={showPickerModal}
				onCapture={onCapture}
				onImageUpload={onImageUpload}
				onClose={() => setShowPickerModal(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: Theme.colors.white,
	},
	formView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
	},
	scrollview: {
		flex: 1, width: '100%', paddingHorizontal: 20
	},
	applyBtn: { fontSize: 16, fontFamily: Theme.fonts.semiBold, color: Theme.colors.cyan2 },
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

	birthdayView: {
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: '#E9E9F7',
		borderRadius: 12,
		height: 50,
		paddingLeft: 12,
		paddingRight: 12,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		marginBottom: 12,
	},
	birthdayTxt: {
		fontSize: 14,
		fontFamily: Theme.fonts.medium,
		flex: 1,
		marginLeft: 4,
	},

	photoView: {
		height: 100,
		width: 100,
		borderWidth: 1,
		borderColor: '#FF7675',
		borderRadius: 50,
	},
	avatarImg: { width: 100, height: 100, borderRadius: 50, position: 'absolute', top: 0, left: 0 },
	modalContent: {
		width: '100%',
		paddingHorizontal: 20,
		paddingBottom: 30,
		paddingTop: 20,
		backgroundColor: Theme.colors.white,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	modalTitle: {
		width: '100%',
		textAlign: 'center',
		fontSize: 16,
		fontFamily: Theme.fonts.bold,
		color: Theme.colors.text,
		marginBottom: 12,
	},
});

const mapStateToProps = ({ app }) => ({
	user: app.user,
	home_orders_filter: app.home_orders_filter,
});

export default connect(mapStateToProps, {
	updateProfileDetails,
})(AddListingScreen);
