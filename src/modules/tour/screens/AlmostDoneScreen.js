import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay';
import GetLocation from 'react-native-get-location'
import { setAddress, } from '../../../store/actions/app';
import { updateProfileDetails } from '../../../store/actions/auth';
import { getAddressByCoordinates, getCurrentLocation, requestLocationPermission } from '../../../common/services/location';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import Config from '../../../config';
import { TIRANA_CITY_LOCATION } from '../../../config/constants';
import AppText from '../../../common/components/AppText';
import MainBtn from '../../../common/components/buttons/main_button';
import TransBtn from '../../../common/components/buttons/trans_button';
import RouteNames from '../../../routes/names';
import Svg_img from '../../../common/assets/svgs/location_illustration.svg'

class AlmostDoneScreen extends React.PureComponent {

    constructor(props) {
        super(props);
        this.props = props

        this.state = {
            loading: false,
        };
    }

    async componentDidMount() {
    }

    goSetupLocation = async () => {
        requestLocationPermission(Config.isAndroid)
            .then(() => {
                console.log('request Location Permission allowed')
                this.goSetupLocation_With_CurrentLocation()
            })
            .catch(() => {
                console.log('request Location Permission denied')
                this.goSetupLocation_With_DefaultLocation()
                // alerts.error(translate('attention'), translate('locationUnavailable'));
            });
    };

    goSetupLocation_With_DefaultLocation = () => {
        this.props.navigation.navigate(RouteNames.LocationSetupScreen, { from_home: false, coords: { latitude: TIRANA_CITY_LOCATION.latitude, longitude: TIRANA_CITY_LOCATION.longitude } });
    }

    goSetupLocation_With_CurrentLocation = async () => {
        try {
            this.setState({ loading: true })
            const location = await GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000, });
            this.setState({ loading: false });
            console.log('Got current location : ', location);
            this.props.navigation.navigate(RouteNames.LocationSetupScreen, { from_home: false, coords: { latitude: location.latitude, longitude: location.longitude } });
        }
        catch (error) {
            this.setState({ loading: false });
            const { code, message } = error;
            console.warn('goSetupLocation With CurrentLocation ', code, message);
            this.goSetupLocation_With_DefaultLocation()
        }
    };

    onLater = async () => {
        try {
            this.setState({ loading: true })
            if (this.props.isLoggedIn) {
                await this.props.updateProfileDetails({
                    latitude: TIRANA_CITY_LOCATION.latitude,
                    longitude: TIRANA_CITY_LOCATION.longitude
                })
            }

            this.setState({ loading: false });
            await this.props.setAddress({
                coordinates: {
                    latitude: TIRANA_CITY_LOCATION.latitude,
                    longitude: TIRANA_CITY_LOCATION.longitude,
                },
                address: {
                    country: TIRANA_CITY_LOCATION.country,
                    city: TIRANA_CITY_LOCATION.city,
                    street: TIRANA_CITY_LOCATION.street
                },
            });
        }
        catch (error) {
            const { code, message } = error;
            console.warn('onLater', code, message);
            this.setState({ loading: false });
            setDefaultAddress();
        }
    }

    setDefaultAddress = async () => {
        try {
            await this.props.setAddress({
                coordinates: {
                    latitude: TIRANA_CITY_LOCATION.latitude,
                    longitude: TIRANA_CITY_LOCATION.longitude,
                },
                address: {
                    country: TIRANA_CITY_LOCATION.country,
                    city: TIRANA_CITY_LOCATION.city,
                    street: TIRANA_CITY_LOCATION.street
                },
            });
        }
        catch (error) {
            console.warn('setDefaultAddress', error);
        }
    }

    render() {
        return (
            <View style={[Theme.styles.background, { backgroundColor: '#ffffff' }]}>
                <Spinner visible={this.state.loading} />
                <View style={[Theme.styles.col_center_start, styles.formview]}>
                    <Svg_img />
                    <AppText style={[Theme.styles.locationTitle, styles.title]}>
                        {translate('allmost_done.title')}
                    </AppText>
                    <AppText style={[Theme.styles.locationDescription, styles.description]}>
                        {translate('allmost_done.description')}
                    </AppText>
                </View>
                <MainBtn
                    title={translate('allmost_done.button')}
                    onPress={() => this.goSetupLocation()}
                />
                <TransBtn
                    style={{ marginTop: 10, marginBottom: 40 }}
                    title={translate('allmost_done.later')}
                    onPress={() => {
                        this.onLater()
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formview: { flex: 1, width: '100%', paddingTop: 80 },
    title: { marginTop: 25, },
    description: { marginTop: 12, marginBottom: 25, textAlign: 'center' },
})

const mapStateToProps = ({ app }) => ({
    isLoggedIn: app.isLoggedIn,
});

export default connect(mapStateToProps, {
    setAddress, updateProfileDetails
})(AlmostDoneScreen);
