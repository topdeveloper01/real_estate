
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import FastImage from 'react-native-fast-image';
import Config from '../../../config';
import RouteNames from '../../../routes/names';
import { createSingleChannel, findChannel } from '../../../common/services/chat';
import alerts from '../../../common/services/alerts';
import apiFactory from '../../../common/services/apiFactory';
import RoundIconBtn from '../../../common/components/buttons/round_icon_button';
import { height, width } from 'react-native-dimension';
import { SocialMapScreenStyles } from '../../../config/constants';
// svgs
import Svg_pin from '../../../common/assets/svgs/ic_locpin.svg';
import Svg_riderpin from '../../../common/assets/svgs/rider_pin.svg';
import Svg_msg from '../../../common/assets/svgs/btn_message.svg';
import { getImageFullURL } from '../../../common/services/utility';

class TrackOrderScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rider: null,
            maximum_delivery_time: null,
            distance: null,
            duration: null,
            region_coords: null,
        };
    }

    componentDidMount() {
        this.getRiderInfo();
        this._interval = setInterval(() => {
            console.log("setInterval : getRiderInfo ");
            this.getRiderInfo();
        }, 60000); // 1 min
    }

    componentWillUnmount() {
        console.log("clearInterval");
        clearInterval(this._interval);
    }

    componentDidUpdate = (prevProps, prevState) => {
        // if (this.state.region_coords != null && this.mapView != null) { 
        //     console.log('componentDidUpdate this.mapView.fitToCoordinates')
        //     setTimeout(()=>{
        //         this.mapView.fitToCoordinates(this.state.region_coords, {
        //             edgePadding: {
        //               right: (width(100) / 20),
        //               bottom: (height(100) / 20),
        //               left: (width(100) / 20),
        //               top: (height(100) / 20),
        //             }
        //         }, false);
        //     }, 1000)
        // } 
    }

    getRiderInfo = () => {
        const order = this.props.route.params.order
        const { latitude, longitude } = this.props.coordinates;
        apiFactory.get(`orders/get-rider-info?order_id=${order.id}&vendor_id=${order.vendor_id}&lat=${latitude}&lng=${longitude}`)
            .then(({ data }) => {
                this.setState({ rider: data.order.rider_info, maximum_delivery_time: data.order.maximum_delivery_time })
            },
                (error) => {
                    console.log('getRiderInfo error ', error)
                    const message = error.message || translate('generic_error');
                    // alerts.error(translate('alerts.error'), message);
                });
    }

    calculateDistance = (rider_lat, rider_lon) => {
        const { latitude, longitude } = this.props.coordinates;
        if (latitude == null || longitude == null || rider_lat == null || rider_lon == null) {
            return null;
        }
    }

    getArrivalTime = () => {
        let duration_time = this.state.maximum_delivery_time  // this.state.duration
        if (duration_time != null && this.state.rider != null && this.state.rider.created_at != null) {
            let arrival_time = moment(this.state.rider.created_at, "YYYY-MM-DD  hh:mm:ss").add(duration_time, 'minutes');
            return arrival_time.format("hh:mm A")
        }
        return ''
    }

    onChat = async (user) => {
        let found_channel = await findChannel(this.props.user.id, user.id)
        if (found_channel != null) {
            this.props.navigation.navigate(RouteNames.MessagesScreen, { channelId: found_channel.id })
        }
        else {
            let partner_user = {
                id: user.id,
                full_name: user.name,
                photo: user.profile_img,
                phone: user.phone_number,
                email: user.email
            }
            let channelID = await createSingleChannel(this.props.user, partner_user)
            if (channelID != null) {
                this.props.navigation.navigate(RouteNames.MessagesScreen, { channelId: channelID })
            }
            else {
                alerts.error(translate('alerts.error'), translate('checkout.something_is_wrong'));
            }
        }
    }

    renderMap = () => {

        const { latitude, longitude } = this.props.coordinates;
        if (latitude == null || longitude == null) {
            return null;
        }

        let marker; let rider_marker;
        // if (Platform.OS === 'ios') {
        marker = (
            <View style={[Theme.styles.col_center,]}>
                <View style={[Theme.styles.row_center, styles.markerInfoView]}>
                    <Text style={styles.brandName}>{translate('you')}</Text>
                </View>
                <Svg_pin />
                <View style={styles.markerAnchor} />
            </View>
        );
        rider_marker = (
            <View style={[Theme.styles.col_center,]}>
                <Svg_riderpin />
            </View>
        );
        // }

        const getRegion = () => {
            let region = {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0,
                longitudeDelta: 0
            }
            if (this.state.rider != null && this.state.rider.latitude != null && this.state.rider.longitude != null) {
                let latitudeDelta = Math.abs(latitude - this.state.rider.latitude);
                let longitudeDelta = Math.abs(longitude - this.state.rider.longitude);
                let middle_lat = (this.state.rider.latitude + latitude) / 2;
                let middle_lng = (this.state.rider.longitude + longitude) / 2;
                region = {
                    latitude: middle_lat - latitudeDelta * 0.1,
                    longitude: middle_lng - longitudeDelta * 0.1,
                    latitudeDelta: latitudeDelta * 1.3,
                    longitudeDelta: longitudeDelta * 1.3
                }
            }
            return region;
        }

        return (
            <MapView
                customMapStyle={SocialMapScreenStyles}
                ref={c => this.mapView = c}
                style={{ height: height(100), width: width(100) }}
                region={getRegion()}
                provider={PROVIDER_GOOGLE}
            >
                <MapView.Marker
                    draggable={false}
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                    }}
                >
                    {!!marker && marker}
                </MapView.Marker>
                {
                    (this.state.rider != null && this.state.rider.latitude != null && this.state.rider.longitude != null) &&
                    <MapView.Marker
                        draggable={false}
                        coordinate={{
                            latitude: this.state.rider.latitude,
                            longitude: this.state.rider.longitude,
                        }}
                    >
                        {!!rider_marker && rider_marker}
                    </MapView.Marker>
                }
                {
                    (this.state.rider != null && this.state.rider.latitude != null && this.state.rider.longitude != null) &&
                    <MapViewDirections
                        origin={{
                            latitude: this.state.rider.latitude,
                            longitude: this.state.rider.longitude,
                        }}
                        destination={{
                            latitude: latitude,
                            longitude: longitude,
                        }}
                        apikey={Config.GOOGLE_MAP_API_KEY}
                        strokeWidth={3}
                        strokeColor={Theme.colors.cyan2}// "hotpink"
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            this.setState({ distance: result.distance, duration: result.duration, region_coords: result.coordinates })
                            // setTimeout(()=>{
                            //     this.mapView.fitToCoordinates(result.coordinates, {
                            //         edgePadding: {
                            //           right: (width(100) / 20),
                            //           bottom: (height(100) / 20),
                            //           left: (width(100) / 20),
                            //           top: (height(100) / 20),
                            //         }
                            //     });
                            // }, 1000)
                            // this.forceUpdate()
                        }}
                    />
                }
            </MapView>
        );
    };

    _renderBottomView = () => {
        if (this.state.rider == null) {
            return null
        }
        return (
            <View style={[styles.bottomView]}>
                <View style={[Theme.styles.col_center, styles.bottomPanel]}>
                    <View style={[Theme.styles.row_center, styles.bottomPanelTop]}>
                        <FastImage source={{ uri: getImageFullURL(this.state.rider.profile_img) }} style={styles.avatarImg} resizeMode={FastImage.resizeMode.cover} />
                        <Text style={[styles.infoTxt, { flex: 1, fontSize: 14, marginLeft: 9 }]}>{this.state.rider.name}</Text>
                        {/* <TouchableOpacity>
                            <Svg_ping />
                        </TouchableOpacity> */}
                        <TouchableOpacity style={{ marginHorizontal: 15, }} onPress={() => this.onChat(this.state.rider)}>
                            <Svg_msg />
                        </TouchableOpacity>
                        {/* <TouchableOpacity>
                            <Svg_call />
                        </TouchableOpacity> */}
                    </View>
                    <View style={[Theme.styles.row_center, { marginTop: 12 }]}>
                        <Text style={[styles.infoTxt, { flex: 1, }]}>{translate('track_order.distance')}:</Text>
                        <Text style={[styles.infoTxt, { fontFamily: Theme.fonts.medium, }]}>{this.state.distance} KM</Text>
                    </View>
                    <View style={[Theme.styles.row_center, { marginTop: 12 }]}>
                        <Text style={[styles.infoTxt, { flex: 1, }]}>{translate('track_order.estimate_arrival')}:</Text>
                        <Text style={[styles.infoTxt, { fontFamily: Theme.fonts.medium, }]}>{this.getArrivalTime()}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <KeyboardAwareScrollView
                style={[{ flex: 1 }, { backgroundColor: '#ffffff' }]}
                extraScrollHeight={65}
                enableOnAndroid={true}
                keyboardShouldPersistTaps='handled'
            >
                <View style={{ flex: 1, }}>
                    {this.renderMap()}
                    <RoundIconBtn style={styles.backBtn} icon={<Feather name='chevron-left' size={22} color={Theme.colors.text} />} onPress={() => {
                        this.props.navigation.goBack()
                    }} />
                    {this._renderBottomView()}
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        paddingHorizontal: Theme.sizes.tiny,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.darkerBackground,
    },
    backBtn: { position: 'absolute', top: 45, left: 25, width: 33, height: 33, borderWidth: 1, borderColor: Theme.colors.gray5, borderRadius: 8, backgroundColor: Theme.colors.white, },
    markerInfoView: { backgroundColor: Theme.colors.white, marginBottom: 12, borderRadius: 12, padding: 10, },
    markerAnchor: { position: 'absolute', bottom: 42, left: '44%', width: 16, height: 16, backgroundColor: Theme.colors.white, transform: [{ rotate: '45deg' }] },
    brandImg: { width: 39, height: 39, borderRadius: 8, borderWidth: 1, borderColor: '#f6f6f9' },
    brandName: { marginHorizontal: 8, fontSize: 18, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
    activeFlag: { width: 7, height: 7, borderRadius: 4, backgroundColor: Theme.colors.red },
    distance: { marginLeft: 8, fontSize: 12, fontFamily: Theme.fonts.medium, color: Theme.colors.gray7 },

    bottomView: {
        width: width(100), padding: 20, position: 'absolute', bottom: 40,
    },
    bottomPanel: { width: '100%', borderRadius: 15, elevation: 2, backgroundColor: Theme.colors.white, padding: 20, },
    bottomPanelTop: { paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Theme.colors.gray9, },
    avatarImg: { width: 25, height: 25, borderRadius: 5, },
    infoTxt: { fontSize: 12, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
});

function mapStateToProps({ app }) {
    return {
        user: app.user || {},
        isLoggedIn: app.isLoggedIn,
        coordinates: app.coordinates,
    };
}

export default connect(mapStateToProps, {
})(TrackOrderScreen);