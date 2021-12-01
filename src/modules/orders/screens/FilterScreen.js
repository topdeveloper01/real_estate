import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { setHomeOrdersFilter } from '../../../store/actions/app';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import FilterItem from '../../../common/components/FilterItem';
import Header1 from '../../../common/components/Header1';

const FilterScreen = (props) => {
	const [discount, setDiscount] = useState(false);
	const [cashback, setCashback] = useState(false);
	const [promotion, setPromotion] = useState(false);
	const [split, setSplit] = useState(false);

	useEffect(() => {
		setDiscount(props.home_orders_filter.discount);
		setCashback(props.home_orders_filter.cashback);
		setPromotion(props.home_orders_filter.promotion);
		setSplit(props.home_orders_filter.split);
	}, [
		props.home_orders_filter.discount,
		props.home_orders_filter.cashback,
		props.home_orders_filter.promotion,
		props.home_orders_filter.split,
	]);

	return (
		<View style={styles.container}>
			<Header1
				onLeft={() => {
					props.navigation.goBack();
				}}
				onRight={() => {
					props.setHomeOrdersFilter({
						discount,
						cashback,
						promotion,
						split,
					});
					props.navigation.goBack();
				}}
				right={<Text style={styles.applyBtn}>{translate('search.apply')}</Text>}
				title={translate('search.filter')}
			/>
			<View style={styles.formView}>
				<ScrollView style={{ flex: 1, width: '100%' }}>
					<FilterItem
						item={{
							name: translate('filter.discount'),
							type: 'checkbox',
						}}
						isChecked={discount}
						onSelect={(item) => {
							setDiscount(!discount);
						}}
					/>
					<FilterItem
						item={{
							name: translate('filter.cashback'),
							type: 'checkbox',
						}}
						isChecked={cashback}
						onSelect={(item) => {
							setCashback(!cashback);
						}}
					/>
					<FilterItem
						item={{
							name: translate('filter.promotion'),
							type: 'checkbox',
						}}
						isChecked={promotion}
						onSelect={(item) => {
							setPromotion(!promotion);
						}}
					/>
					<FilterItem
						item={{
							name: translate('filter.split_order'),
							type: 'checkbox',
						}}
						isChecked={split}
						onSelect={(item) => {
							setSplit(!split);
						}}
					/>
					<View style={{ height: 20 }}></View>
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
		padding: 20,
		backgroundColor: Theme.colors.white,
	},
	header: {
		width: '100%',
		height: 70,
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
	applyBtn: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.cyan2 },
	categ_view: { height: 47, width: '100%', paddingLeft: 20, borderTopWidth: 1, borderTopColor: '#F6F6F9' },
	categ_txt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: '#AAA8BF' },
	listItem: {
		height: 54,
		width: '100%',
		marginBottom: 12,
		borderRadius: 15,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: '#FAFAFC',
	},
	item_txt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
});

const mapStateToProps = ({ app }) => ({
	home_orders_filter: app.home_orders_filter,
});

export default connect(mapStateToProps, {
	setHomeOrdersFilter,
})(FilterScreen);
