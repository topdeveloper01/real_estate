import React from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, View, Text, InteractionManager, Image } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import BackButton from "../../../common/components/buttons/back_button";
import RouteNames from "../../../routes/names";
import MapView, { Callout, PROVIDER_GOOGLE, Point } from "react-native-maps";
import GetLocation from 'react-native-get-location'
import { SocialMapScreenStyles } from "../../../config/constants";
import FastImage from "react-native-fast-image";
import { translate } from '../../../common/services/translate';
import alerts from '../../../common/services/alerts';
import { checkLocationPermission } from '../../../common/services/location';
import apiFactory from '../../../common/services/apiFactory';
import { createSingleChannel, findChannel } from '../../../common/services/chat';
import Theme from '../../../theme';
import Config from '../../../config';
import { setVendorCart } from '../../../store/actions/shop';
import UserMarker from '../components/UserMarkers';
import VendorMarker from '../components/VendorMarker';
import SnapfooderMarker from '../components/SnapfooderMarker';

const MIN_DELTA = 0.03

class SnapfoodMapScreen extends React.Component {
    _isMounted = true
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            my_latitude: null,
            my_longitude: null,
            snapfooders: [],
            vendors: [],
            isCreatingChannel : false,
            region: {
                latitude: this.props.coordinates.latitude,
                longitude: this.props.coordinates.longitude,
                latitudeDelta: MIN_DELTA,
                longitudeDelta: MIN_DELTA,
            }
        };
    }

    componentDidMount() {
        this._isMounted = true;

        this.getMyLocation();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getMyLocation = async () => {
        let latitude = this.props.coordinates.latitude;
        let longitude = this.props.coordinates.longitude;
        try {
            let hasPermission = await checkLocationPermission();
            if (hasPermission) {
                console.log('checkLocationPermission : True, get current position')
                const location = await GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000, });

                latitude = location.latitude;
                longitude = location.longitude;
            }
            else {
                console.log('checkLocationPermission : False')
            }
        }
        catch (error) {
            console.log('getCurrentPosition error : ', error)
        }
        if (latitude && longitude) {
            this.setState({
                my_latitude: latitude,
                my_longitude: longitude,
                region: {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: MIN_DELTA,
                    longitudeDelta: MIN_DELTA,
                }
            });
            this.onRegionChangeComplete({ latitude: latitude, longitude: longitude, latitudeDelta: MIN_DELTA, longitudeDelta: MIN_DELTA }, true)
        }
    };

    onGoVendor = async (restaurant) => {
        this.props.setVendorCart(restaurant)
        this.props.navigation.navigate(RouteNames.VendorScreen)
    }

    onGoUserProfile = (user) => {
        this.props.navigation.navigate(RouteNames.SnapfooderScreen, { user: user })
    }

    onEnterChannel = async (partner) => {
        let found_channel = await findChannel(this.props.user.id, partner.id)
        if (found_channel != null) {
            this.props.navigation.navigate(RouteNames.MessagesScreen, { channelId: found_channel.id })
        }
        else {
            this.setState({isCreatingChannel: true})
            let channelID = await createSingleChannel(this.props.user, partner);
            this.setState({isCreatingChannel: false})
            if(channelID != null) {
                this.props.navigation.goBack();
                this.props.navigation.navigate(RouteNames.MessagesScreen, { channelId: channelID })
            }
            else {
                alerts.error(translate('alerts.error'), translate('checkout.something_is_wrong'));
            }
        }
    }
    
    onPanDrag = (event) => {
        const { coordinate } = event.nativeEvent
        console.log('onPanDrag', coordinate)
    }

    onRegionChangeComplete = (region, isForce) => {
        if (isForce != true &&
            Math.abs(region.latitude - this.state.region.latitude) <= (region.latitudeDelta / 2) &&
            Math.abs(region.longitude - this.state.region.longitude) <= (region.longitudeDelta / 2)
        ) { 
            console.log('ignored')
            return
        }

        apiFactory.post(`users/snapfooders-range`, {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
        }).then(({ data }) => {
            if (this._isMounted == true) {
                console.log('on RegionChange Complete', (data.snapfooders || []).length, (data.vendors || []).length, region)
                this.setState({
                    loading: false,
                    snapfooders: data.snapfooders || [],
                    vendors: data.vendors || [],
                    region: region,
                });
            }
        },
            (error) => {
                const message = error.message || translate('generic_error');
                if (this._isMounted == true) {
                    this.setState({
                        loading: false,
                        region: region,
                    });
                }
                alerts.error(translate('alerts.error'), message);
            });

    }

    render() {
        console.log('snapfood map')
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.isCreatingChannel}/>
                {this.renderMap()}
                {this.renderTitleBar()}
            </View>
        );
    }

    renderMap() {
        const { my_latitude, my_longitude } = this.state;
        if (my_latitude == null || my_longitude == null) { return null }
        return (
            <MapView
                customMapStyle={SocialMapScreenStyles}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsPointsOfInterest={false}
                showsBuildings={false}
                moveOnMarkerPress={false}
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                region={this.state.region}
                onRegionChangeComplete={(region) => this.onRegionChangeComplete(region, false)}
            >
                <UserMarker
                    key={'me'}
                    latitude={my_latitude}
                    longitude={my_longitude}
                />
                {
                    this.state.snapfooders.map((value, index) => {
                        return (
                            <SnapfooderMarker
                                key={'snapfooders_' + value.id}
                                latitude={value.latitude}
                                longitude={value.longitude}
                                user_id={value.id}
                                user={value}
                                is_friend={value.is_friend}
                                onGoUserProfile={() => {
                                    this.onGoUserProfile(value)
                                }}
                                onChat={()=>{
                                    this.onEnterChannel(value)
                                }}
                            />);
                    })
                }
                {
                    this.state.vendors.map((value, index) => {
                        return (
                            <VendorMarker
                                key={'vendors_' + value.id}
                                latitude={value.latitude}
                                longitude={value.longitude}
                                restaurant_id={value.id}
                                restaurant={value}
                                onGoVendor={() => {
                                    this.onGoVendor(value)
                                }}
                            />);
                    })
                }
            </MapView>
        );
    }

    renderTitleBar() {
        return (
            <View style={styles.titleContainer}>
                <BackButton iconCenter={true}
                    style={{ width: 33, height: 33 }}
                    onPress={() => {
                        this.props.navigation.goBack();
                    }} />
                <View style={{ flex: 1 }}>
                </View>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.push(RouteNames.SnapfoodersScreen);
                }}>
                    <FastImage source={require('../../../common/assets/images/users.png')} resizeMode={FastImage.resizeMode.contain} style={{ width: 35, height: 35 }} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.white,
    },
    titleContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        position: 'absolute',
        top: 50,
        left: 0
    },
});

const mapStateToProps = ({ app, chat }) => ({
    user: app.user,
    coordinates: app.coordinates,
});

export default connect(
    mapStateToProps,
    {
        setVendorCart
    },
)(SnapfoodMapScreen);
