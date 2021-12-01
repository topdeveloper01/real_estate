import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Theme from '../../../theme';
import React from 'react';
import moment from 'moment';
import Svg_delete from '../../assets/svgs/ic_delete.svg'
import {Pay_COD, Pay_Card, Pay_Paypal, Pay_Apple} from '../../../config/constants'; 
import { translate } from '../../../common/services/translate';

const OrderItem = ({ data, onSelect, onDelete, onCancel }) => {
    const past_status = ['delivered', 'declined', 'canceled'] 
	const inprogress_status = ['new', 'processing', 'picked_by_rider']
	const payment_methods = [Pay_COD, Pay_Paypal, Pay_Card,  Pay_Apple]

	const isPast=()=>{
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
		else if (status == 'delivered' || status == 'picked_up') {
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
		if(data.payment != null && data.payment.payment_methods_id != null && data.payment.payment_methods_id > 0 && data.payment.payment_methods_id <= payment_methods.length) {
			return translate(payment_methods[data.payment.payment_methods_id - 1]) 
		}
		return ''
	}

    const getOrderSumm = () => {
        let orderSumm = ''
        if (data.products != null) {
            data.products.slice(0, Math.min(2,  data.products.length)).map((p, i) => {
                if(i > 0) {
                    orderSumm = orderSumm + ' and '
                }
                orderSumm = orderSumm + p.title
            }) 
            if(data.products.length > 2) {
                orderSumm = orderSumm + ` & ${data.products.length - 2} more` 
            } 
        } 
        return orderSumm
    }

    return <TouchableOpacity onPress={onSelect ? ()=>onSelect(data.id) : () => { }} style={[Theme.styles.col_center, styles.container]}>
        <View style={[Theme.styles.row_center,]}>
            <Text style={[styles.dateTxt]}>{moment(data.ordered_date, "DD-MM-YYYY HH:mm").format('DD/MM/YYYY')}</Text> 
            {/* {
				isPast() ? <TouchableOpacity onPress={onDelete ? ()=>onDelete(data.id) : () => { }}  >
					<Svg_delete />
				</TouchableOpacity>
					:
					<TouchableOpacity onPress={onCancel ? ()=>onCancel(data.id) : () => { }}  >
						<Text style={[styles.cancelBtn]}>Cancel</Text>
					</TouchableOpacity>
			}  */}
        </View>

        <Text style={[styles.text]}>{getOrderSumm()}</Text>
        <Text style={[styles.text]}>{getPaymentMethod()}</Text>

        <View style={[Theme.styles.row_center, { width: '100%', marginTop : 6 }]}>
            <Text style={[styles.priceTxt]}>{parseInt(data.total_price)} L</Text>
            <Text style={[styles.status, { color: statusColor(data.status) }]}>
                {
					translate('order.' + data.status)  
                } 
            </Text>
        </View>
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    container: { width: '100%', marginBottom: 12, justifyContent: 'space-around', alignItems: 'flex-start', borderRadius: 15, backgroundColor: '#FAFAFC', padding: 20, },
    dateTxt: { flex: 1, fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold },
    text: { marginTop: 9, fontSize: 12, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold },
    priceTxt: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold },
    status: { textAlign: 'right', flex: 1, fontSize: 12, fontFamily: Theme.fonts.semiBold },
    cancelBtn: { fontSize: 12, color: Theme.colors.gray7, fontFamily: Theme.fonts.semiBold, },
})
export default OrderItem;
