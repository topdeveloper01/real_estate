import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import alerts from '../../../common/services/alerts';
import { translate } from '../../../common/services/translate';
import { extractErrorMessage } from '../../../common/services/utility';
import { loadUserSetting } from '../../../common/services/user';
import Theme from '../../../theme';
import Header1 from '../../../common/components/Header1';
import AppText from '../../../common/components/AppText';
import { AuthInput } from '../../../common/components';
import MainBtn from '../../../common/components/buttons/main_button';
import TransBtn from '../../../common/components/buttons/trans_button';
import SocialBtn from '../../../common/components/buttons/round_icon_button';
import IconButton from '../../../common/components/buttons/icon_button';
import RouteNames from '../../../routes/names';
import Config from '../../../config';
import {
	setAsLoggedIn,
	facebookLogin,
	googleLogin,
	getLoggedInUser,
	appleLogin,
	setUserNeedLogin,
	updateProfileDetails,
} from '../../../store/actions/auth'; 
import BlockSpinner from '../../../common/components/BlockSpinner';
import PhoneVerificationScreen from './PhoneVerificationScreen';
import Svg_facebook from '../../../common/assets/svgs/auth/facebook.svg'
import Svg_google from '../../../common/assets/svgs/auth/google.svg'

const WelcomeScreen = (props) => {
	const backRoute = props.route.params != null ? props.route.params.backRoute : null;

	const [confirm, setConfirm] = useState(null);
	const [code, setCode] = useState('');

	const [loading, setLoading] = useState(false);
	const [phone, setPhone] = useState('');

	useEffect(() => {
		GoogleSignin.configure({
			webClientId: '82651546395-4r336st98l1570pb45idtp498fmnklcp.apps.googleusercontent.com',
		});
	}, []);

	const handleFbLogin = async (accessToken) => {
		setLoading(true);
		props.facebookLogin(accessToken.toString()).then(
			async (logged_user_data) => {
				setLoading(false);
				await loadUserSetting(props, logged_user_data);
				if (backRoute) {
					props.navigation.goBack();
				}
			},
			(error) => {
				console.log('handleFbLogin', error);
				setLoading(false);
				alerts.error(translate('attention'), extractErrorMessage(error));
			}
		);
	};


	const handleGoogleLogin = async (id_token) => {
		setLoading(true);
		props.googleLogin(id_token).then(
			async (logged_user_data) => {
				console.log('props.googleLogin');
				setLoading(false);
				await loadUserSetting(props, logged_user_data);
				if (backRoute) {
					props.navigation.goBack();
				}
			},
			(error) => {
				console.log('handleGoogleLogin', error);
				setLoading(false);
				alerts.error(translate('attention'), extractErrorMessage(error));
			}
		);
	};

	const handlePhoneLogin = async (uid) => {
		setLoading(true);
		props.googleLogin(uid).then(
			async (logged_user_data) => {
				console.log('props.googleLogin');
				setLoading(false);
				await loadUserSetting(props, logged_user_data);
				if (backRoute) {
					props.navigation.goBack();
				}
			},
			(error) => {
				console.log('handlePhoneLogin', error);
				setLoading(false);
				alerts.error(translate('attention'), extractErrorMessage(error));
			}
		);
	};

	const onFbLogin = () => {
		return;
		if (Config.isAndroid) {
			LoginManager.setLoginBehavior('web_only');
		}
		LoginManager.logInWithPermissions(['public_profile', 'email'])
			.then((result) => {
				if (result.isCancelled) {
					alerts.error(translate('attention'), translate('accept_access'));
				} else {
					AccessToken.getCurrentAccessToken().then(({ accessToken }) => {
						handleFbLogin(accessToken);
					});
				}
			})
			.catch(() => {
				alerts.error(translate('attention'), translate('accept_access'));
			});
	};


	const onGoogleSignin = async () => {
		return
		// Get the users ID token
		const { idToken } = await GoogleSignin.signIn();
		console.log('onGoogleSignin idToken', idToken);

		handleGoogleLogin(idToken);
	};

	const onSignin = async () => {
		try {
			if (phone.length == 0) return;
			setLoading(true);
			const confirmation = await auth().signInWithPhoneNumber('+852' + phone);
			setLoading(false);
			setConfirm(confirmation);
		}
		catch (error) {
			setLoading(false);
			console.log('onsignin,', error)
		}
	};

	const _renderSocialBtns = () => {
		return null;
		if (loading) {
			return (
				<View style={styles.loadingWrapper}>
					<BlockSpinner style={{ minHeight: 80 }} />
				</View>
			);
		} else {
			return (
				<View style={[Theme.styles.col_center, styles.socials]}>
					<IconButton
						icon={<Svg_facebook width={28} height={28}/>}
						text={'Log in with Facebook'}
						textStyle={{ color: Theme.colors.white }}
						style={{ backgroundColor: '#3B5998', marginTop: 10 }}
						onPress={onFbLogin}
					/>
					<IconButton
						icon={<Svg_google  width={24} height={24}/>}
						text={' Log in with Google '}
						onPress={onGoogleSignin}
						style={{ marginTop: 10, backgroundColor: Theme.colors.white, elevation: 2 }}
					/>
				</View>
			);
		}
	};

	const onLoadUserData = async (uid) => { 
		let logged_user_data = await props.getLoggedInUser(uid);
 
		if (logged_user_data != null) { 
			props.setAsLoggedIn();
		} 
	}

	if (confirm != null) {
		return <PhoneVerificationScreen
			isSignin={true}
			user={{
				phone: phone
			}}
			FbConfirm={confirm}
			goBack={() => {
				setConfirm(null)
			}}
			onSuccess={onLoadUserData}
		/>
	}

	return (
		<KeyboardAwareScrollView style={[{ width: '100%', backgroundColor: '#fff' }]} keyboardShouldPersistTaps='handled'>
			<Spinner visible={loading} />
			<View style={[Theme.styles.col_center, Theme.styles.background, { backgroundColor: '#ffffff', paddingTop: 60 }]}>
				<View style={[Theme.styles.col_center, { width: '100%', alignItems: 'flex-start' }]}>
					<Text style={styles.title}>歡迎光臨</Text>
					<Text style={styles.sub_title}>帳戶登入</Text>
				</View>
				<View style={[{ width: '100%', marginTop: 120, justifyContent: 'space-between', }]}>
					<AuthInput
						placeholder={'輸入電話號碼'}
						underlineColorAndroid={'transparent'}
						keyboardType={'phone-pad'}
						onChangeText={phone => setPhone(phone)}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={phone}
						secure={false}
						fontSize={14}
						textAlign='center'
						selectionColor={Theme.colors.cyan2}
						placeholderTextColor={Theme.colors.text}
						backgroundColor={Theme.colors.gray4}
						style={{ marginBottom: 20, backgroundColor: Theme.colors.gray4 }}
					/>
				</View>
				<MainBtn
					title={'下一步'}
					onPress={onSignin}
					style={{ width: '100%', backgroundColor: Theme.colors.yellow1 }}
				/>
				<Text style={styles.notiTxt}>系統將會發出驗證碼到閣下的電話號碼</Text>
				<TransBtn
					style={{ marginTop: 10, marginBottom: 20 }}
					title={'建立新帳戶'}
					onPress={() => {
						props.navigation.navigate(RouteNames.RegisterScreen);
					}}
				/>
				{_renderSocialBtns()}
			</View>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	title: { fontSize: 32, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	sub_title: { fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
	notiTxt: { marginTop: 12, fontSize: 15, color: Theme.colors.text, },
	divider: { width: '100%' },
	divider_line: { flex: 1, height: 1, backgroundColor: '#E9E9F7' },
	ortxt: { fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text, marginLeft: 5, marginRight: 5 },
	loadingWrapper: {
		marginTop: 30,
		marginBottom: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	socials: {
		marginTop: 30,
		marginBottom: 40,
		width: '100%',
	},
});

function mapStateToProps({ app }) {
	return {
		user: app.user,
		hasVerifiedPhone: app.hasVerifiedPhone,
	};
}

export default connect(mapStateToProps, {
	facebookLogin,
	googleLogin, 

	setAsLoggedIn,
	setUserNeedLogin,
	getLoggedInUser, 
	updateProfileDetails, 
})(WelcomeScreen);
