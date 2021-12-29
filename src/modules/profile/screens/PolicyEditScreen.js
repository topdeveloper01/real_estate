import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';  
import {height} from 'react-native-dimension'
import Spinner from 'react-native-loading-spinner-overlay';
import Theme from '../../../theme'; 
import Header1 from '../../../common/components/Header1'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
import { getTermsPolicyData, savePolicyData } from '../../../store/actions/app';
import { MainBtn } from '../../../common/components';
import { AuthInput } from '../../../common/components';

const PolicyEditScreen = (props) => {

	const [isLoading, setLoading] = useState(false)
	const [policy, setPolicy] = useState('')
	useEffect(() => { 
		setLoading(true)
		getTermsPolicyData().then(data => {
			if (data != null) {
				setLoading(false)
				setPolicy(data.policy)
			}
		})
		.catch(error => {
			setLoading(false)
			alerts.error('注意', '出問題了');
		})
	}, []);


	const onSave=()=>{
		setLoading(true)
		savePolicyData(policy).then(data => {
			setLoading(false);
			props.navigation.goBack();
		})
		.catch(error => {
			setLoading(false)
			alerts.error('注意', '出問題了');
		})
	}

	return (
		<View style={styles.container}>
			<Spinner visible={isLoading}/>
			<Header1
				onLeft={() => {
					props.navigation.goBack();
				}}
				style={{ paddingHorizontal: 20, height: 90 }}
				title={'私隱政策'}
			/>
			<View style={styles.formView}>
				<KeyboardAwareScrollView style={[{ flex: 1, width: '100%', paddingVertical: 12, paddingHorizontal: 20 }]} extraScrollHeight={25} keyboardShouldPersistTaps='handled'>
					<AuthInput
						placeholder={''}
						underlineColorAndroid={'transparent'}
						keyboardType={'default'}
						selectionColor={Theme.colors.cyan2}
						onChangeText={(text) => setPolicy(text)}
						returnKeyType={'next'}
						autoCapitalize={'none'}
						value={policy}
						secure={false}
						textAlignVertical={'top'}
						numberOfLines={28}
						multiline={true}
						style={{ minHeight: 100 }}
					/>
				</KeyboardAwareScrollView>
				<View style={{ width: '100%' }}>
					<MainBtn 
						style={{ borderRadius: 0, height: 70 }}
						title={'確認'}
						onPress={onSave}
					/>
				</View>
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
})(PolicyEditScreen);
