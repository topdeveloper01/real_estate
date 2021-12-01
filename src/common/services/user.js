import { isEmpty } from '../../common/services/utility';
import { getAddressByCoordinates, checkLocationPermission } from '../../common/services/location';
import { setStorageKey, getStorageKey, KEYS } from '../../common/services/storage';
import { TIRANA_CITY_LOCATION } from "../../config/constants";
import GetLocation from 'react-native-get-location'

export const loadUserSetting = async (props, logged_user_data) => {
    try {

        let address = null;
        let location = await getStorageKey(KEYS.LAST_COORDINATES);
        if (location) {
            try {
                let hasPermission = await checkLocationPermission();
                if (hasPermission) {
                    console.log('checkLocationPermission : True, get current position')
                    location = await GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000, });
                }
                else {
                    console.log('checkLocationPermission : False')
                }
            }
            catch (error) {
                console.log('checkLocationPermission : ', error)
            }

            address = await getAddressByCoordinates(location);
            await props.setAddress({
                coordinates: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
                address,
            });
        }

        if (logged_user_data != null && location) {
            if (isEmpty(logged_user_data.latitude) || isEmpty(logged_user_data.longitude)) { // for old users
                await props.updateProfileDetails({
                    latitude: location.latitude,
                    longitude: location.longitude
                })
            }
            if (address != null) {
                let address_data = {
                    lat: location.latitude,
                    lng: location.longitude,
                    country: address.country || TIRANA_CITY_LOCATION.country,
                    city: address.city || TIRANA_CITY_LOCATION.city,
                    street: address.street || TIRANA_CITY_LOCATION.street
                }
                await props.addDefaultAddress(address_data);
            }
        }

        if (logged_user_data != null) {
            props.getAddresses();
            props.setAsLoggedIn();
        }

        await props.setUserNeedLogin(false);
    }
    catch (error) {
        console.log('load User Setting error : ', error)
    }
}
