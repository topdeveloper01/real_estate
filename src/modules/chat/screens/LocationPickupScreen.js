
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { height, width } from 'react-native-dimension';
import RoundIconBtn from '../../../common/components/buttons/round_icon_button';
import Theme from '../../../theme';
import alerts from '../../../common/services/alerts';
import { extractErrorMessage } from '../../../common/services/utility';
import { sendMessage } from '../../../common/services/chat';
import MainBtn from '../../../common/components/buttons/main_button';
import AutoLocInput from '../../../common/components/AutoLocInput';
import { SocialMapScreenStyles } from '../../../config/constants';
// svgs
import Svg_pin from '../../../common/assets/svgs/ic_locpin1.svg';

class LocationPickupScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            coordinates: this.props.coordinates
        };
    }

    onShareLocation = async () => {
        try {
            if (this.props.route.params == null || this.props.route.params.channelId == null) {
                return;
            }
            let newMsg = {
                user: {
                    _id: this.props.user.id,
                    full_name: this.props.user.full_name,
                    photo: this.props.user.photo,
                    phone: this.props.user.phone,
                    email: this.props.user.email
                },
                map: {
                    coords: this.state.coordinates,
                    type: 1, // 0 : my location, 1 : a location
                }
            }
            await sendMessage(this.props.route.params.channelId, this.props.user.id, newMsg)
            this.props.navigation.goBack()
        }
        catch (error) {
            console.log('onShareLocation error ', error)
            alerts.error('Error', extractErrorMessage(error));
        }
    };

    onMarkerDragEnd = async (evt) => {
        this.setState({
            coordinates: {
                latitude: evt.nativeEvent.coordinate.latitude,
                longitude: evt.nativeEvent.coordinate.longitude,
            }
        })
    };

    _renderHeader = () => {
        return <View style={[Theme.styles.row_center, styles.header]}>
            <RoundIconBtn style={styles.headerBtn} icon={<Feather name='chevron-left' size={22} color={Theme.colors.text} />} onPress={() => {
                this.props.navigation.goBack()
            }} />
            <View style={[Theme.styles.row_center_end, { flex: 1, alignItems: 'flex-end' }]}>
                <AutoLocInput
                    onChange={(location, address) => {
                        this.setState({
                            coordinates: {
                                latitude: location.latitude,
                                longitude: location.longitude
                            },
                        });
                    }}
                />
            </View>
        </View>
    }

    renderMap = () => {
        const { latitude, longitude } = this.state.coordinates;
        if (latitude == null || longitude == null) {
            return null;
        }

        let marker;
        // if (Platform.OS === 'ios') {
        marker = (
            <Svg_pin />
        );
        // }
        return (
            <MapView
                customMapStyle={SocialMapScreenStyles}
                provider={PROVIDER_GOOGLE}
                style={{ height: height(100), width: width(100) }}
                region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.012,
                    longitudeDelta: 0.019,
                }}
            >
                <MapView.Marker
                    draggable
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                    }}
                    onDragEnd={(e) => this.onMarkerDragEnd(e)}
                >
                    {!!marker && marker}
                </MapView.Marker>
            </MapView>
        );
    };

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
                    {this._renderHeader()}
                </View>
                <View style={[Theme.styles.col_center, styles.bottomView]}>
                    <MainBtn
                        // disabled={loading}
                        // loading={loading}
                        title={'Share Pin Location'}
                        style={styles.mainBtn}
                        onPress={() => {
                            this.onShareLocation()
                        }}
                    />
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
    bottomView: {
        width: width(100), paddingHorizontal: 20, position: 'absolute', bottom: 40,
    },
    locationSearchView: {
        // height: 132, 
        width: '100%', borderRadius: 15, backgroundColor: Theme.colors.white, alignItems: 'stretch'
    },
    locationSearch: {
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: Theme.colors.gray6,
        borderRadius: 12,
        // height: 45,
        width: '100%',
        paddingLeft: 12,
        backgroundColor: Theme.colors.white,
    },
    locationDescTxt: { fontSize: 10, color: Theme.colors.gray5, marginBottom: 6, fontFamily: Theme.fonts.semiBold },
    locationTxt: { fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold },
    mainBtn: { width: '100%', marginTop: 16 },
    skipBtn: { position: 'absolute', top: 45, right: 25, },
    skipBtnTxt: { fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold },
    header: {
        width: width(100), padding: 20, position: 'absolute', top: 40, alignItems: 'flex-start'
    },
    headerBtn: { width: 45, height: 45, marginRight: 20, borderRadius: 8, backgroundColor: Theme.colors.white, },
});

function mapStateToProps({ app }) {
    return {
        language: app.language,
        coordinates: app.coordinates,
        user: app.user,
    };
}

export default connect(mapStateToProps, {
})(LocationPickupScreen);