import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { LoginManager } from 'react-native-fbsdk';
import { logout, } from '../../../store/actions/auth';
import Config from '../../../config';
import alerts from '../../../common/services/alerts';
import { openExternalUrl } from '../../../common/services/utility';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import RouteNames from '../../../routes/names';
import ProfileAvatarView from '../components/ProfileAvatarView';
import ProfileInfoItem from '../components/ProfileInfoItem';

const ProfileScreen = (props) => {

	const btns = [
		{ name: 'wallet', link: RouteNames.WalletScreen },
		// {name : 'invite_reward', link : RouteNames.InviteScreen},
		{ name: 'addresses', link: RouteNames.AddressesScreen },
		{ name: 'payment_method', link: RouteNames.PaymentMethodsScreen },
		{ name: 'promotions_menu', link: RouteNames.PromotionsScreen },
		{ name: 'preferred', link: RouteNames.FavouritesScreen },
		{ name: 'blog_menu', link: RouteNames.BlogScreen },
		{ name: 'settings', link: RouteNames.SettingScreen },
		{ name: 'rate_app', },
		{ name: 'become_a_partner', },
		{ name: 'about', },
		{ name: 'logout', },
	]

	const handleReview = () => {
		Config.isAndroid
			? openExternalUrl(`https://play.google.com/store/apps/details?id=com.snapfood.app&hl=en`)
			: openExternalUrl(`https://itunes.apple.com/al/app/snapfood-food%20delivery/id1314003561?l=en&mt=8`);
	};

	const openMerchantRegister = () => {
		openExternalUrl('https://snapfood.al/merchant/');
	};

	const openAboutUs = () => {
		openExternalUrl('https://snapfood.al/about');
	};

	const dologout = () => {
		alerts
			.confirmation(translate('alerts.confirm_logout_title'), translate('alerts.confirm_logout'))
			.then(async () => {
				try {
					LoginManager.logOut();
				} catch (e) {
					console.log('LoginManager.logOut', e)
				}
				try {
					await props.logout();
				} catch (e) {
					console.log('logout', e)
				}

				if (props.hometab_navigation != null) {
					props.hometab_navigation.jumpTo(RouteNames.HomeStack)
				}
				props.rootStackNav.navigate(RouteNames.WelcomeScreen, { backRoute: RouteNames.BottomTabs });
			});
	};

	return (
		<View style={[Theme.styles.col_center_start, { flex: 1, backgroundColor: Theme.colors.white }]}>
			<FlatList
				keyboardShouldPersistTaps='always'
				style={styles.listContainer}
				data={btns}
				numColumns={1}
				keyExtractor={item => item.name}
				renderItem={({ item }, index) => (
					<TouchableOpacity
						delayPressIn={100}
						style={[Theme.styles.row_center, styles.itemView ]}
						onPress={() => {
							if (item.name == 'rate_app') {
								handleReview()
							}
							else if (item.name == 'become_a_partner') {
								openMerchantRegister()
							}
							else if (item.name == 'about') {
								openAboutUs()
							}
							else if (item.name == 'logout') {
								dologout()
							}
							else {
								props.rootStackNav.navigate(item.link);
							}
						}}
					>
						<Text style={[styles.itemTxt, Theme.styles.flex_1]}>{translate('account.' + item.name)}</Text>
					</TouchableOpacity>
				)}
				ListHeaderComponent={() => (
					<React.Fragment>
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
						<ProfileInfoItem email={props.user.email} phone={props.user.phone} />
					</React.Fragment>
				)}
				ItemSeparatorComponent={() => <View style={styles.spaceCol} />}
				ListFooterComponent={() => <View style={{ height: 30 }} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	name: { marginRight: 4, paddingBottom: 4, fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	listContainer: { flex: 1, width: '100%', marginTop: 48, paddingHorizontal: 20, backgroundColor: Theme.colors.white },
	itemView: { padding: 20, backgroundColor: Theme.colors.gray8, borderRadius: 15, },
	itemTxt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
	spaceCol: {
		height: 17
	},
})

const mapStateToProps = ({ app }) => ({
	user: app.user,
	address: app.address || {},
	hometab_navigation: app.hometab_navigation,
});

export default connect(mapStateToProps, {
	logout
})(ProfileScreen);
