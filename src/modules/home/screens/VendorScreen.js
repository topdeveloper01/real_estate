import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Image, StatusBar, View, Animated, ScrollView, Share, InteractionManager, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import Theme from '../../../theme';
import { connect } from 'react-redux'
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import Feather from 'react-native-vector-icons/Feather'
import Gallery from 'react-native-image-gallery';
import { width } from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import YoutubePlayer from "react-native-youtube-iframe";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { AppText } from '../../../common/components';
import Svg_divider from '../../../common/assets/svgs/cat-divider.svg';
import RoundIconBtn from '../../../common/components/buttons/round_icon_button';
import alerts from '../../../common/services/alerts';
import { FOR_RESIDENTIAL, FOR_OFFICE, FOR_SHOP, FOR_INDUSTRIAL } from '../../../config/constants';
import ImgGalleryModal from '../../../common/components/modals/ImgGalleryModal';
import ImgVideoTab from '../../../common/components/buttons/img_video_tab';
import StateText from '../../../common/components/vendors/StateText';
import { MapScreenStyles } from '../../../config/constants';
import { createSingleChannel, findChannel } from '../../../common/services/chat';
import { getLoggedInUserData } from '../../../store/actions/auth';
import { formatNumber, isEmpty, YouTubeGetID } from '../../../common/services/utility';
import RouteNames from '../../../routes/names';
import Img_placeholder from '../../../common/assets/images/placeholder2.png'
import Svg_marker from '../../../common/assets/svgs/marker.svg'

