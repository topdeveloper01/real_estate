import React, { useEffect, useState } from 'react';
import { Switch, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LoginManager } from 'react-native-fbsdk';
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
import { ScrollView } from 'react-native-gesture-handler';
import ConfirmModal from '../../../common/components/modals/ConfirmModal';
// svgs
import Svg_add from '../../../common/assets/svgs/btn-add.svg';

const ProfileScreen = (props) => {
	const [isLogoutModal, ShowLogoutModal] = useState(false);

	const about_links = [
		{ name: '私隱政策', link: RouteNames.PrivacyPolicyScreen },
		{ name: '條款及細則', link: RouteNames.TermsScreen },
	]

	const op_btns = [
		{ name: 'For Matched Properties' },
		{ name: 'For New Launched Properties' },
		{ name: 'For Property News' },
	]

	const app_links = [
		{ name: '支援', link: RouteNames.SupportScreen },
		{ name: '報告錯誤', link: RouteNames.BugReportScreen },
		{ name: '版本', link: RouteNames.AppVersionScreen },
	]


	const onLogout = async () => {
		ShowLogoutModal(false);
		try {
			LoginManager.logOut();
		} catch (e) {
			console.log('LoginManager.logOut', e)
		}
		try {
			await auth().signOut();
		} catch (e) {
			console.log('logout', e)
		}

		if (props.hometab_navigation != null) {
			props.hometab_navigation.jumpTo(RouteNames.HomeStack)
		}
		props.rootStackNav.navigate(RouteNames.WelcomeScreen);
	};

	const toggleSwitch = (name, value) => {

	}

	return (
		<View style={[Theme.styles.col_center_start, { flex: 1, backgroundColor: Theme.colors.white }]}>
			<Header1 title='帳戶設定' left={<View />} />
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
					<Text style={styles.subjectTitle}>關於我們</Text>
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
					<Text style={styles.subjectTitle}>帳戶操作</Text>
					{
						op_btns.map(item =>
							<View
								key={item.name}
								style={[Theme.styles.row_center, styles.itemView]}
							>
								<Text style={[styles.itemTxt, Theme.styles.flex_1]}>{item.name}</Text>
								<Switch
									trackColor={{ false: Theme.colors.gray4, true: Theme.colors.gray4 }}
									thumbColor={true ? "#FCD724" : "#f4f3f4"}
									ios_backgroundColor="#3e3e3e"
									onValueChange={(value) => {
										toggleSwitch(item.name, value)
									}}
									value={true}
								/>
							</View>
						)
					}
					<Text style={styles.subjectTitle}>APP</Text>
					{
						app_links.map(item =>
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

					<TouchableOpacity
						style={[Theme.styles.row_center_start, { marginTop: 32, marginBottom: 60 }]}
						onPress={() => { ShowLogoutModal(true) }}
					>
						<MaterialCommunityIcons name={'logout-variant'} size={18} color={Theme.colors.red} />
						<Text style={[styles.itemTxt, { color: Theme.colors.red }]}>登出</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
			<TouchableOpacity style={styles.addlistingBtn} onPress={() => {
				props.rootStackNav.navigate(RouteNames.AddListingScreen);
			}}>
				<Svg_add />
			</TouchableOpacity>
			<ConfirmModal
				showModal={isLogoutModal}
				title={'確認登出？'}
				yes={'登出'}
				no={'取消'}
				onYes={onLogout}
				onClose={() => ShowLogoutModal(false)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	scrollview: { width: '100%', paddingHorizontal: 24, },
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
	logout
})(ProfileScreen);
