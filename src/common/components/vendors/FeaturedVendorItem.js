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

const FeaturedVendorItem = (props) => {
    const { data, onSelect, style } = props

    return <TouchableOpacity onPress={() => onSelect()}
        style={[Theme.styles.col_center, styles.container, style,]}>
        <View style={[Theme.styles.col_center, styles.imgView]}>
            <FastImage
                source={{ uri: data.photo }}
                style={styles.img}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
        <View style={{ flex: 1, width: '100%', padding : 12, flexDirection: 'column',  }}>
            <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                <AppText style={[styles.title]}>{data.title}</AppText>
            </View>
            <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 6 }]}>
                <AppText style={[styles.text]}>{data.type_use}</AppText>
            </View>
            <View style={[Theme.styles.row_center_start, { width: '100%' , marginTop: 6}]}>
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
                <View style={{ flex: 1 }} />
                <AppText style={[styles.price]}>${data.price}</AppText>
            </View>
        </View>
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    container: { 
        width: 160,
        backgroundColor: Theme.colors.white,
        shadowColor: Theme.colors.blackPrimary,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
        marginVertical: 6,
        marginLeft: 2,
        marginRight: 12
    },
    imgView: { width: '100%', height: 110, backgroundColor: '#F6F6F9' },
    img: { width: '100%', height: 110, },
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
export default connect(mapStateToProps, { toggleFavourite })(React.memo(FeaturedVendorItem, arePropsEqual));
