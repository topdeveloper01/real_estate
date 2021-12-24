import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';  
import Theme from '../../../theme'; 
import Header1 from '../../../common/components/Header1'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
import { getTermsPolicyData } from '../../../store/actions/app';

const TermsScreen = (props) => {

	const [terms, setTerms] = useState('')
	useEffect(() => { 
		getTermsPolicyData().then(data => {
			if (data != null) {
				setTerms(data.term)
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
				style={{ paddingHorizontal: 20, height : 90 }}
				title={'條款及細則 T&C'}
			/>
			<View style={styles.formView}>
				<KeyboardAwareScrollView style={[{ flex: 1, width: '100%', paddingHorizontal: 20 }]} extraScrollHeight={25} keyboardShouldPersistTaps='handled'>
					<Text>
						 {terms}
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
});

export default connect(mapStateToProps, { 
})(TermsScreen);
