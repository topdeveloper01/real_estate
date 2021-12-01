import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import moment from 'moment';
import Swipeout from 'react-native-swipeout';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import Config from '../../../config';
import { toggleProductFavourite } from '../../../store/actions/vendors';
import { updateCartItems, removeProductFromCart } from '../../../store/actions/shop';


const VendorFoodItem = (props) => {
    const { data, isFav, cartCnt, type, onSelect, onFavChange, style, diabled, cartEnabled, } = props

    const onPressFav = () => {
        props.toggleProductFavourite(data.id, isFav == 1 ? 0 : 1).then((res) => {
            data.isFav = isFav == 1 ? 0 : 1
            onFavChange(data)
        })
            .catch((error) => {
                console.log('onPressFav', error)
            })
    }

    const onRemoveFromCart = async () => {
        try {
            await props.removeProductFromCart(data, true);
        } catch (error) {
            console.log('onRemoveItem', error);
        }
    }

    const getDateLimit = () => {
        let left_days = moment(data.end_time, "YYYY-MM-DD  hh:mm:ss").diff(moment(new Date()), 'days');
        return `${left_days} days left`;
    }

    console.log('vendor food item')

    return <Swipeout
        autoClose={true}
        disabled={cartEnabled != true || cartCnt == 0}
        backgroundColor={Theme.colors.white}
        style={{ width: '100%', marginBottom: 12, }}
        right={[
            {
                text: translate('address_list.delete'),
                backgroundColor: '#f44336',
                underlayColor: 'rgba(0, 0, 0, 0.6)',
                onPress: () => {
                    onRemoveFromCart()
                },
            },
        ]}
    >
        <TouchableOpacity disabled={diabled == true || data.available != 1} onPress={() => onSelect(data)}
            style={[
                Theme.styles.col_center, styles.container,
                { backgroundColor: data.available == 1 ? '#FAFAFC' : '#EFEFF3' },
                cartEnabled == true && cartCnt > 0 && styles.cartBorder,
                style
            ]}>
            <View style={[Theme.styles.row_center_start, { width: '100%', marginBottom: 4, }]}>
                <View style={[Theme.styles.row_center_start, { flex: 1, flexWrap: 'wrap', marginRight: 60 }]}>
                    {cartEnabled == true && cartCnt > 0 &&
                        <Text style={[styles.cartCnt, { marginRight: 5 }]} numberOfLines={1}>
                            {cartCnt} x
                        </Text>
                    }
                    <Text style={[styles.title, data.available != 1 && { textDecorationLine: 'line-through', }]} numberOfLines={1}>
                        {type == 'offer' ? data.name : data.title}
                    </Text>
                    {data.available != 1 && <Text style={[styles.unavailable]} numberOfLines={1}>{translate('vendor_profile.unavailable_item_title')}</Text>}
                </View>
                {/* <View style={{ flex: 1, alignItems: 'flex-end' }}> */}
                {
                    type == 'offer' ?
                        <Text style={styles.date_limit}>{getDateLimit()}</Text>
                        :
                        props.isLoggedIn &&
                        <TouchableOpacity disabled={data.available != 1} onPress={onPressFav}>
                            <AntDesign name="heart" size={20} color={isFav ? Theme.colors.cyan2 : Theme.colors.gray5} />
                        </TouchableOpacity>
                }
                {/* </View> */}
            </View>
            <View style={[Theme.styles.row_center, Theme.styles.w100]}>
                <View style={[Theme.styles.col_center_start, { flex: 1, alignItems: 'flex-start' }]}>
                    <Text style={[styles.descTxt]} numberOfLines={2}>{data.description}</Text>
                    {
                        type == 'offer' ?
                            <Text style={[styles.priceTxt]}>
                                {(data.value != null && parseInt(data.value) >= 0) ? parseInt(data.value) : 0 } L</Text>
                            :
                            <Text style={[styles.priceTxt]}>
                                {(data.price != null && parseInt(data.price) >= 0) ? parseInt(data.price) : 0 } L</Text>
                    }
                </View>
                <View style={[Theme.styles.col_center_start, styles.imgView]}>
                    <FastImage
                        source={{ uri: Config.IMG_BASE_URL + (type == 'offer' ? (data.product ? data.product.image_thumbnail_path : '') : data.image_thumbnail_path) + `?w=200&h=200` }}
                        style={styles.img}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
            </View>
        </TouchableOpacity>
    </Swipeout>;
};

const styles = StyleSheet.create({
    container: { width: '100%', height: 110, alignItems: 'flex-start', borderRadius: 15, padding: 12, marginRight: 16, },
    imgView: { marginLeft: 12 },
    img: { width: 56, height: 56, borderRadius: 12, resizeMode: 'cover' },
    title: { marginRight: 12, fontSize: 14, lineHeight: 18, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold, },
    descTxt: { marginTop: 8, marginBottom: 8, fontSize: 12, color: Theme.colors.gray7, fontFamily: Theme.fonts.medium, },
    priceTxt: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold, },
    date_limit: { fontSize: 12, fontFamily: Theme.fonts.semiBold, color: '#F55A00', marginBottom: 3 },
    unavailable: { fontSize: 12, fontFamily: Theme.fonts.semiBold, color: '#F55A00', },
    cartCnt: { fontSize: 15, lineHeight: 19, color: Theme.colors.cyan2, fontFamily: Theme.fonts.semiBold, },
    cartBorder: { borderTopLeftRadius: 4, borderBottomLeftRadius: 4, borderLeftWidth: 5, borderLeftColor: Theme.colors.cyan2, },
})

function arePropsEqual(prevProps, nextProps) {
    if ((prevProps.food_id == nextProps.food_id && prevProps.isFav != nextProps.isFav) ||
        prevProps.food_id != nextProps.food_id ||
        prevProps.type != nextProps.type ||
        (prevProps.food_id == nextProps.food_id && prevProps.cartCnt != nextProps.cartCnt) ||
        (prevProps.food_id == nextProps.food_id && prevProps.diabled != nextProps.diabled)
    ) {
        console.log('food item equal : ', prevProps.data.title, false)
        return false;
    }
    return true;
}

const mapStateToProps = ({ app, shop }) => ({
    isLoggedIn: app.isLoggedIn,
    cartItems: shop.items,
});
export default connect(mapStateToProps, { toggleProductFavourite, updateCartItems, removeProductFromCart })(React.memo(VendorFoodItem, arePropsEqual));
