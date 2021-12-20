import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import Theme from '../../../theme';
import Header1 from '../../../common/components/Header1';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NoNoties from '../../../common/components/empty/NoNoties';
import { getAllPushes } from '../../../store/actions/app';
import NotificationItem from '../../../common/components/NotificationItem';

const NotificationsScreen = (props) => {

	const [isLoading, setLoading] = useState(null)
	const [notis, setNotis] = useState([])
	useEffect(() => {
		loadNotifications()
	}, []);


	const loadNotifications = async () => {
		try {
			setLoading(true);
			let all_noties = await getAllPushes();
			setNotis(all_noties)
			setLoading(false);
		}
		catch (error) {
			setLoading(false);
			console.log('get Notifications ', error)
			alerts.error('警告', '出了些問題');
		}
	}

	return (
		<View style={styles.container}>
			<Spinner visible={isLoading == true} />
			<Header1
				onLeft={() => {
					props.navigation.goBack();
				}}
				style={{ paddingHorizontal: 20, height: 90 }}
				title={'通知 Notification'}
			/>
			<View style={styles.formView}>
				{
					isLoading == false && notis.length == 0 ? <NoNoties />
						:
						<KeyboardAwareScrollView style={[{ flex: 1, width: '100%', paddingHorizontal: 10 }]} extraScrollHeight={25} keyboardShouldPersistTaps='handled'>
							<View style={[Theme.styles.col_center_start, { width: '100%', paddingHorizontal: 8, alignItems: 'flex-start', }]}>
								{
									notis.map((item) =>
										<NotificationItem
											key={item.id}
											title={item.title}  
											message={item.message}  
										/>
									)
								}
							</View>
						</KeyboardAwareScrollView>
				}
			</View>
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
});

const mapStateToProps = ({ app }) => ({
	user: app.user,
});

export default connect(mapStateToProps, {
})(NotificationsScreen);
