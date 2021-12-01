import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ImageBackground, View, Text, StyleSheet, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppText from '../AppText';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import Config from '../../../config';
import { OrderType_Delivery, OrderType_Pickup, OrderType_Reserve } from '../../../config/constants'
import { toggleFavourite } from '../../../store/actions/vendors';
// svgs
import Svg_euro from '../../../common/assets/svgs/ic_euro.svg'

const btnWidth = 300;
const btnHeight = 119;
const VendorItem = (props) => {
    const { data, onSelect, onFavChange, isLoggedIn, style } = props

    const onPressFav = (data) => {
        console.log(data.isFav)
        props.toggleFavourite(data.id, data.isFav == 1 ? 0 : 1).then((res) => {
            data.isFav = data.isFav == 1 ? 0 : 1
            onFavChange(data)
        })
            .catch((error) => {
                console.log('onPressFav', error)
            })
    }

    console.log('VendorItem')

    const renderInfo = () => {
        if (data.selected_order_method == OrderType_Pickup) {
            return <React.Fragment>
                <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                    <AntDesign name="star" size={16} color={Theme.colors.gray7} style={{ marginRight: 6 }} />
                    <AppText style={[styles.text]}>{(parseFloat(data.rating_interval) / 2).toFixed(1)}    |   </AppText>

                    {
                        data.distance != null && parseFloat(data.distance) > 0 &&
                        <React.Fragment>
                            <Entypo name="location-pin" size={18} color={Theme.colors.gray7} style={{ marginRight: 4 }} />
                            <AppText style={[styles.text]}>{(parseFloat(data.distance) / 1000).toFixed(2)} Km</AppText>
                        </React.Fragment>
                    }
                </View>
                <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                    <MaterialIcons name="access-time" size={18} color={Theme.colors.gray7} style={{ marginRight: 6 }} />
                    <AppText style={[styles.text]}>{data.minimum_delivery_time} {translate('vendor_profile.mins')}</AppText>
                </View>
            </React.Fragment>
        }
        if (data.selected_order_method == OrderType_Reserve) {
            return <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                <AntDesign name="star" size={16} color={Theme.colors.gray7} style={{ marginRight: 6 }} />
                <AppText style={[styles.text]}>{(parseFloat(data.rating_interval) / 2).toFixed(1)}    |   </AppText>

                {
                    data.distance != null && parseFloat(data.distance) > 0 &&
                    <React.Fragment>
                        <Entypo name="location-pin" size={18} color={Theme.colors.gray7} style={{ marginRight: 4 }} />
                        <AppText style={[styles.text]}>{(parseFloat(data.distance) / 1000).toFixed(2)} Km</AppText>
                    </React.Fragment>
                }
            </View>
        }
        return <React.Fragment>
            <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                <AntDesign name="star" size={16} color={Theme.colors.gray7} style={{ marginRight: 6 }} />
                <AppText style={[styles.text]}>{(parseFloat(data.rating_interval) / 2).toFixed(1)} </AppText>
            </View>
            <View style={[Theme.styles.row_center_start, { width: '100%', paddingLeft: 2 }]}>
                <Svg_euro />
                <AppText style={[styles.text,]}>  {data.delivery_minimum_order_price == null ? 0 : parseInt(data.delivery_minimum_order_price)} L    |    </AppText>
                <MaterialIcons name="access-time" size={18} color={Theme.colors.gray7} style={{ marginRight: 6 }} />
                <AppText style={[styles.text, { flex: 1 }]}>{data.minimum_delivery_time} {translate('vendor_profile.mins')}</AppText>
            </View>
        </React.Fragment>
    }

    return <TouchableOpacity onPress={() => onSelect()}
        style={[Theme.styles.row_center, styles.container, style, data.selected_order_method == OrderType_Reserve && { height: 94, alignItems: 'center', }]}>
        <View style={[Theme.styles.col_center, styles.imgView]}>
            <FastImage
                source={{ uri: `${Config.IMG_BASE_URL}${data.logo_thumbnail_path}?w=200&h=200`}}
                style={styles.img}
                resizeMode={FastImage.resizeMode.contain}
            />
        </View>
        <View style={{ flex: 1, height: '100%', paddingLeft: 12, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                <AppText style={[styles.title]}>{data.title}</AppText>
                <View style={data.is_open == 1 ? styles.activeIndicator : styles.inactiveIndicator} />
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    {
                        isLoggedIn && <TouchableOpacity onPress={() => onPressFav(data)}>
                            <AntDesign name="heart" size={22} color={data.isFav == 1 ? Theme.colors.cyan2 : Theme.colors.gray5} />
                        </TouchableOpacity>
                    }
                </View>
            </View>
            <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                <AppText style={[styles.text]}>{data.custom_text}</AppText>
            </View>
            {renderInfo()}
        </View>
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    container: { height: btnHeight, width: btnWidth, alignItems: 'flex-start', borderRadius: 15, backgroundColor: Theme.colors.gray8, padding: 12, marginRight: 16, },
    imgView: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#F6F6F9' },
    img: { width: 52, height: 52, resizeMode: 'contain', borderRadius: 10, },
    activeIndicator: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#0f0' },
    inactiveIndicator: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#f00', },
    title: { fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.bold, marginRight: 6 },
    text: { fontSize: 11, color: Theme.colors.gray7, fontFamily: Theme.fonts.medium, },
})

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.isFav != nextProps.isFav ||
        prevProps.vendor_id != nextProps.vendor_id || 
        prevProps.is_open != nextProps.is_open
        ) {
        console.log('vendor item equal : ', prevProps.data.title, false )
        return false;
    }
    return true;
}

const mapStateToProps = ({ app, shop }) => ({
    isLoggedIn: app.isLoggedIn,
});
export default connect(mapStateToProps, { toggleFavourite })(React.memo(VendorItem, arePropsEqual));
