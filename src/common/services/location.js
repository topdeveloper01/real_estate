import RNLocation from 'react-native-location';
import AndroidOpenSettings from 'react-native-android-open-settings';
import { Linking } from 'react-native';

import apiFactory from './apiFactory';
import Config from '../../config';
import alerts from './alerts';
import { translate } from './translate';

export const NO_PERMISSION = 'NO_PERMISSION';

export const checkLocationPermission = () => {
	return new Promise((resolve, reject) => {
		RNLocation.checkPermission({
			ios: 'whenInUse',
			android: {
				detail: 'coarse',
			},
		}).then(resolve, reject);
	});
};

export const showAlertSetting = (resolve, reject) => {
	alerts
		.confirmation('注意', '我們無法獲取您的位置信息。', 'Settings', translate('cancel'))
		.then(
			() => {
				if (Config.isAndroid) {
					AndroidOpenSettings.locationSourceSettings();
				} else {
					Linking.openURL('app-settings:');
				}
			},
			(error) => {
				reject(error);
			}
		);
};

export const requestLocationPermission = () => {  
	return new Promise((resolve, reject) => {
		RNLocation.requestPermission({
			ios: 'whenInUse',
			android: {
				detail: 'coarse',
			},
		}).then((granted) => {
			if (!granted) {
				showAlertSetting(resolve, reject);
			} else {
				resolve();
			}
		});
	});
};

export const getCurrentLocation = () => {
	return new Promise((resolve, reject) => {
		RNLocation.getLatestLocation({ timeout: 600000 }).then((location) => {

			if (location) {
				resolve(location);
			} else {
				reject({
					code: NO_PERMISSION,
				});
			}
		})
			.catch((error) => {
				reject(error);
			});
	});
};

export const getAddressByCoordinates = ({ latitude, longitude }) => {
	  
	return new Promise((resolve, reject) => {
		apiFactory(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Config.GOOGLE_MAP_API_KEY}`
		).then((res) => {
			if (res.data.results.length === 0) {
				apiFactory(
					`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${Config.API_KEY_OPEN_CAGE}`
				).then(({ data }) => {
					let addressComponents = data.results[0].components;
					let addressComponentStreet = addressComponents.road;

					if (!addressComponentStreet) {
						addressComponentStreet = addressComponents.suburb;
					} else {
						addressComponentStreet = addressComponents.road;
					}

					//Manage Translate of Pristina
					let addressComponentCity = addressComponents.city;

					if (addressComponentCity === 'Pristina') {
						addressComponentCity = 'Prishtinë';
					} else {
						addressComponentCity = addressComponents.city;
					}

					//Manage Translate of Kosovo
					let addressComponentCountry = addressComponents.country;

					if (addressComponentCountry === 'Kosovo') {
						addressComponentCountry = 'Kosove';
					} else {
						addressComponentCountry = addressComponents.country;
					}


					let address = {
						city: addressComponentCity,
						country: addressComponentCountry,
						isoCountryCode: '',
						name: addressComponentStreet,
						region: '',
						street: addressComponentStreet,
						building : addressComponents.municipality || ''
					};
					resolve(address);
				});
			} else {
				let street = '';
				let city = '';
				let building = '';
				let country = '';
				var details = res.data.results[0];
				for (let i = 0; i < details.address_components.length; i++) {
					// console.log(details.address_components[i].types, details.address_components[i].long_name) 
					//street
					if (
						details.address_components[i].types.includes('neighborhood') ||
						details.address_components[i].types.includes('route')
					) {
						street = details.address_components[i].long_name;
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

					// building
					if (
						details.address_components[i].types.includes('premise') ||
						details.address_components[i].types.includes('floor')
					) {
						building = details.address_components[i].long_name;
					}
				}
  
				let address = {
					building: building,
					street: street,
					city: city,
					country: country,
					isoCountryCode: '',
					name: street,
					region: '', 
				};
 
				resolve(address);
			}
		});
	});
};

// export const getAddressByCoordinates = ({ latitude, longitude }) => {
// 	return new Promise((resolve, reject) => {
// 		apiFactory(
// 			`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},123${longitude}12313123123123123&key=${Config.GOOGLE_MAP_API_KEY}`
// 		).then((res) => {
// 			if (res.data.results.length === 0) {
// 				apiFactory(
// 					`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${Config.API_KEY_OPEN_CAGE}`
// 				).then(({ data }) => {
// 					let addressComponents = data.results[0].components;
// 					console.log('addressComponents', addressComponents)
// 					let addressComponentStreet = addressComponents.road;

// 					if (!addressComponentStreet) {
// 						addressComponentStreet = addressComponents.suburb;
// 					} else {
// 						addressComponentStreet = addressComponents.road;
// 					}

// 					//Manage Translate of Pristina
// 					let addressComponentCity = addressComponents.city;

// 					if (addressComponentCity === 'Pristina') {
// 						addressComponentCity = 'Prishtinë';
// 					} else {
// 						addressComponentCity = addressComponents.city;
// 					}

// 					//Manage Translate of Kosovo
// 					let addressComponentCountry = addressComponents.country;

// 					if (addressComponentCountry === 'Kosovo') {
// 						addressComponentCountry = 'Kosove';
// 					} else {
// 						addressComponentCountry = addressComponents.country;
// 					}
// 					let address = {
// 						city: addressComponentCity,
// 						country: addressComponentCountry,
// 						isoCountryCode: '',
// 						name: addressComponentStreet,
// 						region: '',
// 						street: addressComponentStreet,
// 					};
// 					resolve(address);
// 				});
// 			} else {

// 				let streetName = res.data.results[0].formatted_address.split(',')[0];
// 				let cityName = res.data.results[0].address_components.filter(
// 					(x) => x.types.filter((t) => t === 'locality').length > 0
// 				)[0].short_name;
// 				let countryName = res.data.results[0].address_components.filter(
// 					(x) => x.types.filter((t) => t === 'country').length > 0
// 				)[0].long_name;
// 				let address = {
// 					city: cityName,
// 					country: countryName,
// 					isoCountryCode: '',
// 					name: streetName,
// 					region: '',
// 					street: streetName,
// 				};
// 				resolve(address);
// 			}
// 		});
// 	});
// };
