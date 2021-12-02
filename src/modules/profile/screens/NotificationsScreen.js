import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { updateProfileDetails } from '../../../store/actions/auth';
import Theme from '../../../theme';
import Header1 from '../../../common/components/Header1';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NoNoties from '../../../common/components/empty/NoNoties';

const NotificationsScreen = (props) => {

	const [notis, setNotis] = useState([])
	useEffect(() => { }, []);

	return (
		<View style={styles.container}>
			<Header1
				onLeft={() => {
					props.navigation.goBack();
				}}
				style={{ paddingHorizontal: 20 }}
				title={'通知'}
			/>
			<View style={styles.formView}>
				{
					notis.length == 0 ? <NoNoties />
						:
						<KeyboardAwareScrollView style={[{ flex: 1, width: '100%', paddingHorizontal: 20 }]} extraScrollHeight={25} keyboardShouldPersistTaps='handled'>
							 
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
