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

const VendorItem = (props) => {
    const { data, onSelect, style } = props

    return <TouchableOpacity onPress={() => onSelect()}
        style={[Theme.styles.row_center, styles.container, style,]}>
        <View style={[Theme.styles.col_center, styles.imgView]}>
            <FastImage
                source={{ uri: data.photo}}
                style={styles.img}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
        <View style={{ flex: 1, height: '100%', paddingVertical:4, paddingLeft: 12, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                <AppText style={[styles.title]}>{data.title}</AppText>
            </View>
            <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                <AppText style={[styles.text]} numberOfLines={1}>{data.area} {data.street} {data.building} {data.floor}</AppText>
            </View>
            <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                {
                    data.isSell == true &&
                    <View style={styles.tag}>
                        <AppText style={[styles.tag_txt]}>售</AppText>
                    </View> 
                }
                {
                    data.isRent == true &&
                    <View style={styles.tag}>
                        <AppText style={[styles.tag_txt]}>租</AppText>
                    </View>
                }
                <View style={{flex: 1}}/>
                <AppText style={[styles.price]}>${data.price}</AppText>
            </View>
        </View>
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    container: {
        height: 120, width: '100%', alignItems: 'flex-start', paddingVertical: 16,
        backgroundColor: Theme.colors.white, borderBottomWidth: 1, borderBottomColor: Theme.colors.gray4
    },
    imgView: { width: 150, height: 88, backgroundColor: '#F6F6F9' },
    img: { width: 150, height: 88, },
    title: { fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.bold, marginRight: 6 },
    text: { fontSize: 12, color: Theme.colors.gray3, fontFamily: Theme.fonts.semiBold, },
    tag: { padding: 6, borderRadius: 6, backgroundColor: Theme.colors.yellow1 },
    tag_txt: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold },
    price: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold, },
})

function arePropsEqual(prevProps, nextProps) {
    return prevProps.vendor_id == nextProps.vendor_id
}

const mapStateToProps = ({ app, shop }) => ({
    isLoggedIn: app.isLoggedIn,
});
export default connect(mapStateToProps, { toggleFavourite })(React.memo(VendorItem, arePropsEqual));
