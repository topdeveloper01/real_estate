import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Keyboard, Platform, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import { updateProfileDetails } from '../../../store/actions/auth';
import { MainBtn } from '../../../common/components';
import { translate } from '../../../common/services/translate';
import { createListing } from '../../../store/actions/listings'
import alerts from '../../../common/services/alerts';
import { getImageFullURL, isEmpty, validateUserData } from '../../../common/services/utility';
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
import Svg_addphoto from '../../../common/assets/svgs/add_a_photo.svg';


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

	const [value_city1, setValue_city1] = useState(null);
	const [value_city2, setValue_city2] = useState(null);
	const [value_city3, setValue_city3] = useState(null);


	const [open1, setOpen1] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [open3, setOpen3] = useState(false);
	const [open4, setOpen4] = useState(false);
	const [open5, setOpen5] = useState(false);
	const [open6, setOpen6] = useState(false);

	const [open_city1, setOpen_city1] = useState(false);
	const [open_city2, setOpen_city2] = useState(false);
	const [open_city3, setOpen_city3] = useState(false);

	const onOpen1 = useCallback(() => {
		setOpen2(false);
		setOpen3(false);
		setOpen4(false);
		setOpen5(false);
		setOpen6(false);

		setOpen_city1(false);
		setOpen_city2(false);
		setOpen_city3(false);
	}, []);
	const onOpen2 = useCallback(() => {
		setOpen1(false);
		setOpen3(false);
		setOpen4(false);
		setOpen5(false);
		setOpen6(false);

		setOpen_city1(false);
		setOpen_city2(false);
		setOpen_city3(false);
	}, []);
	const onOpen3 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen4(false);
		setOpen5(false);
		setOpen6(false);

		setOpen_city1(false);
		setOpen_city2(false);
		setOpen_city3(false);
	}, []);
	const onOpen4 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen3(false);
		setOpen5(false);
		setOpen6(false);

		setOpen_city1(false);
		setOpen_city2(false);
		setOpen_city3(false);
	}, []);
	const onOpen5 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen3(false);
		setOpen4(false);
		setOpen6(false);

		setOpen_city1(false);
		setOpen_city2(false);
		setOpen_city3(false);
	}, []);
	const onOpen6 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen3(false);
		setOpen4(false);
		setOpen5(false);

		setOpen_city1(false);
		setOpen_city2(false);
		setOpen_city3(false);
	}, []);


	const onOpen_city1 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen3(false);
		setOpen4(false);
		setOpen5(false);
		setOpen6(false);

		setOpen_city2(false);
		setOpen_city3(false);
	}, []);
	const onOpen_city2 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen3(false);
		setOpen4(false);
		setOpen5(false);
		setOpen6(false);

		setOpen_city1(false);
		setOpen_city3(false);
	}, []);
	const onOpen_city3 = useCallback(() => {
		setOpen1(false);
		setOpen2(false);
		setOpen3(false);
		setOpen4(false);
		setOpen5(false);
		setOpen6(false);

		setOpen_city1(false);
		setOpen_city2(false);
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

	const [cities1, setCities1] = useState([]);
	const [cities2, setCities2] = useState([]);
	const [cities3, setCities3] = useState([]);

	const [state, setState] = useState({})

	useEffect(() => {
		let tmp = [];
		props.city1_list.map(item => {
			tmp.push({ label: item.name, value: item.name })
		})
		setCities1(tmp);
	}, [props.city1_list, props.city2_list, props.city3_list])

	useEffect(() => {
		onChangeCity1(value_city1)
	}, [value_city1])

	useEffect(() => {
		onChangeCity2(value_city2)
	}, [value_city2])


	const onChangeCity1 = (_city_1) => {
		let index = props.city1_list.findIndex(item => item.name == _city_1)
		if (index != -1) {
			let tmp = [];
			props.city2_list.filter(item => item.city_1 == props.city1_list[index].id).map(item => {
				tmp.push({ label: item.name, value: item.name })
			})
			setCities2(tmp) 
			setValue_city2(null)

			setCities3([])
			setValue_city3(null)
		}
		else {
			setCities2([])
			setValue_city2(null)
			setCities3([])
			setValue_city3(null)
		}
	}

	const onChangeCity2 = (_city_2) => {
		let index = props.city2_list.findIndex(item => item.name == _city_2)
		if (index != -1) {
			let tmp = [];
			props.city3_list.filter(item => item.city_2 == props.city2_list[index].id).map(item => {
				tmp.push({ label: item.name, value: item.name })
			})
			setCities3(tmp)
			setValue_city3(null)
		}
		else {
			setCities3([])
			setValue_city3(null)
		}
	}

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
		if (isEmpty(state.title) || isEmpty(state.type_use) || isEmpty(value_city1) ||
			isEmpty(value_city2) || isEmpty(value_city3) || isEmpty(state.floor) ||
			isEmpty(state.size) || isEmpty(state.living_rooms) || isEmpty(state.rooms) ||
			isEmpty(state.toilets) || isEmpty(state.room_toilets) || isEmpty(state.helper_rooms)) {
			alerts.error('', '填寫所有字段');
			return false
		}
		if (isEmpty(state.isSell) && isEmpty(state.isRent)) {
			alerts.error('', '填寫所有字段');
			return false
		}
		if (state.isSell != true && state.isRent != true) {
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
					area: value_city1,
					street : value_city2,
					building : value_city3,
					photo: photoUrl,
					is_featured: false,
					owner_id: props.user.id
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
	console.log('newListingData ', value_city1, value_city2, value_city3 )

	return (
		<View style={styles.container}>
			<Header1
				onLeft={() => {
					props.navigation.goBack();
				}}
				style={{ paddingHorizontal: 20, height: 90, marginBottom: 0 }}
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
									style={[Theme.styles.col_center, { padding: 20 }]}
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

					{
						Platform.OS == 'android' ?
							<React.Fragment>
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
										borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 103
									}}
									onPress={() => {
										Keyboard.dismiss()
									}}
								/>
								<DropDownPicker
									open={open_city1}
									setOpen={setOpen_city1}
									onOpen={onOpen_city1}
									value={value_city1}
									setValue={setValue_city1}
									placeholder={'地區'}
									items={cities1}
									setItems={setCities1} 
									style={{
										borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 102
									}}
									onPress={() => {
										Keyboard.dismiss()
									}}
									dropDownDirection="BOTTOM"
									ListEmptyComponent={() => <View />}
								/>
								<DropDownPicker
									open={open_city2}
									setOpen={setOpen_city2}
									onOpen={onOpen_city2}
									value={value_city2}
									setValue={setValue_city2}
									placeholder={'街道'}
									items={cities2}
									setItems={setCities2} 
									style={{
										borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 101
									}}
									onPress={() => {
										Keyboard.dismiss()
									}}
									dropDownDirection="BOTTOM"
									ListEmptyComponent={() => <View />}
								/>
								<DropDownPicker
									open={open_city3}
									setOpen={setOpen_city3}
									onOpen={onOpen_city3}
									value={value_city3}
									setValue={setValue_city3}
									placeholder={'大廈 / 屋苑'}
									items={cities3}
									setItems={setCities3} 
									style={{
										borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 100
									}}
									onPress={() => {
										Keyboard.dismiss()
									}}
									dropDownDirection="BOTTOM"
									ListEmptyComponent={() => <View />}
								/>
							</React.Fragment>
							:
							<React.Fragment>
								<View style={{ zIndex: 103 }}>
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
											borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 103
										}}
										onPress={() => {
											Keyboard.dismiss()
										}}
									/>
								</View>
								<View style={{ zIndex: 102 }}>
									<DropDownPicker
										open={open_city1}
										setOpen={setOpen_city1}
										onOpen={onOpen_city1}
										value={value_city1}
										setValue={setValue_city1}
										placeholder={'地區'}
										items={cities1}
										setItems={setCities1}
										onChangeValue={(area) => {
											setState({ ...state, area })
										}}
										style={{
											borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 102
										}}
										onPress={() => {
											Keyboard.dismiss()
										}}
										dropDownDirection="BOTTOM"
										ListEmptyComponent={() => <View />}
									/>
								</View>
								<View style={{ zIndex: 101 }}>
									<DropDownPicker
										open={open_city2}
										setOpen={setOpen_city2}
										onOpen={onOpen_city2}
										value={value_city2}
										setValue={setValue_city2}
										placeholder={'街道'}
										items={cities2}
										setItems={setCities2}
										onChangeValue={(street) => {
											setState({ ...state, street })
										}}
										style={{
											borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 101
										}}
										onPress={() => {
											Keyboard.dismiss()
										}}
										dropDownDirection="BOTTOM"
										ListEmptyComponent={() => <View />}
									/>
								</View>
								<View style={{ zIndex: 100 }}>
									<DropDownPicker
										open={open_city3}
										setOpen={setOpen_city3}
										onOpen={onOpen_city3}
										value={value_city3}
										setValue={setValue_city3}
										placeholder={'大廈 / 屋苑'}
										items={cities3}
										setItems={setCities3}
										onChangeValue={(building) => {
											setState({ ...state, building })
										}}
										style={{
											borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 100
										}}
										onPress={() => {
											Keyboard.dismiss()
										}}
										dropDownDirection="BOTTOM"
										ListEmptyComponent={() => <View />}
									/>
								</View>
							</React.Fragment>
					}

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
						keyboardType='decimal-pad'
						selectionColor={Theme.colors.cyan2}
						onChangeText={(size) => setState({ ...state, size })}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={state.size}
						secure={false}
						style={{ marginBottom: 12 }}
					/>
					{
						Platform.OS == 'android' ?
							<React.Fragment>
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
									onPress={() => {
										Keyboard.dismiss()
									}}
									dropDownDirection="BOTTOM"
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
									onPress={() => {
										Keyboard.dismiss()
									}}
									dropDownDirection="BOTTOM"
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
									onPress={() => {
										Keyboard.dismiss()
									}}
									dropDownDirection="BOTTOM"
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
									onPress={() => {
										Keyboard.dismiss()
									}}
									dropDownDirection="BOTTOM"
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
									onPress={() => {
										Keyboard.dismiss()
									}}
									dropDownDirection="BOTTOM"
								/>
							</React.Fragment>
							:
							<React.Fragment>
								<View style={{ zIndex: 99 }}>
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
										onPress={() => {
											Keyboard.dismiss()
										}}
										dropDownDirection="BOTTOM"
									/>
								</View>
								<View style={{ zIndex: 98 }}>
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
										onPress={() => {
											Keyboard.dismiss()
										}}
										dropDownDirection="BOTTOM"
									/>
								</View>
								<View style={{ zIndex: 97 }}>
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
										onPress={() => {
											Keyboard.dismiss()
										}}
										dropDownDirection="BOTTOM"
									/>
								</View>
								<View style={{ zIndex: 96 }}>
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
										onPress={() => {
											Keyboard.dismiss()
										}}
										dropDownDirection="BOTTOM"
									/>
								</View>
								<View style={{ zIndex: 95 }}>
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
										onPress={() => {
											Keyboard.dismiss()
										}}
										dropDownDirection="BOTTOM"
									/>
								</View>
							</React.Fragment>
					}

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
								Keyboard.dismiss()
								setState({ ...state, isSell: (state.isSell == true ? false : true) })
							}}
							text='售'
							style={{ marginRight: '30%' }}
							textStyle={{ marginLeft: 12, fontSize: 16, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text }}
						/>
						<RadioBtn
							checked={state.isRent == true}
							onPress={() => {
								Keyboard.dismiss()
								setState({ ...state, isRent: (state.isRent == true ? false : true) })
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
						style={{ marginBottom: 12, minHeight: 70 }}
					/>
					<View style={{ height: 20 }}></View>
				</KeyboardAwareScrollView>
				<View style={{ width: '100%' }}>
					<MainBtn
						disabled={isLoading}
						loading={isLoading}
						style={{ borderRadius: 0, height: 70 }}
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
	city1_list: app.city1_list,
	city2_list: app.city2_list,
	city3_list: app.city3_list,
});

export default connect(mapStateToProps, {
	updateProfileDetails,
})(AddListingScreen);
