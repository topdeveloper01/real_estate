import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'; 
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import ImagePicker from 'react-native-image-crop-picker'; 
import { updateProfileDetails } from '../../../store/actions/auth';
import { MainBtn } from '../../../common/components';
import { translate } from '../../../common/services/translate';
import alerts from '../../../common/services/alerts';
import { getImageFullURL, isEmpty, validateUserData } from '../../../common/services/utility';
import {  updateChannelUserInfo } from '../../../common/services/chat';
import Theme from '../../../theme';
import AuthInput from '../../../common/components/AuthInput';
import ImgPickOptionModal from '../../../common/components/modals/ImgPickOptionModal';
import Header1 from '../../../common/components/Header1';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
import { uploadPhoto } from '../../../common/services/firebase';

const ProfileEditScreen = (props) => {
	const [isLoading, ShowLoading] = useState(false);
	const [isDateModal, ShowDateModal] = useState(false);
	const [showPickerModal, setShowPickerModal] = useState(false);
	const [photo, setPhoto] = useState(null);
	const [full_name, setFullName] = useState(props.user.full_name);
	const [phone, setPhone] = useState(props.user.phone);
	const [email, setEmail] = useState(props.user.email);
  
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

	const onSave = async () => {
		validateUserData({ full_name, email, phone, password: '', pass2: '' }, false)
			.then(async () => {
				try {
					ShowLoading(true);
					let photoUrl = ''
					if (photo != null) {
						photoUrl = await uploadPhoto(`users/photo/${new Date().getTime()}.jpg`, photo.path);
					}  
					let newUserData = {
						...props.user,
						full_name,
						email,
						phone,
						photo: photoUrl
					}
					const updated_user = await props.updateProfileDetails(newUserData);

					console.log('updated_user', updated_user);
					await updateChannelUserInfo(updated_user);

					ShowLoading(false);
					alerts.info('', '您的個人資料已成功更新').then((res) => {
						props.navigation.goBack();
					});
				} catch (error) {
					ShowLoading(false);
					console.log('on Save', error);
					alerts.error('警告', '出了些問題');
				}
			})
	};
 
	return (
		<View style={styles.container}> 
			<Header1
				onLeft={() => {
					props.navigation.goBack();
				}}  
				style={{paddingHorizontal: 20, height: 90}}
				title={'更改帳戶資料'}
			/>
			<View style={styles.formView}>
				<KeyboardAwareScrollView style={[{ flex: 1, width: '100%', paddingHorizontal: 20 }]} extraScrollHeight={25} keyboardShouldPersistTaps='handled'>
					<View style={Theme.styles.col_center}>
						<View style={[Theme.styles.col_center, { width: 116, height: 116 }]}>
							<View style={[Theme.styles.col_center, styles.photoView]}>
								<FastImage
									source={
										photo
											? { uri: photo.path }
											: isEmpty(props.user.photo) || props.user.photo == 'x'
												? require('../../../common/assets/images/user-default.png')
												: { uri: getImageFullURL(props.user.photo) }
									}
									style={styles.avatarImg}
									resizeMode={FastImage.resizeMode.cover}
								/>
							</View>
							<TouchableOpacity
								onPress={() => setShowPickerModal(true)}
								style={[Theme.styles.col_center, styles.photoEdit]}
							>
								<AntDesign name='edit' size={14} color={Theme.colors.white} />
							</TouchableOpacity>
						</View>
					</View>

					<AuthInput
						placeholder={'名稱'}
						underlineColorAndroid={'transparent'}
						keyboardType={'default'}
						placeholderTextColor={'#DFDFDF'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(full_name) => setFullName(full_name)}
						// onSubmitEditing={() => this.onEmailDone()}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={full_name}
						secure={false}
						style={{ marginTop: 25, marginBottom: 12 }}
					/>
					<AuthInput
						placeholder={'電話'}
						underlineColorAndroid={'transparent'}
						keyboardType={'phone-pad'}
						placeholderTextColor={'#DFDFDF'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(phone) => setPhone(phone)}
						// onSubmitEditing={() => this.onEmailDone()}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={phone}
						secure={false}
						style={{ marginBottom: 12 }}
					/>
					<AuthInput
						placeholder={'電郵'}
						underlineColorAndroid={'transparent'}
						keyboardType={'email-address'}
						placeholderTextColor={'#DFDFDF'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(email) => setEmail(email)}
						// onSubmitEditing={() => this.onEmailDone()}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={email}
						secure={false}
						style={{ marginBottom: 12 }}
					/> 
					<View style={{ height: 20 }}></View>
					<MainBtn
                            disabled={isLoading}
                            loading={isLoading}
                            title={'確認'}
                            onPress={onSave}
                        />
				</KeyboardAwareScrollView>
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
	header: {
		width: '100%',
		height: 78,
		elevation: 6,
		paddingBottom: 8,
		marginBottom: 24,
		alignItems: 'flex-end',
		flexDirection: 'row',
	},
	formView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
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
		borderColor: Theme.colors.gray9,
		borderRadius: 15,
		backgroundColor: '#E8D7D0',
	},
	avatarImg: { width: 100, height: 100, borderRadius: 6 },
	photoEdit: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: Theme.colors.cyan2,
		position: 'absolute',
		top: 0,
		right: 0,
	},
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
})(ProfileEditScreen);
