import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux'
import { isEmpty, getImageFullURL } from '../../../common/services/utility';
import Theme from '../../../theme';
import apiFactory from '../../../common/services/apiFactory';
import { translate } from '../../../common/services/translate';
import { getLoggedInUser } from '../../../store/actions/auth';
import {
    goActiveScreenFromPush
} from '../../../store/actions/app';
import Header1 from '../../../common/components/Header1';
import CashbackHitem from '../../../common/components/vendors/CashbackHitem';
import NoCashback from '../components/NoCashback';
import RouteNames from '../../../routes/names';
// svgs
import Svg_balance from '../../../common/assets/svgs/balance.svg';


const PerPage = 10;

const WalletScreen = (props) => {
	const _isMounted = useRef(true);

	const [loading, setLoading] = useState(null)
	const [cashbacks, setCashbacks] = useState([])
	const [page, setCurPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		props.getLoggedInUser();
		loadCashback(1, PerPage, true)
		props.goActiveScreenFromPush({
			isWalletVisible: false
		})

		return () => {
			console.log("Wallet screen unmount")
			_isMounted.current = false;
		};
	}, [])

	const loadCashback = (page, perPage, forceLoading = false) => {
		if (loading && forceLoading == false) {
			return;
		}
		setLoading(true);
		const params = [`page=${page}`, `per_page=${perPage}`];
		apiFactory.get(`cashback?${params.join('&')}`)
			.then(({ data }) => {
				if (_isMounted.current != true) { return; }
				if (page > 1) {
					const currentOrderIds = cashbacks.map((x) => x.id);
					const newItems = data.data.filter((x) => currentOrderIds.indexOf(x.id) === -1);
					setCurPage(data['current_page']);
					setTotalPages(data['last_page']);
					setCashbacks([...cashbacks, ...newItems])
				} else {
					setCurPage(data['current_page']);
					setTotalPages(data['last_page']);
					setCashbacks(data.data || []);
				}
				setLoading(false);
			},
				(error) => {
					if (_isMounted.current == true) {
						setLoading(false);
						console.log('loadCashback error', error)
						const message = error.message || translate('generic_error');
						alerts.error(translate('alerts.error'), message);
					}
				});
	}

	const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
		return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
	}

	const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
		return contentOffset.y == 0;
	}

	const _renderAvatarView = () => {
		return <View style={[Theme.styles.col_center, styles.avatarView]}>
			<View style={[Theme.styles.col_center, styles.photoView]}>
				<FastImage
					source={
						(isEmpty(props.user.photo) || props.user.photo == 'x')?
							require('../../../common/assets/images/user-default.png')
							:
							{ uri: getImageFullURL(props.user.photo) }
					}
					style={styles.avatarImg}
					resizeMode={FastImage.resizeMode.cover}
				/>
			</View>
			<View style={[Theme.styles.row_center,]}>
				<Text style={styles.name}>{props.user.full_name}</Text>
			</View>
			{props.user.user_category != null &&
				<View style={[Theme.styles.row_center, styles.category]}>
					<Text style={styles.goldtxt}>{props.user.user_category.name}</Text>
				</View>
			}
		</View>
	}
	const _renderBalance = () => {
		return <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#715EE7', '#00D2FF']} style={[Theme.styles.row_center, styles.balanceView]}>
			<Svg_balance />
			<View style={[Theme.styles.col_center, { flex: 1, marginLeft: 10, alignItems: 'flex-start' }]}>
				<Text style={styles.balanceTxt}>{translate('wallet.your_balance')}</Text>
				<Text style={styles.balanceDesc}>{translate('wallet.your_balance_description')}</Text>
			</View>
			<View style={[Theme.styles.row_center, { alignItems: 'flex-end', marginLeft: 12 }]}>
				<Text style={styles.balancePrice}>{props.user.cashback_amount || 0}</Text>
				<Text style={styles.unit}>L</Text>
			</View>
		</LinearGradient >
	}

	return (
		<View style={[Theme.styles.col_center_start, { flex: 1, backgroundColor: Theme.colors.white }]}>
			<Header1
				style={{ marginTop: 10, marginBottom: 0, paddingHorizontal: 20 }}
				onLeft={() => { props.navigation.goBack() }}
				title={translate('account.wallet')}
			/>

			<ScrollView style={styles.scrollview}
				onScroll={({ nativeEvent }) => {
					if (isCloseToTop(nativeEvent)) {
						loadCashback(1, PerPage)
					}
					if (isCloseToBottom(nativeEvent)) {
						if (page < totalPages) {
							loadCashback(page + 1, PerPage)
						}
					}
				}}
			>
				{_renderAvatarView()}
				{_renderBalance()}
				<View style={styles.divider} />
				<Text style={styles.subjectTitle}>{translate('wallet.cashback_history')}</Text>
				{
					(loading == false && cashbacks.length == 0) ?
						<NoCashback />
						:
						cashbacks.map((item, index) =>
							<CashbackHitem key={index} data={item} style={{ width: '100%', marginBottom: 12, }} onSelect={() => {
								props.navigation.navigate(RouteNames.OrderSummScreen, { isnew: false, order_id: item.order_id });
							}} />
						)
				}
				<View style={{ height: 40, }} />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	subjectTitle: { marginTop: 20, marginBottom: 12, fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	divider: { width: '100%', height: 1, backgroundColor: '#F6F6F9' },
	scrollview: { flex: 1, width: '100%', paddingHorizontal: 20, backgroundColor: Theme.colors.white },
	avatarView: { marginTop: 30, },
	photoView: { height: 100, width: 100, borderWidth: 1, borderColor: Theme.colors.gray9, borderRadius: 15, backgroundColor: '#E8D7D0' },
	avatarImg: { width: 100, height: 100, borderRadius: 6, },
	name: { marginTop: 10, marginBottom: 6, fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	goldtxt: { lineHeight: 13, fontSize: 13, fontFamily: Theme.fonts.semiBold, color: Theme.colors.white },
	balanceView: { marginTop: 24, marginBottom: 20, backgroundColor: Theme.colors.white, elevation: 2, borderRadius: 15, paddingLeft: 11, paddingRight: 18, paddingVertical: 23, },
	balanceTxt: { marginBottom: 6, fontSize: 15, fontFamily: Theme.fonts.semiBold, color: Theme.colors.white },
	balanceDesc: { lineHeight: 13, fontSize: 12, fontFamily: Theme.fonts.medium, color: '#FAFAFCCC' },
	balancePrice: { fontSize: 40, fontFamily: Theme.fonts.bold, color: Theme.colors.white },
	unit: { paddingBottom: 5, fontSize: 20, fontFamily: Theme.fonts.bold, color: Theme.colors.white },
	category: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#ffda0f' },
})


const mapStateToProps = ({ app }) => ({
	user: app.user || {},
});

export default connect(mapStateToProps, {
	getLoggedInUser, goActiveScreenFromPush
})(WalletScreen);
