import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { height, width } from 'react-native-dimension';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Theme from '../../../theme';
import { getAddressByCoordinates } from '../../../common/services/location';
import { translate } from '../../../common/services/translate';
import { saveAddress, setTmpLocationPicked } from '../../../store/actions/app';
import MainBtn from '../../../common/components/buttons/main_button';
import AuthInput from '../../../common/components/AuthInput';
import RoundIconBtn from '../../../common/components/buttons/round_icon_button';
import AutoLocInput from '../../../common/components/AutoLocInput';
import { SocialMapScreenStyles } from '../../../config/constants';
// svgs
import Svg_pin from '../../../common/assets/svgs/ic_locpin1.svg';

class AddressMapScreen extends React.Component {
	constructor(props) {
		super(props);

		const coords = props.route.params.coords;
		if (coords.latitude) {
			coords.latitude = parseFloat(coords.latitude);
		}
		if (coords.longitude) {
			coords.longitude = parseFloat(coords.longitude);
		}

		this.state = {
			coords,
			street: props.route.params.street || '',
			building: props.route.params.building || '',
			country: '',
			city: '',
		};
	}

	async componentDidMount() {
		const { coords, building } = this.state;
		if (building == '') {
			await this.setAddressByCoordinates(coords);
		}
	}

	setAddressByCoordinates = async (locationObj) => {
		const address = await getAddressByCoordinates(locationObj);
		console.log('address', address);
		await this.setState({
			coords: locationObj,
			street: address.street,
			building: address.building,
			country: address.country,
			city: address.city,
		});
	};

	onMarkerDragEnd = async (evt) => {
		this.setAddressByCoordinates({
			latitude: evt.nativeEvent.coordinate.latitude,
			longitude: evt.nativeEvent.coordinate.longitude,
		});
	};

	getCurrentLoc = async () => {
		try {
			const location = await GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
			if (location) {
				const address = await getAddressByCoordinates(location);
				if (address) {
					let tmpAddress = {
						coords: {
							latitude: location.latitude,
							longitude: location.longitude,
						},
						street: address.street,
						building: address.building,
						country: address.country,
						city: address.city,
					};
					props.setTmpLocationPicked({
						...props.tmp_new_address,
						...tmpAddress,
					});
				}
			}
		} catch (error) {
			const { code, message } = error;
			console.warn('onLater', code, message);
			// alerts.error(translate('restaurant_details.we_are_sorry'), extractErrorMessage(error));
		}
	};

	onPickAddress = () => {
		const { street, building, country, city, coords } = this.state;
		let tmpAddress = {
			coords: coords,
			street: street,
			building: building,
			country: country,
			city: city,
		};
		this.props.setTmpLocationPicked({
			...this.props.tmp_new_address,
			...tmpAddress,
		});
		setTimeout(() => {
			this.props.navigation.goBack();
		}, 300);
	};

	renderAddressInput = () => {
		return (
			<View style={[Theme.styles.col_center, styles.bottomView]}>
				<View style={[Theme.styles.col_center, styles.locationSearchView]}>
					<AutoLocInput
						onChange={(location, address) => {
							this.setState({
								coords: {
									latitude: location.latitude,
									longitude: location.longitude,
								},
								street: address.street,
								building: address.building,
								country: address.country,
								city: address.city,
							});
						}}
					/>
				</View>
				<MainBtn
					title={translate('address_new.add_address')}
					style={styles.mainBtn}
					onPress={() => {
						this.onPickAddress();
					}}
				/>
			</View>
		);
	};

	renderMap = () => {
		const { latitude, longitude } = this.state.coords;
		if (latitude == null || longitude == null) {
			return null;
		}

		let marker = <Svg_pin />;
		return (
			<MapView
				customMapStyle={SocialMapScreenStyles}
				provider={PROVIDER_GOOGLE}
				style={{ height: height(100) - 100, width: width(100) }}
				region={{
					latitude: latitude,
					longitude: longitude,
					latitudeDelta: 0.032,
					longitudeDelta: 0.039,
				}}
				onPress={() => Keyboard.dismiss()}
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

	_renderHeader = () => {
		return (
			<View style={[Theme.styles.row_center, styles.header]}>
				<RoundIconBtn
					style={styles.headerBtn}
					icon={<Feather name='chevron-left' size={22} color={Theme.colors.text} />}
					onPress={() => {
						this.props.navigation.goBack();
					}}
				/>
				<View style={[Theme.styles.row_center_end, { flex: 1, alignItems: 'flex-end' }]}>
				</View>
			</View>
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
				<View style={{ flex: 1, height: height(100) }}>
					{this.renderMap()}
					{this.renderAddressInput()}
					{this._renderHeader()}
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
	header: {
		width: width(100),
		padding: 20,
		position: 'absolute',
		top: 40,
		alignItems: 'flex-start',
	},
	headerBtn: { width: 45, height: 45, marginRight: 20, borderRadius: 8, backgroundColor: Theme.colors.white },
	bottomView: {
		width: width(100),
		elevation: 4,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		padding: 20,
		paddingBottom: 40,
		position: 'absolute',
		bottom: 0,
		backgroundColor: Theme.colors.white,
	},
	locationSearchView: {
		// height: 132,
		width: '100%',
		borderRadius: 15,
		backgroundColor: Theme.colors.white,
		alignItems: 'stretch',
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
	mainBtn: { width: '100%', marginTop: 16 },
	skipBtn: { position: 'absolute', top: 45, right: 25 },
	locPin: { height: 42, width: 28, marginRight: 5 },
});

function mapStateToProps({ app }) {
	return {
		coordinates: app.coordinates,
		tmp_new_address: app.tmp_new_address,
	};
}

export default connect(mapStateToProps, {
	saveAddress,
	setTmpLocationPicked,
})(AddressMapScreen);
