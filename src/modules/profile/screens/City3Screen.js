
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import Feather from 'react-native-vector-icons/Feather'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import Theme from '../../../theme';
import Header1 from '../../../common/components/Header1';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Nodata from '../../../common/components/restaurants/NoRestaurants';
import AddCityModal from '../../../common/components/modals/AddCityModal';
import { getAllCities, createCity } from '../../../store/actions/app';
import { city1_Collection, city2_Collection, city3_Collection } from '../../../common/services/firebase';
import RouteNames from '../../../routes/names';  

const City3Screen = (props) => {
	const city1_id = props.route.params.city1_id;
	const city2_id = props.route.params.city2_id;
  
	const [isAddModal, showAddModal] = useState(false)
	const [isLoading, setLoading] = useState(null)
	const [cities, setCities] = useState([])
	useEffect(() => {
		loadData()
	}, []);


	const loadData = async () => {
		try {
			setLoading(true);
			let all_items = await getAllCities(3);
			all_items = all_items.filter(item => item.city_1 == city1_id && item.city_2 == city2_id)
			setCities(all_items)
			setLoading(false);
		}
		catch (error) {
			setLoading(false);
			console.log('get Notifications ', error)
			alerts.error('警告', '出了些問題');
		}
	}

	const onDeleteCity = async (city_item) => {
		try {
			setLoading(true);
			await city3_Collection.doc(city_item.id).delete();

			let tmp = cities.filter(item => item.id != city_item.id)
			setCities(tmp);
			setLoading(false);
		}
		catch (error) {
			setLoading(false);
			console.log('onDeleteCity ', error);
			alerts.error('警告', '出了些問題');
		}
	}

	const onAddCity= async (text)=>{
		showAddModal(false)
		try {
			setLoading(true);
			let data = {
				city_1 : city1_id,
				city_2 : city2_id,
				name: text
			}
			await createCity(3, data);
			setLoading(false);
			loadData()
		}
		catch (error) {
			setLoading(false);
			console.log('onAddCity ', error)
			alerts.error('警告', '出了些問題');
		}
	}

	return (
		<View style={styles.container}>
			<Spinner visible={isLoading == true} />
			<Header1
				onLeft={() => {
					props.navigation.goBack();
				}}
				style={{ paddingHorizontal: 20, height: 90 }}
				title={props.route.params.title}
				right={<MaterialIcons name={'add-circle-outline'} color={Theme.colors.text} size={26} />}
				onRight={() => {
					showAddModal(true)
				}}
			/>
			<View style={styles.formView}>
				{
					isLoading == false && cities.length == 0 ? <Nodata />
						:
						<KeyboardAwareScrollView style={[{ flex: 1, width: '100%', paddingHorizontal: 10 }]} extraScrollHeight={25} keyboardShouldPersistTaps='handled'>
							<View style={[Theme.styles.col_center_start, { width: '100%', paddingHorizontal: 8, alignItems: 'flex-start', }]}>
								{
									cities.map((item) =>
										<TouchableOpacity 
											key={item.id}
											activeOpacity={1} 
											style={[Theme.styles.row_center, styles.itemContainer]} 
											onPress={() => { 
											}}>
											<TouchableOpacity onPress={()=>onDeleteCity(item)}>
												<MaterialCommunityIcons name={'delete-outline'} color={Theme.colors.text} size={28} />
											</TouchableOpacity>
											<Text style={styles.name}>
													{item.name}
												</Text>
												<Feather name='chevron-right' color={Theme.colors.text} size={24}/>
										</TouchableOpacity>
									)
								}
							</View>
						</KeyboardAwareScrollView>
				}
			</View>
			<AddCityModal 
				title={'地區 3'}
				onSave={onAddCity} 
				showModal={isAddModal}
				onClose={()=>{
					showAddModal(false)
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: Theme.colors.white,
	},
	header: {
		width: '100%',
		height: 78,
		elevation: 6,
		paddingBottom: 8,
		marginBottom: 24,
		alignItems: 'flex-end',
		flexDirection: 'row',
	},
	formView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
	},
	itemContainer: {
		width: '100%',
        backgroundColor: Theme.colors.white,
        paddingVertical: 12,
		paddingHorizontal: 16,
        borderBottomColor: '#808080aa',
        borderBottomWidth: 1
	},
	name : {
		flex : 1,
		marginLeft: 12,
		fontSize: 16,
		fontFamily: Theme.fonts.bold,
		color: Theme.colors.text
	}
});

const mapStateToProps = ({ app }) => ({
	user: app.user,
});

export default connect(mapStateToProps, {
})(City3Screen);