const VendorScreen = (props) => {
    const _mounted = useRef(true);

    const [ownerData, setOwner] = useState(null)
    const [isCreatingChannel, setCreateChannelLoading] = useState(false)
    const [isGalleryModal, ShowGalleryModal] = useState(false);
    const [media_type, setMediaType] = useState('img');
    const [isYoutubePlaying, setYoutubePlaying] = useState(false);

    useEffect(() => {
        loadOwnerDetails(props.vendorData.owner_id);

        return () => {
            console.log("vendor screen unmount")
            _mounted.current = false;
        };
    }, [props.vendorData.id])

    useEffect(() => {
        if (media_type == 'video') {
            setYoutubePlaying(true);
        }
        else {
            setYoutubePlaying(false);
        }
    }, [media_type])

    const onYoutubePlayStateChange = useCallback((state) => {
        console.log('onYoutubePlayStateChange ', state)
        if (state === "ended") {
            setYoutubePlaying(false);
        }
    }, []);

    const getGalleryImages = () => {
        if (props.vendorData.photos != null && props.vendorData.photos.length > 0) {
            let sorted = props.vendorData.photos.sort((a, b) => a.weight - b.weight);
            let list = [];
            sorted.map(photo => {
                list.push({
                    source: { uri: photo.image }
                })
            });
            return list;
        }
        return [{ source: Img_placeholder, dimensions: { width: 250, height: 250 } }];
    }

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
        if (props.isLoggedIn == false) {
            return alerts.confirmation('必須', '登入後繼續', '登入', '取消')
                .then(
                    () => {
                        props.navigation.push(RouteNames.WelcomeScreen, { backRoute: RouteNames.BottomTabs })
                    },
                    (error) => {
                    }
                );
        }

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

    const getConstructionPrice = () => {
        if (props.vendorData.price == null || props.vendorData.construction_size == null || parseInt(props.vendorData.construction_size) == 0) {
            return 0;
        }
        return parseInt(parseInt(props.vendorData.price) / parseInt(props.vendorData.construction_size));
    }

    const getActuralSizePrice = () => {
        if (props.vendorData.price == null || props.vendorData.actual_size == null || parseInt(props.vendorData.actual_size) == 0) {
            return 0;
        }
        return parseInt(parseInt(props.vendorData.price) / parseInt(props.vendorData.actual_size));
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

    console.log('props.vendorData ', props.vendorData)

    return (
        <React.Fragment>
            <Spinner visible={isCreatingChannel} />
            <KeyboardAwareScrollView style={[{ flex: 1, backgroundColor: '#fff' }]} keyboardShouldPersistTaps='handled'>
                <View style={[Theme.styles.col_center_start, Theme.styles.background, { padding: 0 }]}>
                    {
                        media_type == 'img' ?
                            <TouchableOpacity activeOpacity={1} style={[styles.img]} onPress={() => {
                                if (props.vendorData.photos != null && props.vendorData.photos.length > 0) {
                                    ShowGalleryModal(true)
                                }
                            }}>
                                {(props.vendorData.photos != null && props.vendorData.photos.length > 0) &&
                                    <Gallery
                                        style={styles.gallery}
                                        imageComponent={(image, dim) =>
                                            <FastImage source={image.source} style={[styles.img]} resizeMode={FastImage.resizeMode.cover} />
                                        }
                                        images={getGalleryImages()}
                                        initialPage={0}
                                        onPageSelected={(id) => {
                                        }}
                                    />
                                }
                            </TouchableOpacity>
                            :
                            isEmpty(props.vendorData.youtube) ? null :
                                <View style={[Theme.styles.col_center, { width: '100%', height: 360, backgroundColor: '#000' }]}>
                                    <YoutubePlayer
                                        height={300}
                                        width={width(100)}
                                        play={isYoutubePlaying}
                                        videoId={YouTubeGetID(props.vendorData.youtube)}  // 
                                        onChangeState={onYoutubePlayStateChange}
                                        webViewProps={{
                                            injectedJavaScript: `
                                          var element = document.getElementsByClassName('container')[0];
                                          element.style.position = 'unset';
                                          element.style.paddingTop = '250px';
                                          element.style.paddingBottom = '250px';
                                          true;
                                        `,
                                        }}
                                    />
                                </View>

                    }
                    {
                        isEmpty(props.vendorData.youtube) ? null :
                            <ImgVideoTab
                                value={media_type}
                                onChange={(value) => {
                                    setMediaType(value)
                                }}
                            />
                    }
                    <View style={{ padding: 20, width: '100%' }}>
                        {
                            <View style={[Theme.styles.row_center_start, { width: '100%', marginBottom: 12 }]}>
                                <View style={styles.tag}>
                                    <AppText style={[styles.tag_txt]}>
                                        {props.vendorData.isSell == true ? '售 Sales' : '租 Rent'} </AppText>
                                </View>
                                {
                                    !isEmpty(props.vendorData.price) && !isNaN(props.vendorData.price) &&
                                    <AppText style={[styles.price]}>${formatNumber(props.vendorData.price)}</AppText>
                                }
                            </View>
                        }
                        <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 8 }]}>
                            <AppText style={[styles.area]}>{props.vendorData.area}</AppText>
                        </View>
                        <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 8 }]}>
                            <AppText style={[styles.title]}>{props.vendorData.title}</AppText>
                        </View>
                        <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                            <AppText style={[styles.title]}>{props.vendorData.title_en}</AppText>
                        </View>
                        <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 8 }]}>
                            <AppText style={[styles.text]}>街道 (Street/Road) : </AppText>
                            <AppText style={[styles.text]}> {props.vendorData.street} </AppText>
                        </View>
                        <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 8 }]}>
                            <AppText style={[styles.text]}>大廈 /屋苑 (Building/Estate) : </AppText>
                            <AppText style={[styles.text]}>{props.vendorData.building} {props.vendorData.floor}</AppText>
                        </View>
                        <View style={styles.divider} />
                        <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                            <View style={{ flex: 1, paddingRight: 10 }}>
                                <AppText style={[styles.size]}>
                                    建築 Gross Area :
                                </AppText>
                                {
                                    !isEmpty(props.vendorData.construction_size) && !isNaN(props.vendorData.construction_size) &&
                                    <AppText style={[styles.size]}>
                                        {formatNumber(props.vendorData.construction_size)}平方呎 @
                                        ${formatNumber(getConstructionPrice())} Sq. Ft.
                                    </AppText>
                                }
                            </View>
                            <View style={{ flex: 1, paddingLeft: 10 }}>
                                <AppText style={[styles.size]}>
                                    實用 Saleable Area :
                                </AppText>
                                {
                                    !isEmpty(props.vendorData.actual_size) && !isNaN(props.vendorData.actual_size) &&
                                    <AppText style={[styles.size]}>
                                        {formatNumber(props.vendorData.actual_size)}平方呎 @
                                        ${formatNumber(getActuralSizePrice())} Sq. Ft.
                                    </AppText>
                                }
                            </View>
                        </View>

                        <View style={[Theme.styles.col_center, { width: '100%', marginTop: 24 }]}>
                            <AppText style={styles.size}>間隔 Interval</AppText>
                            <View style={[Theme.styles.row_center, styles.infoView]}>
                                <View style={Theme.styles.col_center}>
                                    {
                                        (!isEmpty(props.vendorData.living_rooms) && !isNaN(props.vendorData.living_rooms)) ?
                                            <>
                                                <AppText style={styles.title}>{props.vendorData.living_rooms}廳</AppText>
                                                <AppText style={styles.unit}>LIVING RM</AppText>
                                            </>
                                            :
                                            <AppText style={styles.unit}>-</AppText>
                                    }
                                </View>
                                <Svg_divider />
                                <View style={Theme.styles.col_center}>
                                    {
                                        (!isEmpty(props.vendorData.rooms) && !isNaN(props.vendorData.rooms)) ?
                                            <>
                                                <AppText style={styles.title}>{props.vendorData.rooms}房</AppText>
                                                <AppText style={styles.unit}>ROOM</AppText>
                                            </>
                                            :
                                            <AppText style={styles.unit}>-</AppText>
                                    }
                                </View>
                                <Svg_divider />
                                <View style={Theme.styles.col_center}>
                                    {
                                        (!isEmpty(props.vendorData.toilets) && !isNaN(props.vendorData.toilets)) ?
                                            <>
                                                <AppText style={styles.title}>{props.vendorData.toilets}廁</AppText>
                                                <AppText style={styles.unit}>TOILET</AppText>
                                            </>
                                            :
                                            <AppText style={styles.unit}>-</AppText>
                                    }
                                </View>
                                <Svg_divider />
                                <View style={Theme.styles.col_center}>
                                    {
                                        (!isEmpty(props.vendorData.room_toilets) && !isNaN(props.vendorData.room_toilets)) ?
                                            <>
                                                <AppText style={styles.title}>{props.vendorData.room_toilets} 套廁</AppText>
                                                <AppText style={styles.unit}>TOILET(RM)</AppText>
                                            </>
                                            :
                                            <AppText style={styles.unit}>-</AppText>
                                    }
                                </View>
                                <Svg_divider />
                                <View style={Theme.styles.col_center}>
                                    {
                                        (!isEmpty(props.vendorData.helper_rooms) && !isNaN(props.vendorData.helper_rooms)) ?
                                            <>
                                                <AppText style={styles.title}>{props.vendorData.helper_rooms} 工人房</AppText>
                                                <AppText style={styles.unit}>Maid RM</AppText>
                                            </>
                                            :
                                            <AppText style={styles.unit}>-</AppText>
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={[Theme.styles.row_center, styles.stateTxtView]}>
                            <StateText active={props.vendorData.include_water_fee == true} text={'水 Water Fee'} />
                            <StateText active={props.vendorData.include_electricity_fee == true} text={'電 Electricity '} />
                            <StateText active={props.vendorData.include_manage_fee == true} text={'管理費 Management fee'} />
                            <StateText active={props.vendorData.include_government_fee == true} text={'差餉 Government rate '} />
                            <StateText active={props.vendorData.include_government_rent == true} text={'地租 Government rent'} />
                        </View>
                        <View style={[Theme.styles.row_center, styles.stateTxtView]}>
                            <StateText active={props.vendorData.club_house == true} text={'會所 Club house'} />
                            <StateText active={props.vendorData.swimming_pool == true} text={'泳池 Swimming pool'} />
                            <StateText active={props.vendorData.car_park == true} text={'停車場 Car park'} />
                            <StateText active={props.vendorData.outer_roof == true} text={'天台 Rooftop '} />
                            <StateText active={props.vendorData.outer_terrace == true} text={'露台 Terrace'} />
                        </View>
                        <View style={[Theme.styles.col_center_start, { alignItems: 'flex-start', width: '100%', marginTop: 12 }]}>
                            <AppText style={[styles.size]}>其他資訊 Other Information : </AppText>
                            {
                                !isEmpty(props.vendorData.other) &&
                                <AppText style={[styles.size, { marginTop: 4 }]}>{props.vendorData.other}</AppText>
                            }
                        </View>
                        <View style={[Theme.styles.col_center_start, { alignItems: 'flex-start', width: '100%', marginTop: 20 }]}>
                            <AppText style={[styles.size]}>物業類型 Estate Type : </AppText>
                            <AppText style={[styles.size, { marginTop: 4 }]}>
                                {props.vendorData.type_use == FOR_RESIDENTIAL && '住宅 Residential'}
                                {props.vendorData.type_use == FOR_OFFICE && '寫字樓 Office building'}
                                {props.vendorData.type_use == FOR_SHOP && '商鋪 Shop'}
                                {props.vendorData.type_use == FOR_INDUSTRIAL && '工業大廈 Industrial building'}
                            </AppText>
                        </View>
                        <View style={[Theme.styles.col_center_start, { alignItems: 'flex-start', width: '100%', marginTop: 20 }]}>
                            <AppText style={[styles.size]}>物業編號 Property no. : </AppText>
                            <AppText style={[styles.size, { marginTop: 4 }]}>
                                {props.vendorData.property_no}
                            </AppText>
                        </View>
                        <View style={[Theme.styles.col_center_start, { alignItems: 'flex-start', width: '100%', marginTop: 20 }]}>
                            <AppText style={[styles.size]}>更新日期 Updated date : </AppText>
                            {
                                props.vendorData.updated_at != null &&
                                <AppText style={[styles.size, { marginTop: 4 }]}>
                                    {moment(new Date(props.vendorData.updated_at)).format('DD/MM/YYYY')}
                                </AppText>
                            }
                        </View>
                        {
                            props.vendorData.google_map_position != null &&
                            props.vendorData.google_map_position.latitude != null &&
                            props.vendorData.google_map_position.longitude != null &&
                            <View style={[Theme.styles.col_center_start, { alignItems: 'flex-start', width: '100%', marginTop: 16 }]}>
                                <AppText style={[styles.size]}>單位地點 Map : </AppText>
                                <View style={styles.mapview}>
                                    <MapView
                                        customMapStyle={MapScreenStyles}
                                        provider={PROVIDER_GOOGLE}
                                        showsUserLocation={false}
                                        showsMyLocationButton={false}
                                        showsPointsOfInterest={false}
                                        showsBuildings={false}
                                        style={{ width: '100%', height: 200 }}
                                        region={{
                                            latitude: props.vendorData.google_map_position.latitude,
                                            longitude: props.vendorData.google_map_position.longitude,
                                            latitudeDelta: 0.006,
                                            longitudeDelta: 0.02,
                                        }}>
                                        <Marker
                                            tracksInfoWindowChanges={false}
                                            tracksViewChanges={false}
                                            key={'marker_position'}
                                            anchor={{ x: 0.5, y: 1 }}
                                            coordinate={{
                                                latitude: props.vendorData.google_map_position.latitude,
                                                longitude: props.vendorData.google_map_position.longitude,
                                            }}
                                        >
                                            <Svg_marker />
                                        </Marker>
                                    </MapView>
                                </View>
                            </View>
                        }
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
                    <View style={[Theme.styles.col_center_start, Theme.styles.flex_1, { alignItems: 'flex-start', marginLeft: 12 }]}>
                        <Text style={styles.owner_name}>{ownerData.full_name}</Text>
                        <Text style={{ fontSize: 12, fontFamily: Theme.fonts.medium, color: Theme.colors.text }}>滙槿地產有限公司</Text>
                    </View>
                    <TouchableOpacity style={[Theme.styles.col_center, styles.chatBtn]} onPress={onEnterChannel}>
                        <Text style={styles.size}>聯絡我們 Contact US</Text>
                    </TouchableOpacity>
                </View>
            }
            <ImgGalleryModal
                index={0}
                images={getGalleryImages()}
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
    divider: { height: 1, width: '100%', backgroundColor: Theme.colors.gray3, marginVertical: 20 },
    area: { fontSize: 12, color: Theme.colors.text, fontFamily: Theme.fonts.bold },
    title: { fontSize: 18, color: Theme.colors.text, fontFamily: Theme.fonts.bold },
    unit: { fontSize: 10, color: Theme.colors.text, fontFamily: Theme.fonts.bold },
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
        elevation: 4,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.gray6
    },
    owner_name: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold },
    chatBtn: { paddingHorizontal: 8, paddingVertical: 8, borderRadius: 5, backgroundColor: Theme.colors.yellow1 },
    photoView: { height: 50, width: 50, borderRadius: 25, },
    avatarImg: { width: 50, height: 50, borderRadius: 25, },
    stateTxtView: { justifyContent: 'flex-start', width: '100%', flexWrap: 'wrap', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Theme.colors.gray3 },
    mapview: { overflow: 'hidden', width: '100%', height: 200, borderRadius: 10, marginTop: 12, marginBottom: 20, }
});

const mapStateToProps = ({ app }) => ({
    user: app.user,
    vendorData: app.vendorData,
    isLoggedIn: app.isLoggedIn,
});

export default connect(mapStateToProps, {
})(VendorScreen);
