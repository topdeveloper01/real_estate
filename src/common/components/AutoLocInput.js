import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import GetLocation from 'react-native-get-location'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Feather from 'react-native-vector-icons/Feather'
import { translate } from '../services/translate';
import alerts from '../services/alerts';
import Theme from '../../theme';
import Config from '../../config';
import {
    getAddressByCoordinates,
    requestLocationPermission,
    checkLocationPermission,
    showAlertSetting,
} from '../services/location';
// svgs 
import Svg_locpin from '../assets/svgs/msg/current_location.svg';


const AutoLocInput = ({ onChange, language, address_text, left_icon, placeholder }) => {
    const autoMapInput = useRef(null);

    useEffect(() => {
        if (autoMapInput != null && autoMapInput.current != null && address_text != null) {
            autoMapInput.current.setAddressText(address_text)
        }
    }, [address_text])

    const onChangeInput = (location, address) => {
        console.log('onchange input', location, address)
        onChange(location, address)
        if (autoMapInput != null && autoMapInput.current != null) {
            let text = address.street || '';
            if (address.city != null && address.city != '') {
                text = `${text} ${address.city}`
            }
            if (address.country != null && address.country != '') {
                text = `${text}, ${address.country}`
            }
            autoMapInput.current.setAddressText(text)
        }
    }

    const getCurrentLoc = async () => {
        try {
            let hasPermission = await checkLocationPermission();
            if (hasPermission) {
                console.log('checkLocationPermission : True, get current position')
                getCurrentPosition()
            }
            else {
                console.log('checkLocationPermission : False')
                requestLocationPermission()
                    .catch(() => {
                        alerts.error(translate('attention'), translate('locationUnavailable'));
                    });
            }
        }
        catch (error) {
            console.log('checkLocationPermission : ', error)
            alerts.error(translate('attention'), translate('locationUnavailable'));
        }
    }

    const getCurrentPosition = async () => {
        try {
            const location = await GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000, });
            if (location) {
                const address = await getAddressByCoordinates(location);
                if (address) {
                    onChangeInput(location, address);
                }
            }
        } catch (error) {
            const { code, message } = error;
            console.warn('onLater', code, message);
            alerts.error(translate('attention'), translate('locationUnavailable'));
        }
    }

    return <View style={[Theme.styles.row_center_start, styles.locationSearch]}>
        {left_icon ? left_icon : <Feather name="search" size={18} style={{ marginTop: 12 }} color={Theme.colors.gray6} />}
        <GooglePlacesAutocomplete
            ref={autoMapInput}
            placeholder={placeholder ? placeholder : translate('search_location.search_location')}
            minLength={2}
            autoFocus={false}
            returnKeyType={'default'}
            fetchDetails={true}
            listViewDisplayed={false}
            scrollEnabled={true}
            query={{
                key: Config.GOOGLE_MAP_API_KEY, 
                components: 'country:hk',
                types: 'geocode',
            }}
            onFail={error => console.error('google place auto complete error', error)}
            onPress={(data, details = null) => {
                let street = '';
                let city = '';
                let country = '';
                let building = '';
                for (let i = 0; i < details.address_components.length; i++) {
                    // console.log(details.address_components[i].types, details.address_components[i].long_name)
                    // console.log('details.geometry.location', details.geometry.location)
                    if (
                        details.address_components[i].types.includes('neighborhood') ||
                        details.address_components[i].types.includes('route')
                    ) {
                        street = details.address_components[i].long_name;
                    }
                    // building
                    if (
                        details.address_components[i].types.includes('premise') ||
                        details.address_components[i].types.includes('floor')
                    ) {
                        building = details.address_components[i].long_name;
                    }
                    // city
                    if (
                        details.address_components[i].types.includes('locality') ||
                        details.address_components[i].types.includes('postal_town')
                    ) {
                        city = details.address_components[i].long_name;
                    }
                    // country
                    if (details.address_components[i].types.includes('country')) {
                        country = details.address_components[i].long_name;
                    }
                }

                onChangeInput(
                    {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng
                    },
                    {
                        street: street,
                        building: building,
                        country: country,
                        city: city
                    }
                );
            }}
            styles={{
                container: {
                },
                textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                },
                textInput: [
                    {
                        fontSize: 14,
                        marginTop: 4,
                        minHeight: 40,
                        marginLeft: 0,
                    },
                ],
                predefinedPlacesDescription: {
                    fontSize: 14,
                    color: Theme.colors.gray5,
                    fontFamily: Theme.fonts.medium,
                },
            }}
        />
        <TouchableOpacity onPress={getCurrentLoc} style={[Theme.styles.row_center, styles.locPin]}>
            <Svg_locpin width={18} height={18} />
        </TouchableOpacity>
    </View>;
};

const styles = StyleSheet.create({
    locationSearch: { 
        borderWidth: 1,
        borderColor: Theme.colors.gray3,
        borderRadius: 12,
        width: '100%', 
        paddingLeft: 10,
        paddingVertical: 3,
        backgroundColor: Theme.colors.white,
        marginBottom: 12,
    },
    locPin: { height: 42, width: 28, marginRight: 5, },
})


function mapStateToProps({ app }) {
    return {
        language: app.language,
        coordinates: app.coordinates,
    };
}

export default connect(mapStateToProps, {
})(AutoLocInput);
