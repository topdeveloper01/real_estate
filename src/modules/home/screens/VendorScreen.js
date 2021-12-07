import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Image, StatusBar, View, Animated, ScrollView, Share, InteractionManager, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import Theme from '../../../theme';
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay';
import Feather from 'react-native-vector-icons/Feather'
import { width } from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppText } from '../../../common/components';
import Svg_divider from '../../../common/assets/svgs/cat-divider.svg';
import RoundIconBtn from '../../../common/components/buttons/round_icon_button';
import alerts from '../../../common/services/alerts';
import { FOR_PERSONAL } from '../../../config/constants';
import ImgGalleryModal from '../../../common/components/modals/ImgGalleryModal';
import { createSingleChannel, findChannel } from '../../../common/services/chat';
import { getLoggedInUserData } from '../../../store/actions/auth';
import { isEmpty } from '../../../common/services/utility';
import RouteNames from '../../../routes/names';

const VendorScreen = (props) => {
    const _mounted = useRef(true);

    const [ownerData, setOwner] = useState(null)
    const [isCreatingChannel, setCreateChannelLoading] = useState(false)
    const [isGalleryModal, ShowGalleryModal] = useState(false);

    useEffect(() => {
        loadOwnerDetails(props.vendorData.owner_id);

        return () => {
            console.log("vendor screen unmount")
            _mounted.current = false;
        };
    }, [props.vendorData.id])

    const loadOwnerDetails = async (id) => {
        if (id == null) { return; }
        try {
            const user = await getLoggedInUserData(id);
            setOwner(user);
        } catch (error) {
            console.log('loadOwnerDetails ', error)
        }
    };

    const onEnterChannel = async () => {
        let found_channel = await findChannel(props.user.id, ownerData.id)
        if (found_channel != null) {
            props.navigation.navigate(RouteNames.MessagesScreen, { channelId: found_channel.id })
        }
        else {
            setCreateChannelLoading(true)
            let channelID = await createSingleChannel(props.user, ownerData);
            setCreateChannelLoading(false)
            if (channelID != null) {
                props.navigation.navigate(RouteNames.MessagesScreen, { channelId: channelID })
            }
            else {
                alerts.error('警告', '出了些問題');
            }
        }
    }

    const _renderHeader = () => {
        return (
            <View style={[Theme.styles.row_center, styles.header]}>
                <RoundIconBtn
                    style={styles.headerBtn}
                    icon={<Feather name='chevron-left' size={22} color={Theme.colors.text} />}
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                />
                <View style={[Theme.styles.row_center_end, { flex: 1, alignItems: 'flex-end' }]}>
                </View>
            </View>
        );
    };
    return (
        <React.Fragment>
            <Spinner visible={isCreatingChannel} />
            <KeyboardAwareScrollView style={[{ flex: 1, backgroundColor: '#fff' }]} keyboardShouldPersistTaps='handled'>
                <View style={[Theme.styles.col_center_start, Theme.styles.background, { padding: 0 }]}>
                    <TouchableOpacity activeOpacity={1} style={[styles.img]} onPress={()=>{
                        ShowGalleryModal(true)
                    }}>
                        <FastImage
                            source={{ uri: props.vendorData.photo }}
                            style={[styles.img]}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity> 
                    <View style={{ padding: 20, width: '100%' }}>
                        <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                            <AppText style={[styles.title]}>{props.vendorData.title}</AppText>
                        </View>
                        <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 8 }]}>
                            <AppText style={[styles.text]}>
                                {props.vendorData.area} {props.vendorData.street} {props.vendorData.building} {props.vendorData.floor}
                            </AppText>
                        </View>
                        <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 8 }]}>
                            <AppText style={[styles.size]}>實用面積 : {props.vendorData.size}</AppText>
                        </View>
                        {
                            props.vendorData.isSell == true &&
                            <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 12 }]}>
                                <View style={styles.tag}>
                                    <AppText style={[styles.tag_txt]}>售</AppText>
                                </View>
                                <AppText style={[styles.price]}>${props.vendorData.price}</AppText>
                            </View>
                        }
                        {
                            props.vendorData.isRent == true &&
                            <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 12 }]}>
                                <View style={styles.tag}>
                                    <AppText style={[styles.tag_txt]}>租</AppText>
                                </View>
                                <AppText style={[styles.price]}>${props.vendorData.rent_price}</AppText>
                            </View>
                        }
                        <View style={[Theme.styles.col_center, { width: '100%', marginTop: 24 }]}>
                            <AppText style={styles.size}>間隔</AppText>
                            <View style={[Theme.styles.row_center, styles.infoView]}>
                                <AppText style={styles.title}>{props.vendorData.living_rooms}廳</AppText>
                                <Svg_divider />
                                <AppText style={styles.title}>{props.vendorData.rooms}房</AppText>
                                <Svg_divider />
                                <AppText style={styles.title}>{props.vendorData.toilets}廁</AppText>
                                <Svg_divider />
                                <AppText style={styles.title}>{props.vendorData.room_toilets} 套廁</AppText>
                                <Svg_divider />
                                <AppText style={styles.title}>{props.vendorData.helper_rooms} 工人房</AppText>
                            </View>
                        </View>
                        <View style={[Theme.styles.col_center_start, { alignItems: 'flex-start', width: '100%', marginTop: 12 }]}>
                            <AppText style={[styles.size]}>單位資訊 : </AppText>
                            {
                                !isEmpty(props.vendorData.other) &&
                                <AppText style={[styles.size, { marginTop: 4 }]}>{props.vendorData.other}</AppText>
                            }
                        </View>
                        <View style={[Theme.styles.col_center_start, { alignItems: 'flex-start', width: '100%', marginTop: 20 }]}>
                            <AppText style={[styles.size]}>物業類型 :  </AppText>
                            <AppText style={[styles.size, { marginTop: 4 }]}>{props.vendorData.type_use == FOR_PERSONAL ? '私人住宅物業' : '商業用途'}</AppText>
                        </View>
                    </View>
                    {_renderHeader()}
                </View>
            </KeyboardAwareScrollView>
            {
                ownerData != null && props.user.id != ownerData.id &&
                <View style={[Theme.styles.row_center, styles.ownerInfo]}>
                    <View style={[Theme.styles.col_center, styles.photoView]}>
                        <FastImage
                            source={
                                isEmpty(ownerData.photo) ?
                                    require('../../../common/assets/images/user-default.png')
                                    :
                                    { uri: ownerData.photo }
                            }
                            style={styles.avatarImg}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    <View style={[Theme.styles.flex_1, { marginLeft: 12 }]}>
                        <Text style={styles.owner_name}>{ownerData.full_name}</Text>
                    </View>
                    <TouchableOpacity style={[Theme.styles.col_center, styles.chatBtn]} onPress={onEnterChannel}>
                        <Text style={styles.size}>聯絡我們</Text>
                    </TouchableOpacity>
                </View>
            }
            <ImgGalleryModal
                index={0}
                images={[
                    {
                        source: { uri: props.vendorData.photo },
                    }
                ]}
                showModal={isGalleryModal}
                onClose={() => ShowGalleryModal(false)}
            />
        </React.Fragment>
    );
}


