
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Image, ActivityIndicator, ScrollView, TouchableOpacity, Text, View, StyleSheet, RefreshControl, KeyboardAvoidingView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { width, height } from 'react-native-dimension';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { getMyListings, deleteListing } from '../../../store/actions/listings';
import Theme from '../../../theme';
import { setVendorCart } from '../../../store/actions/app';
import RouteNames from '../../../routes/names';
import { VendorItem } from '../../../common/components';
import Header1 from '../../../common/components/Header1';
import ConfirmModal from '../../../common/components/modals/ConfirmModal';
import NoRestaurants from '../../../common/components/restaurants/NoRestaurants'; 
import FilterBar from '../../../common/components/vendors/FilterVar';

const MyListingsScreen = (props) => {

	const [allvendors, setAllVendors] = useState([])

	const [vertLoading, setVertLoading] = useState(null)
	const [isRefreshing, setRefreshing] = useState(false)

	const [deleteListingItem, setDeleteListingItem] = useState(null)
	const [isDeleteConfirmModal, ShowDeleteModal] = useState(false)
	const [deleteLoading, setDeleteLoading] = useState(false)

	const [filter_type, setFilterType] = useState(-1)
	const [filter_price, setFilterPrice] = useState(-1)
	const [filter_size, setFilterSize] = useState(-1)
	const [filter_rooms, setFilterRooms] = useState(-1)

	useEffect(() => {
		loadVendors();
	}, [
		filter_type, filter_price, filter_size, filter_rooms
	])

	const getFilers = () => {
		return { searchTerm: '', filter_type, filter_price, filter_size, filter_rooms }
	}

	const loadVendors = async () => {
		try {
			setVertLoading(true);
			let filterKeys = getFilers();
			let vendorsData = await getMyListings(props.user.id, filterKeys);
			setAllVendors(vendorsData)
			setVertLoading(false);
		}
		catch (error) {
			setVertLoading(false);
			console.log('get Vendors', error)
		}
	}


	const isEmptyData = () => {
		return allvendors.length == 0
	}

	const goVendorDetail = (vendor) => {
		props.setVendorCart(vendor)
		props.navigation.navigate(RouteNames.VendorScreen)
	}

	const onDelete = () => {
		ShowDeleteModal(false)
		if (deleteListingItem == null) {
			return
		}
		setDeleteLoading(true);
		deleteListing(deleteListingItem.id).then((res) => {
			loadVendors()
			setDeleteLoading(false);
		})
			.catch(error => {
				setDeleteLoading(false);
			})
	}

	const _renderVertVendors = () => {
		return <View style={[Theme.styles.col_center_start, { width: '100%', alignItems: 'flex-start', }]}>
			{
				allvendors.map((vendor, index) =>
					<View key={vendor.id} style={[Theme.styles.col_center, { width: '100%', }]}>
						<VendorItem
							data={vendor}
							vendor_id={vendor.id}
							can_delete={true}
							style={{ width: '100%', marginRight: 0, }}
							onSelect={() => goVendorDetail(vendor)}
							onDelete={() => {
								setDeleteListingItem(vendor);
								ShowDeleteModal(true)
							}}
						/>
					</View>
				)
			}
		</View>
	}

	const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
		return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
	}

	const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
		return contentOffset.y == 0;
	}

	console.log('vertLoading ', vertLoading)
	return (
		<View style={[Theme.styles.col_center_start, { flex: 1, backgroundColor: Theme.colors.white }]}>
			<Spinner visible={deleteLoading} />
			<Header1
				onLeft={() => {
					props.navigation.goBack();
				}}
				style={{ paddingHorizontal: 20, height: 90, marginBottom: 0 }}
				title={'已上傳單位記錄'}
			/>
			<View style={{ width: '100%', paddingHorizontal: 20, }}>
				<FilterBar
					onChangeArea={(value) => { }}
					onChangeType={(value) => { setFilterType(value) }}
					onChangePrice={(value) => { setFilterPrice(value) }}
					onChangeSize={(value) => { setFilterSize(value) }}
					onChangeRooms={(value) => { setFilterRooms(value) }}
				/>
			</View>
			{
				(vertLoading == false && isEmptyData() == true) ?
					<NoRestaurants />
					:
					<KeyboardAwareScrollView
						keyboardShouldPersistTaps='handled'
						style={styles.scrollview}
						refreshControl={
							<RefreshControl
								refreshing={isRefreshing}
								onRefresh={() => {
									loadVendors();
								}}
							/>
						}
						extraHeight={50}
					>
						{
							_renderVertVendors()
						}
					</KeyboardAwareScrollView>
			}
			<ConfirmModal
				showModal={isDeleteConfirmModal}
				title={'確認刪除？'}
				yes={'刪除'}
				no={'取消'}
				onYes={onDelete}
				onClose={() => ShowDeleteModal(false)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	header: { width: '100%', paddingHorizontal: 20, height: 90, paddingTop: 40, backgroundColor: '#F7F7F7' },
	headerTitle: { flex: 1, fontSize: 20, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
	operationTab: { height: 62, width: '100%', marginTop: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F6F6F9' },
	subjectTitle: { fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	divider: { width: '100%', height: 1, backgroundColor: '#F6F6F9' },
	scrollview: { flex: 1, width: '100%', paddingHorizontal: 20, backgroundColor: Theme.colors.white },
	scrollviewHider: { width: '100%', marginTop: -12, height: 15, backgroundColor: Theme.colors.white },

	filterview: { marginTop: 16, marginBottom: 16, borderBottomColor: Theme.colors.gray4, borderBottomWidth: 1 },
	filterLabel: { fontSize: 14, fontFamily: Theme.fonts.medium, color: '#344655' },
	filterValue: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: '#344655', marginTop: 4 },

	modalContent: { width: '100%', paddingVertical: 40, paddingHorizontal: 20, backgroundColor: Theme.colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
	modalBtnTxt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
	modalCityContent: { width: '100%', height: height(90), paddingVertical: 35, backgroundColor: Theme.colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
	modalQContent: { width: '100%', paddingBottom: 35, paddingTop: 20, paddingHorizontal: 20, backgroundColor: Theme.colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
})


const mapStateToProps = ({ app,   }) => ({
	user: app.user || {},
	isLoggedIn: app.isLoggedIn,
	vendorData: app.vendorData,
});

export default connect(mapStateToProps, {
	setVendorCart,
})(MyListingsScreen);
