import React, { memo } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import WebView from 'react-native-webview';
import MapView, { Callout, PROVIDER_GOOGLE, Point, Marker } from "react-native-maps";
import FastImage from 'react-native-fast-image';
import Theme from "../../../theme";
import Config from '../../../config';
import { translate } from '../../../common/services/translate';
import Svg_vendor from '../../../common/assets/svgs/msg/snapfooder_vendor.svg'

const VendorMarker = ({ latitude, longitude, restaurant_id, restaurant, onGoVendor }) => {
    return (
        <Marker
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}
            coordinate={{
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            }}
        >
            <Svg_vendor />
            <Callout tooltip={true} onPress={event => { onGoVendor(restaurant) }}>
                <View>
                    <View style={{ width: 200, height: 80, backgroundColor: 'white', borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                        <View style={{ width: '100%', paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                Config.isAndroid ? <Text style={{
                                    width: 30,
                                    height: 30,
                                    padding: 0,
                                    // resizeMode: 'contain',
                                    justifyContent: 'center',
                                    marginRight: 10,
                                    borderRadius: 6,
                                }}>
                                    <WebView style={{ height: 30, width: 30,}} source={{ uri: `${Config.WEB_PAGE_URL}${restaurant.logo_thumbnail_path}` }} />
                                </Text>
                                    :
                                    <FastImage
                                        style={{
                                            width: 30,
                                            height: 30,
                                            // resizeMode: 'contain',
                                            justifyContent: 'center',
                                            // backgroundColor: 'red',
                                            marginRight: 10,
                                            borderRadius: 6
                                        }}
                                        source={{ uri: `${Config.IMG_BASE_URL}${restaurant.logo_thumbnail_path}?w=200&h=200` }}
                                        resizeMode={FastImage.resizeMode.cover} />
                            }
                            <Text numberOfLines={1} style={{ flex: 1, color: Theme.colors.text, fontSize: 18, fontFamily: Theme.fonts.bold }}>{restaurant.title}</Text>
                        </View>
                        {
                            restaurant.zone != null ?
                                <Text style={{ color: Theme.colors.cyan2, fontFamily: Theme.fonts.semiBold, fontSize: 12, marginBottom: 5 }}>In Delivery Range</Text>
                                :
                                <Text style={{ color: Theme.colors.gray7, fontFamily: Theme.fonts.semiBold, fontSize: 12, marginBottom: 5 }}>Out Of Delivery Range</Text>
                        }

                    </View>
                    <View style={{ width: 20, height: 20, backgroundColor: 'white', transform: [{ rotate: '45deg' }], marginTop: -8, marginLeft: 90, zIndex: 0 }} />
                </View>
            </Callout>
        </Marker>
    );
}

const styles = StyleSheet.create({
});

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.latitude != nextProps.latitude ||
        prevProps.longitude != nextProps.longitude ||
        prevProps.restaurant_id != nextProps.restaurant_id
    ) {
        console.log('VendorMarker item equal : ', false)
        return false;
    }
    return true;
}

export default React.memo(VendorMarker, arePropsEqual);
