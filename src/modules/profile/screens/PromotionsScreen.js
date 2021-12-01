import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import { translate } from '../../../common/services/translate';
import apiFactory from '../../../common/services/apiFactory';
import Theme from '../../../theme';
import SwitchTab from '../../../common/components/SwitchTab';
import Header1 from '../../../common/components/Header1';
import PromotionItem from '../../../common/components/vendors/PromotionItem';
import NoPromotion from '../../../common/components/vendors/NoPromotion';

const PromotionsScreen = (props) => {
	const _isMounted = useRef(true);

	const [opType, setOpType] = useState('Current')
	const [currents, setCurrents] = useState([])
	const [pasts, setPasts] = useState([])

	const [isLoadingCurrents, setLoadingCurrents] = useState(null)
	const [isLoadingPasts, setLoadingPasts] = useState(null)

	useEffect(() => {
		getActivePromotions()
		getPromotions()
		return () => {
			console.log("Promotions screen unmount")
			_isMounted.current = false;
		};
	}, [])

	const getActivePromotions = async () => {
		setLoadingCurrents(true)
		apiFactory.get('/promotions/active').then(({ data }) => {
			if(_isMounted.current == true) {
				setCurrents(data.promotions || [])
				setLoadingCurrents(false)
			}
		})
			.catch(err => {
				if(_isMounted.current == true) {
					setLoadingCurrents(false)
					console.log('err getActivePromotions', err)
				}
			});
	};

	const getPromotions = async () => {
		setLoadingPasts(true)
		apiFactory.get('/promotions/used').then(({ data }) => {
			if(_isMounted.current == true) {
				const promotions = data.data;
				setPasts(promotions || [])
				setLoadingPasts(false)
			}
		})
			.catch(err => {
				if(_isMounted.current == true) {
					setLoadingPasts(false)
					console.log('err getPromotions', err)
				}
			});
	};

	const _renderOperationTabs = () => {
		return <View style={[Theme.styles.row_center, styles.operationTab]}>
			<SwitchTab
				items={['Current', 'Past']}
				curitem={opType}
				style={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}
				onSelect={(item) => setOpType(item)}
			/>
		</View>
	}

	return (
		<View style={[Theme.styles.col_center_start, { flex: 1, backgroundColor: Theme.colors.white }]}>
			<Header1
				style={{ marginTop: 10, paddingHorizontal: 20 }}
				onLeft={() => { props.navigation.goBack() }}
				title={translate('account.promotions_menu')}
			/>
			<View style={{ width: '100%', paddingHorizontal: 20, }}>
				{_renderOperationTabs()}
			</View>
			<ScrollView style={styles.scrollview}>
				<View style={{ height: 20, }} />
				{
					(opType == 'Current' ? currents : pasts).map((item, index) =>
						<PromotionItem key={index} data={item} style={{ width: '100%', marginBottom: 12, }} onSelect={() => { }} />
					)
				}
				<View style={{ height: 40, }} />
				{
					((opType == 'Current' && currents.length == 0 && isLoadingCurrents == false) || (opType != 'Current' && pasts.length == 0 && isLoadingPasts == false)) &&
					<NoPromotion />
				}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	searchView: { width: '100%', paddingHorizontal: 20, marginTop: 48, },
	operationTab: { height: 62, width: '100%', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F6F6F9' },
	subjectTitle: { fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	divider: { width: '100%', height: 1, backgroundColor: '#F6F6F9' },
	scrollview: { flex: 1, width: '100%', paddingHorizontal: 20, backgroundColor: Theme.colors.white },
	categList: { marginTop: 16, },
	scrollviewHider: { width: '100%', marginTop: -12, height: 15, backgroundColor: Theme.colors.white },

})


const mapStateToProps = ({ app }) => ({
});

export default connect(mapStateToProps, {
})(PromotionsScreen);