const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        height: 50,
        width: width(100) - 40,
        alignItems: 'flex-end',
    },
    headerBtn: { width: 33, height: 33, borderRadius: 8, backgroundColor: Theme.colors.white },
    img: { width: '100%', height: 360, resizeMode: 'cover' },
    title: { fontSize: 18, color: Theme.colors.text, fontFamily: Theme.fonts.bold },
    text: { fontSize: 12, color: Theme.colors.gray3, fontFamily: Theme.fonts.semiBold, },
    size: { fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.medium, },
    tag: { padding: 6, borderRadius: 6, backgroundColor: Theme.colors.yellow1 },
    tag_txt: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold },
    price: { marginLeft: 18, fontSize: 24, color: Theme.colors.text, fontFamily: Theme.fonts.bold, },
    infoView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%', marginVertical: 12, paddingVertical: 16, borderTopColor: Theme.colors.gray4, borderTopWidth: 1, borderBottomColor: Theme.colors.gray4, borderBottomWidth: 1
    },
    ownerInfo: {
        backgroundColor: '#F7F7F7',
        paddingHorizontal: 20,
        height: 70,
        width: '100%',
        shadowColor: Theme.colors.blackPrimary,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4
    },
    owner_name: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold },
    chatBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, backgroundColor: Theme.colors.yellow1 },
    photoView: { height: 50, width: 50, borderRadius: 25, },
    avatarImg: { width: 50, height: 50, borderRadius: 25, },
});

const mapStateToProps = ({ app  }) => ({
    user: app.user,
    vendorData: app.vendorData,
    isLoggedIn: app.isLoggedIn,
});

export default connect(mapStateToProps, {
})(VendorScreen);
