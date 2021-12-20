import React, { useEffect, useState } from 'react';
import { Switch, ScrollView, TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LoginManager } from 'react-native-fbsdk';
import { updateProfileDetails } from '../../../store/actions/auth';
import { logout, } from '../../../store/actions/auth';
import auth from '@react-native-firebase/auth';
import Config from '../../../config';
import alerts from '../../../common/services/alerts';
import { openExternalUrl } from '../../../common/services/utility';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import RouteNames from '../../../routes/names';
import ProfileAvatarView from '../components/ProfileAvatarView';
import ProfileInfoItem from '../components/ProfileInfoItem';
import Header1 from '../../../common/components/Header1';
import ConfirmModal from '../../../common/components/modals/ConfirmModal';
// svgs
import Svg_add from '../../../common/assets/svgs/btn-add.svg';

const ProfileScreen = (props) => {
	const [isLoading, setLoading] = useState(false);
	const [isActiveSwitch, setActiveSwitch] = useState(false);
	const [isLogoutModal, ShowLogoutModal] = useState(false);

	const about_links = [
		{ name: '私隱政策 Policy', link: RouteNames.PrivacyPolicyScreen },
		{ name: '條款及細則 Terms and conditions', link: RouteNames.TermsScreen },
	]

	useEffect(() => {
		setActiveSwitch(props.user.enable_notification == true)
	}, [props.user.enable_notification])

	const onLogout = async () => {
		ShowLogoutModal(false);
		// try {
		// 	LoginManager.logOut();
		// } catch (e) {
		// 	console.log('LoginManager.logOut', e)
		// }
		try {
			await auth().signOut();
			await props.logout();
		} catch (e) {
			console.log('logout', e)
		}
	};

	const toggleSwitch = async (value) => {
		let platform = "iOS";
		if (Platform.OS === 'android') {
			platform = "Android"
		}

		try {
			setLoading(true);
			let newUserData = {
				...props.user,
				enable_notification: value,
				platform: platform
			}
			const updated_user = await props.updateProfileDetails(newUserData);

			console.log('updated_user', updated_user);
			setLoading(false);
		}
		catch (error) {
			setLoading(false);
			console.log('on toggleSwitch', error);
			alerts.error('警告', '出了些問題');
		}
	}

	return (
		<View style={[Theme.styles.col_center_start, { flex: 1, backgroundColor: Theme.colors.white }]}>
			<Spinner visible={isLoading} />
			<Header1 title='帳戶 Account' style={{ height: 90, marginBottom: 0 }} left={<View />} />
			<ScrollView style={[Theme.styles.flex_1, styles.scrollview]}>
				<View style={Theme.styles.flex_1}>
					<ProfileAvatarView
						photo={props.user.photo}
						full_name={props.user.full_name}
						birthdate={props.user.birthdate}
						city={props.address.city}
						country={props.address.country}
						onEdit={() => {
							props.rootStackNav.navigate(RouteNames.ProfileEditScreen);
						}}
					/>
					<Text style={styles.subjectTitle}>關於我們 About Us</Text>
					{
						about_links.map(item =>
							<TouchableOpacity
								key={item.name}
								delayPressIn={100}
								style={[Theme.styles.row_center, styles.itemView]}
								onPress={() => {
									props.rootStackNav.navigate(item.link);
								}}
							>
								<Text style={[styles.itemTxt, Theme.styles.flex_1]}>{item.name}</Text>
								<Feather name={'chevron-right'} size={18} color={Theme.colors.text} />
							</TouchableOpacity>
						)
					}
					<Text style={styles.subjectTitle}>帳戶操作 Account Setting</Text>
					<View
						style={[Theme.styles.row_center, styles.itemView]}
					>
						<Text style={[styles.itemTxt, Theme.styles.flex_1]}>允許推送通知系統 Push notification</Text>
						<TouchableOpacity
							onPress={()=>{
								toggleSwitch(props.user.enable_notification == true ? false : true)
							}}
						>
							<Switch
								trackColor={{ false: Theme.colors.gray4, true: Theme.colors.gray4 }}
								thumbColor={true ? "#FCD724" : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e" 
								disabled={true}
								value={props.user.enable_notification == true}
							/>
						</TouchableOpacity>
					</View>
					{
						props.user.admin == true &&
						<React.Fragment>
							<Text style={styles.subjectTitle}>APP</Text>
							<TouchableOpacity
								delayPressIn={100}
								style={[Theme.styles.row_center, styles.itemView]}
								onPress={() => {
									props.rootStackNav.navigate(RouteNames.MyListingsScreen);
								}}
							>
								<Text style={[styles.itemTxt, Theme.styles.flex_1]}>已上傳單位記錄</Text>
								<Feather name={'chevron-right'} size={18} color={Theme.colors.text} />
							</TouchableOpacity>
							<TouchableOpacity
								delayPressIn={100}
								style={[Theme.styles.row_center, styles.itemView]}
								onPress={() => {
									props.rootStackNav.navigate(RouteNames.City1Screen);
								}}
							>
								<Text style={[styles.itemTxt, Theme.styles.flex_1]}>地區</Text>
								<Feather name={'chevron-right'} size={18} color={Theme.colors.text} />
							</TouchableOpacity>
							<TouchableOpacity
								delayPressIn={100}
								style={[Theme.styles.row_center, styles.itemView]}
								onPress={() => {
									props.rootStackNav.navigate(RouteNames.SendNotification);
								}}
							>
								<Text style={[styles.itemTxt, Theme.styles.flex_1]}>推送通知系統</Text>
								<Feather name={'chevron-right'} size={18} color={Theme.colors.text} />
							</TouchableOpacity>
						</React.Fragment>
					}

					<TouchableOpacity
						style={[Theme.styles.row_center_start, { marginTop: 32, marginBottom: 60 }]}
						onPress={() => { ShowLogoutModal(true) }}
					>
						<MaterialCommunityIcons name={'logout-variant'} size={18} color={Theme.colors.red} />
						<Text style={[styles.itemTxt, { color: Theme.colors.red, marginLeft: 6 }]}>登出</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
			{
				props.user.admin == true &&
				<TouchableOpacity style={styles.addlistingBtn} onPress={() => {
					props.rootStackNav.navigate(RouteNames.AddListingScreen);
				}}>
					<Svg_add />
				</TouchableOpacity>
			}

			<ConfirmModal
				showModal={isLogoutModal}
				title={'確認登出 Confirm to logout ？'}
				yes={'登出 Logout'}
				no={'取消 Cancel'}
				onYes={onLogout}
				onClose={() => ShowLogoutModal(false)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	scrollview: { width: '100%', paddingHorizontal: 24, paddingTop: 20 },
	subjectTitle: { marginTop: 32, marginBottom: 18, fontSize: 12, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
	name: { marginRight: 4, paddingBottom: 4, fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	listContainer: { flex: 1, width: '100%', marginTop: 48, paddingHorizontal: 20, backgroundColor: Theme.colors.white },
	itemView: { paddingVertical: 14, borderBottomColor: Theme.colors.gray4, borderBottomWidth: 1 },
	itemTxt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
	spaceCol: {
		height: 17
	},
	addlistingBtn: { position: 'absolute', right: 20, bottom: 20 }
})

const mapStateToProps = ({ app }) => ({
	user: app.user,
	address: app.address || {},
	hometab_navigation: app.hometab_navigation,
});

export default connect(mapStateToProps, {
	logout, updateProfileDetails
})(ProfileScreen);
