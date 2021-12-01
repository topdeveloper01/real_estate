import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Switch } from 'react-native';
import { connect } from 'react-redux';
import { setAppLang, setTmpPassChanged } from '../../../store/actions/app';
import { translate } from '../../../common/services/translate';
import { updateProfileDetails } from '../../../store/actions/auth';
import Theme from '../../../theme';
import RadioBtn from '../../../common/components/buttons/radiobtn';
import Header1 from '../../../common/components/Header1';
import RouteNames from '../../../routes/names';

const SettingScreen = (props) => {
	useEffect(() => {
		props.setTmpPassChanged(false);
	}, []);

	const changeAppLang = async (lang) => {
		await props.setAppLang(lang);
	};

	const goChangePass = () => {
		props.navigation.navigate(RouteNames.ChangePasswordScreen);
	};

	const onUpdateNoti = (data) => {
		props
			.updateProfileDetails(data)
			.then((res) => {})
			.catch((err) => {
				console.log('updateProfileDetails', err);
			});
	};

	const _renderLanguageSetting = () => {
		return (
			<View style={[Theme.styles.col_center_start, styles.language]}>
				<View style={[Theme.styles.row_center, { width: '100%', marginBottom: 16 }]}>
					<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>{translate('account.lang_label')}</Text>
				</View>
				<TouchableOpacity
					onPress={() => changeAppLang('sq')}
					style={[Theme.styles.row_center, { width: '100%', paddingBottom: 16 }]}
				>
					<Text style={[styles.langtxt]}>{translate('account.albanian')}</Text>
					<View style={{ flex: 1 }} />
					<RadioBtn onPress={() => changeAppLang('sq')} checked={props.language == 'sq'} />
				</TouchableOpacity>
				<View style={styles.divider} />
				<TouchableOpacity
					onPress={() => changeAppLang('en')}
					style={[Theme.styles.row_center, { width: '100%', paddingTop: 16 }]}
				>
					<Text style={[styles.langtxt]}>{translate('account.english')}</Text>
					<View style={{ flex: 1 }} />
					<RadioBtn onPress={() => changeAppLang('en')} checked={props.language == 'en'} />
				</TouchableOpacity>
			</View>
		);
	};

	const NotiSetting = ({ item, value, onChange }) => {
		return (
			<View style={[Theme.styles.row_center, { width: '100%', paddingTop: 20 }]}>
				<Text style={[Theme.styles.flex_1, styles.subjectTitle]}>{item}</Text>
				<Switch
					style={Platform.OS == 'ios' && { transform: [{ scaleX: 0.7 }, { scaleY: 0.65 }] }}
					trackColor={{ false: Theme.colors.gray5, true: '#C0EBEC' }}
					thumbColor={value ? Theme.colors.cyan2 : Theme.colors.gray7}
					ios_backgroundColor='#C0EBEC'
					onValueChange={onChange}
					value={value}
				/>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Header1
				style={{ marginBottom: 0, paddingHorizontal: 20 }}
				onLeft={() => {
					props.navigation.goBack();
				}}
				title={translate('settings')}
			/>
			<View style={styles.formView}>
				<ScrollView style={{ flex: 1, width: '100%', paddingHorizontal: 20 }}>
					<View style={[Theme.styles.col_center, styles.sectionView]}>
						<NotiSetting
							item={translate('account.push_noti')}
							value={props.user.push_notis == 1}
							onChange={() => onUpdateNoti({ push_notis: props.user.push_notis == 1 ? 0 : 1 })}
						/>
						<NotiSetting
							item={translate('account.promo_noti')}
							value={props.user.promo_notis == 1}
							onChange={() => onUpdateNoti({ promo_notis: props.user.promo_notis == 1 ? 0 : 1 })}
						/>
						<NotiSetting
							item={translate('account.email_noti')}
							value={props.user.email_notis == 1}
							onChange={() => onUpdateNoti({ email_notis: props.user.email_notis == 1 ? 0 : 1 })}
						/>
					</View>
					<View style={[Theme.styles.col_center, styles.sectionView, { marginTop: 16 }]}>
						{_renderLanguageSetting()}
					</View>
					<TouchableOpacity
						onPress={goChangePass}
						style={[Theme.styles.row_center, styles.itemView, { marginTop: 16 }]}
					>
						<Text style={[styles.itemTxt, Theme.styles.flex_1]}>
							{translate('account_change_pass.header_title')}
						</Text>
					</TouchableOpacity>
					{props.pass_changed && (
						<Text style={styles.notitxt}>{translate('account_change_pass.success')}</Text>
					)}
				</ScrollView>
			</View>
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
	subjectTitle: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
	divider: { width: '100%', height: 1, backgroundColor: Theme.colors.gray6 },
	sectionView: {
		width: '100%',
		alignItems: 'flex-start',
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: Theme.colors.gray9,
	},
	langtxt: { fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
	language: { width: '100%', padding: 20, backgroundColor: Theme.colors.gray8, borderRadius: 15 },
	itemView: { padding: 20, backgroundColor: Theme.colors.gray8, borderRadius: 15 },
	itemTxt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
	notitxt: {
		marginTop: 25,
		width: '100%',
		textAlign: 'center',
		fontSize: 12,
		fontFamily: Theme.fonts.semiBold,
		color: Theme.colors.red1,
	},
});

const mapStateToProps = ({ app }) => ({
	user: app.user,
	language: app.language,
	pass_changed: app.pass_changed,
});

export default connect(mapStateToProps, {
	setAppLang,
	updateProfileDetails,
	setTmpPassChanged,
})(SettingScreen);
