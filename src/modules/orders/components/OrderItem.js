import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import { Pay_COD, Pay_Card, Pay_Paypal, Pay_Apple } from '../../../config/constants';
import Svg_delete from '../../../common/assets/svgs/ic_delete.svg';

const OrderItem = ({ data, order_id, order_status, onCancel, onDelete, onPress, style }) => {
	const past_status = ['delivered', 'picked_up', 'reserved', 'declined', 'canceled']
	const inprogress_status = ['new', 'processing', 'picked_by_rider']
	const payment_methods = [Pay_COD, Pay_Paypal, Pay_Card, Pay_Apple]

	console.log('order Item')

	const isPast = () => {
		return past_status.includes(data.status)
	}
	const statusColor = (status) => {
		if (status == 'new') {
			return Theme.colors.red1
		}
		else if (status == 'processing') {
			return Theme.colors.blue1
		}
		else if (status == 'picked_by_rider') {
			return Theme.colors.cyan2
		}
		else if (status == 'delivered' || status == 'picked_up' || status == 'reserved') {
			return '#00ff00'
		}
		else if (status == 'declined') {
			return '#ff0000'
		}
		else if (status == 'canceled') {
			return Theme.colors.gray7
		}
		else {
			return Theme.colors.gray7
		}
	}
	const getPaymentMethod = () => {
		if (data.payment != null && data.payment.payment_methods_id != null && data.payment.payment_methods_id > 0 && data.payment.payment_methods_id <= payment_methods.length) {
			return translate(payment_methods[data.payment.payment_methods_id - 1]);
		}
		return ''
	}
	return <TouchableOpacity delayPressIn={100} onPress={onPress ? onPress : () => { }} style={[Theme.styles.col_center, styles.container, style]}>
		<View style={[Theme.styles.row_center, { width: '100%', }]}>
			<Text style={[styles.vendor]}>{data.vendor == null ? '' : data.vendor.title}</Text>
			<View style={{ flex: 1 }} />
			{/* {
				isPast() ? <TouchableOpacity onPress={onDelete ? () => onDelete(data.id) : () => { }}  >
					<Svg_delete />
				</TouchableOpacity>
					:
					<TouchableOpacity onPress={onCancel ? () => onCancel(data.id) : () => { }}  >
						<Text style={[styles.cancelBtn]}>{translate('cancel')}</Text>
					</TouchableOpacity>
			} */}
		</View >
		<Text style={styles.payment_method}>{getPaymentMethod()}</Text>
		<Text style={[styles.date,]}>{data.ordered_date.split(' ')[0]}</Text>
		<View style={[Theme.styles.row_center, { width: '100%', marginTop: 6, }]}>
			<Text style={styles.price}>{parseInt(data.total_price)} L</Text>
			<View style={{ flex: 1 }} />
			<Text style={[styles.status, { color: statusColor(data.status) }]}>{
				translate('order.' + data.status)
			}</Text>
		</View>
	</TouchableOpacity >;
};

const styles = StyleSheet.create({
	container: { width: '100%', alignItems: 'flex-start', marginTop: 15, borderRadius: 15, backgroundColor: Theme.colors.gray8, padding: 15, },
	vendor: { marginBottom: 4, fontSize: 15, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold, },
	cancelBtn: { fontSize: 13, color: Theme.colors.gray7, fontFamily: Theme.fonts.semiBold, },
	price: { marginBottom: 6, fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold, },
	payment_method: { marginTop: 9, fontSize: 13, lineHeight: 16, color: Theme.colors.text, fontFamily: Theme.fonts.medium, },
	date: { marginTop: 10, fontSize: 13, lineHeight: 16, color: Theme.colors.text, fontFamily: Theme.fonts.medium, },
	status: { fontSize: 13, color: Theme.colors.cyan2, fontFamily: Theme.fonts.semiBold, },
})

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.order_id != nextProps.order_id) {
		console.log('order item not equal 1')
        return false;
    }
	if (prevProps.order_status != nextProps.order_status) {
		console.log('order item not equal 2')
        return false;
    }
    return true;
}

export default React.memo(OrderItem, arePropsEqual);
