import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { width, height } from 'react-native-dimension';
import Theme from '../../../theme';
import React, { useEffect, useState } from 'react';
import {
    Order_Pending, Order_Preparing, Order_Outfordelivery, Order_Delivered, Order_Cancelled,
    Order_Reserved, Order_Accepted, Order_Ready_pickup, Order_Pickedup,
    OrderType_Delivery, OrderType_Reserve, OrderType_Pickup,
} from '../../../config/constants';
// svgs
import Svg_inactive from '../../assets/svgs/order_status/inactive_status.svg'
import Svg_pending from '../../assets/svgs/order_status/pending.svg'
import Svg_preparing from '../../assets/svgs/order_status/preparing.svg'
import Svg_out_for_delivery from '../../assets/svgs/order_status/out_for_delivery.svg'
import Svg_delivered from '../../assets/svgs/order_status/delivered.svg'
import { translate } from '../../services/translate';

//'declined', 'canceled'

const OrderStepper = ({ order, onTrackOrder }) => {

    const delivery_steps = [
        { status: Order_Pending, id: 'new', name: translate('order_delivery_status.pending'), desc: translate('order_delivery_status.pending_desc') },
        { status: Order_Preparing, id: 'processing', name: translate('order_delivery_status.prepare_order'), desc: translate('order_delivery_status.prepare_order_desc') },
        { status: Order_Outfordelivery, id: 'picked_by_rider', name: translate('order_delivery_status.out_for_delivery'), desc: translate('order_delivery_status.out_for_delivery_desc') },
        { status: Order_Delivered, id: 'delivered', name: translate('order_delivery_status.delivered'), desc: translate('order_delivery_status.delivered_desc') },
    ]

    const pickup_steps = [
        { status: Order_Pending, id: 'new', name: translate('order_pickup_status.pending'), desc: translate('order_pickup_status.pending_desc') },
        { status: Order_Accepted, id: 'accepted', name: translate('order_pickup_status.accepted_order'), desc: translate('order_pickup_status.accepted_order_desc') },
        { status: Order_Ready_pickup, id: 'ready_to_pickup', name: translate('order_pickup_status.ready_for_pickup'), desc: translate('order_pickup_status.ready_for_pickup_desc') },
        { status: Order_Pickedup, id: 'picked_up', name: translate('order_pickup_status.picked_up'), desc: translate('order_pickup_status.picked_up_desc') },
    ]

    const reserve_steps = [
        { status: Order_Pending, id: 'new', name: translate('order_reserve_status.pending'), desc: translate('order_reserve_status.pending_desc') },
        { status: Order_Reserved, id: 'reserved', name: translate('order_reserve_status.reserved'), desc: translate('order_reserve_status.reserved_desc') },
    ]

    const [items, setItems] = useState([])
    const [status, setStatus] = useState(0)

    useEffect(() => {
        if (order.order_type == OrderType_Delivery) {
            setItems(delivery_steps)
            setStatus(delivery_steps.findIndex(i => i.id == order.status))
        }
        else if (order.order_type == OrderType_Reserve) {
            setItems(reserve_steps)
            setStatus(reserve_steps.findIndex(i => i.id == order.status))
        }
        else {
            setItems(pickup_steps)
            setStatus(pickup_steps.findIndex(i => i.id == order.status))
        }
    }, [order])

    const icon = (item) => {
        if (item.id == 'new' && item.status <= status) {
            return <Svg_pending />
        }
        else if ((item.id == 'processing' || item.id == 'accepted' || item.id == 'reserved') && item.status <= status) {
            return <Svg_preparing />
        }
        else if ((item.id == 'picked_by_rider' || item.id == 'ready_to_pickup') && item.status <= status) {
            return <Svg_out_for_delivery />
        }
        else if ((item.id == 'delivered' || item.id == 'picked_up') && item.status <= status) {
            return <Svg_delivered />
        }
        else {
            return <Svg_inactive />
        }
    }

    if (order.status == 'declined') {
        return <View style={[Theme.styles.col_center, { width: '100%' }]}>
            <View style={[Theme.styles.row_center, { width: '100%' }]}>
                <Svg_pending />
                <Text style={[styles.activeNameTxt, { flex: 1 }]}>{translate('orders.status_rejected')}</Text>
            </View>
            <View style={[Theme.styles.row_center, { width: '100%', paddingLeft: 30 }]}>
                <Text style={[styles.inactiveDescTxt, { color: '#6E6E6F' }]}>
                    {translate('orders.order_declined_desc')}
                </Text>
            </View>
        </View>
    }

    return <View style={[Theme.styles.col_center, items.length == 0 && { height: 220 }]}>
        {
            items.map((item, index) =>
                <View key={index} style={[Theme.styles.col_center, { width: '100%' }]}>
                    <View style={[Theme.styles.row_center, { width: '100%' }]}>
                        {icon(item)}
                        <Text style={[item.status == status ? styles.activeNameTxt : styles.inactiveNameTxt,
                        (item.status == status && item.name == translate('order_delivery_status.out_for_delivery')) ? {} : { flex: 1 }
                        ]}>{item.name}</Text>
                        {/* {
                            (item.status == status && item.name == translate('order_delivery_status.out_for_delivery') && order.vendor.delivery_type == 'Snapfood') ? 
                            <TouchableOpacity style={styles.trackorderBtn} onPress={onTrackOrder ? onTrackOrder : ()=>{}}>
                                <Text style={styles.trackorder}>{translate('order.track_order')}</Text>
                            </TouchableOpacity>
                            :
                            <View style={styles.trackorderBtn}/>
                        } */}
                        <View style={styles.trackorderBtn} />
                    </View>
                    <View style={[Theme.styles.row_center, { width: '100%', paddingLeft: 10 }]}>
                        <View
                            style={[styles.leftBorder, (item.status < status) && { borderColor: Theme.colors.text }, (index == items.length - 1) && { borderWidth: 0 }]}
                        >
                            <View style={{ position: 'absolute', right: -1, top: 0, width: 1, height: '100%', backgroundColor: 'white', zIndex: 1 }} />
                        </View>
                        <View style={[Theme.styles.col_center, styles.descView,]}>
                            <Text style={[styles.inactiveDescTxt, (item.status <= status) && { color: '#6E6E6F' }]}>
                                {item.desc}
                            </Text>
                        </View>
                    </View>
                </View>
            )
        }
    </View>;
};

const styles = StyleSheet.create({
    activeNameTxt: { marginLeft: 10, fontSize: 15, color: Theme.colors.text, fontFamily: Theme.fonts.bold },
    inactiveNameTxt: { marginLeft: 10, fontSize: 15, color: Theme.colors.text, fontFamily: Theme.fonts.regular },
    icon_out: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#AAA8BF42' },
    icon_in: { width: 12, height: 12, borderRadius: 6, backgroundColor: Theme.colors.gray7 },
    inactiveDescTxt: { flex: 1, marginTop: 3, fontSize: 13, color: Theme.colors.gray7, fontFamily: Theme.fonts.medium },
    leftBorder: {
        borderWidth: 1,
        borderColor: Theme.colors.gray7,
        borderRadius: 1,
        borderStyle: 'dashed',
        height: '100%',
        width: 2,
    },
    descView: {
        width: '100%',
        alignItems: 'flex-start',
        paddingLeft: 20,
        minHeight: 33,
    },
    trackorderBtn: { marginLeft: 10, flex: 1 },
    trackorder: { textDecorationLine: 'underline', fontSize: 13, color: Theme.colors.red1, fontFamily: Theme.fonts.medium },
})
export default OrderStepper;
