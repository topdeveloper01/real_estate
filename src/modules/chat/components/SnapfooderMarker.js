import React, { memo, useState, useRef, useEffect } from 'react';
import WebView from 'react-native-webview';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Callout, PROVIDER_GOOGLE, Point, Marker } from "react-native-maps";
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import Theme from "../../../theme";
import Config from '../../../config';
import { translate } from '../../../common/services/translate';
import { findZodiacSign } from '../../../common/components/ZodiacSign';
import { getImageFullURL } from '../../../common/services/utility';
// svgs 
import Svg_female from '../../../common/assets/svgs/msg/snapfooder_female.svg'
import Svg_male from '../../../common/assets/svgs/msg/snapfooder_male.svg'
import Svg_chat from '../../../common/assets/svgs/msg/chat.svg'

const SnapfooderMarker = ({ latitude, longitude, user_id, is_friend, user, onGoUserProfile, onChat }) => {
    const textWidth = useRef(0);
    const [namewidth, setWidth] = useState(user.full_name.length * 14);
    const calculateWidth = () => {
        let w = 70;
        if (user.birthdate != null) {
            w = w + 30
        }
        if (user.full_name != null) {
            w = w + namewidth
        }
        if (is_friend == 1) {
            w = w + 60
        }
        return w;
    }
    const measureText = (event) => {
        let text_width = parseInt(event.nativeEvent.layout.width);
        if (textWidth.current != text_width && textWidth.current == 0) {
            textWidth.current = text_width;
            setWidth(text_width);
        }
    }

    console.log('SnapfooderMarker ', textWidth.current);

    return (
        <Marker
            key={namewidth}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}
            coordinate={{
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            }}
        >
            {user.sex == 'male' ? <Svg_male /> : <Svg_female />}
            <Callout
                tooltip={true}
                onPress={() => {
                    if (is_friend == 1) {
                        onChat(user)
                    }
                    else {
                        onGoUserProfile(user)
                    }
                }}
            >
                <View style={Theme.styles.col_center}>
                    <View style={{ width: calculateWidth(), height: 60, backgroundColor: 'white', borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1, flexDirection: 'row', paddingHorizontal: 20 }}>
                        {
                            Config.isAndroid ?
                                <Text style={{
                                    width: 30,
                                    height: 30,
                                    padding: 0,
                                    // resizeMode: 'contain',
                                    justifyContent: 'center',
                                    marginRight: 10,
                                    borderRadius: 6,
                                }}>
                                    <WebView style={{ height: 30, width: 30, }} source={{ uri: getImageFullURL(user.photo) }} />
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
                                    source={{ uri: getImageFullURL(user.photo) }}
                                    resizeMode={FastImage.resizeMode.cover} />
                        }
                        <Text onLayout={(event) => measureText(event)} numberOfLines={1} style={styles.nameTxt}>{user.full_name}</Text>
                        {
                            user.birthdate != null &&
                            findZodiacSign(moment(user.birthdate).toDate())
                        }
                        <View style={{ width: 10 }} />
                        {
                            is_friend == 1 &&
                            <TouchableOpacity style={[Theme.styles.row_center, styles.chatBtn]}>
                                <Svg_chat />
                                <Text style={styles.chatBtnTxt}>Chat</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ width: 20, height: 20, backgroundColor: '#fff', transform: [{ rotate: '45deg' }], marginTop: -8, zIndex: 0 }} />
                </View>
            </Callout>
        </Marker>
    );
}

const styles = StyleSheet.create({
    chatBtn: { paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: Theme.colors.gray6 },
    chatBtnTxt: { color: Theme.colors.cyan2, fontFamily: Theme.fonts.semiBold, fontSize: 15, marginLeft: 5 },
    nameTxt: { color: Theme.colors.text, fontSize: 16, fontFamily: Theme.fonts.bold, paddingRight: 5 },
});

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.latitude != nextProps.latitude ||
        prevProps.longitude != nextProps.longitude ||
        prevProps.user_id != nextProps.user_id ||
        prevProps.is_friend != nextProps.is_friend
    ) {
        console.log('SnapfooderMarker item equal : ', false)
        return false;
    }
    return true;
}

export default React.memo(SnapfooderMarker, arePropsEqual);
