import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux'; 
import { updateProfileDetails } from '../../../store/actions/auth';  
import Theme from '../../../theme'; 
import Header1 from '../../../common/components/Header1'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
import { getTermsPolicyData } from '../../../store/actions/app';

const PolicyScreen = (props) => {

	const [policy, setPolicy] = useState('')
	useEffect(() => { 
		getTermsPolicyData().then(data => {
			if (data != null) {
				setPolicy(data.policy)
			}
		})
		.catch(error => {
			alerts.error('注意', '出問題了');
		})
	}, []);

	return (
		<View style={styles.container}>
			<Header1
				onLeft={() => {
					props.navigation.goBack();
				}}
				style={{ paddingHorizontal: 20, height: 90 }}
				title={'私隱政策 Policy'}
			/>
			<View style={styles.formView}>
				<KeyboardAwareScrollView style={[{ flex: 1, width: '100%', paddingHorizontal: 20 }]} extraScrollHeight={25} keyboardShouldPersistTaps='handled'>
					<Text>
						 {policy}
					</Text>
				</KeyboardAwareScrollView>
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
	home_orders_filter: app.home_orders_filter,
});

export default connect(mapStateToProps, {
	updateProfileDetails,
})(PolicyScreen);
