import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import Swipeout from 'react-native-swipeout';
import {
	getAddresses,
	saveAddress,
	deleteAddress,
	setTmpLocationPicked,
} from '../../../store/actions/app';
import { translate } from '../../../common/services/translate';
import { extractErrorMessage, openExternalUrl } from '../../../common/services/utility';
import alerts from '../../../common/services/alerts';
import Theme from '../../../theme';
import ConfirmModal from '../../../common/components/modals/ConfirmModal'
import MainBtn from '../../../common/components/buttons/main_button';
import Header1 from '../../../common/components/Header1';
import RouteNames from '../../../routes/names';
import AddressItem from '../../../common/components/AddressItem';

const AddressesScreen = (props) => {

	const isFromCart = props.route.params != null ? props.route.params.isFromCart == true : false;

	const [selectedAddress, setSelectedAddress] = useState(null);
	const [isConfirmModal, ShowConfirmModal] = useState(false);

	useEffect(async () => {
		try {
			await props.getAddresses()
		}
		catch (error) {
			console.log('error', error)
		}
	}, [])

	const onEditAddress = (addressItem) => {
		let tmpAddress = {
			...addressItem,
			coords: {
				latitude: addressItem.lat,
				longitude: addressItem.lng,
			},
		}
		props.setTmpLocationPicked(tmpAddress)
		props.navigation.navigate(RouteNames.NewAddressScreen, { isEdit: true, isFromCart : isFromCart})
	}

	const onSelectAddress = async (addressItem) => {
		try {
			let item = { ...addressItem };
			item.favourite = 1;
			await props.saveAddress(item);
			await props.getAddresses();

			if (isFromCart) {
				props.navigation.goBack()
			}
		}
		catch (error) {
			console.log('error', error)
			alerts.error(translate('restaurant_details.we_are_sorry'), extractErrorMessage(error));
		}
	}

	const onDeleteAddress = async () => {
		try {
			ShowConfirmModal(false)
			if (selectedAddress == null) { return ;}
			await props.deleteAddress(selectedAddress.id);
			await props.getAddresses();
		}
		catch (error) {
			console.log('error', error)
			alerts.error(translate('restaurant_details.we_are_sorry'), extractErrorMessage(error));
		}
	}

	return (
		<View style={[Theme.styles.col_center_start, { flex: 1, backgroundColor: Theme.colors.white }]}>
			<Header1
				style={{ marginTop: 10, paddingHorizontal: 20 }}
				onLeft={() => { props.navigation.goBack() }}
				title={translate('address_list.header_title')}
			/>
			<ScrollView style={styles.scrollview}>
				{
					props.addresses.map((addressItem, index) =>
						<Swipeout
							autoClose={true}
							key={index}
							disabled={addressItem.favourite == 1}
							backgroundColor={Theme.colors.white}
							style={{marginBottom: 16}}
							right={[
								{
									text: translate('address_list.delete'),
									backgroundColor: '#f44336',
									underlayColor: 'rgba(0, 0, 0, 0.6)',
									onPress: () => {
										setSelectedAddress(addressItem);
										ShowConfirmModal(true);
									},
								},
							]}
						>
							<AddressItem
								data={addressItem}
								onEdit={() => {
									onEditAddress(addressItem)
								}}
								onSelect={() => {
									onSelectAddress(addressItem)
								}} />

						</Swipeout>
					)
				}
				<View style={{ height: 20, }} />
			</ScrollView>
			<View style={{ width: '100%', paddingHorizontal: 20, marginBottom: 40 }}>
				<MainBtn
					title={translate('address_list.add_new_address')}
					onPress={() => {
						props.setTmpLocationPicked({})
						props.navigation.navigate(RouteNames.NewAddressScreen, { isEdit: false, isFromCart : isFromCart})
					}}
				/>
			</View>
			<ConfirmModal showModal={isConfirmModal}
                title={translate('address_list.delete_confirm')}
                yes={translate('address_list.delete_confirm_yes')} no={translate('address_list.delete_confirm_no')}
                onYes={onDeleteAddress}
				onClose={() => ShowConfirmModal(false)} />
		</View>
	);
}

const styles = StyleSheet.create({
	scrollview: { flex: 1, width: '100%', paddingHorizontal: 20, backgroundColor: Theme.colors.white },
	categList: { marginTop: 16, },
	scrollviewHider: { width: '100%', marginTop: -12, height: 15, backgroundColor: Theme.colors.white },

})


const mapStateToProps = ({ app }) => ({
	addresses: app.addresses || [],
});

export default connect(mapStateToProps, {
	saveAddress, getAddresses, deleteAddress, setTmpLocationPicked,
})(AddressesScreen);
