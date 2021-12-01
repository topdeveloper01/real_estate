import React from 'react';
import { FlatList, ScrollView, TouchableOpacity, View, Text, AsyncStorage, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RBSheet from 'react-native-raw-bottom-sheet';
import { throttle } from 'throttle-debounce';
import { withNavigation } from 'react-navigation';
import styles from '../styles/styles';
import { translate } from '../../../common/services/translate';
import apiFactory from '../../../common/services/apiFactory';
import VendorItem from '../../../common/components/vendors/VendorItem';
import VendorFoodItem from '../../../common/components/vendors/VendorFoodItem';
import StartItem from '../components/StartItem';
import PopularItem from '../components/PopularItem';
import { setVendorCart } from '../../../store/actions/shop';
import { AuthInput, RoundIconBtn } from '../../../common/components';
import BlockSpinner from '../../../common/components/BlockSpinner';
import Theme from '../../../theme';
import RouteNames from '../../../routes/names';

const windowHeight = Dimensions.get('window').height;
const IS_LOADING_CATEGORIES = 'isLoadingCategories';
const IS_LOADING_RESTAURANTS = 'isLoadingRestaurants';

class SearchScreen extends React.Component {
	getRestaurants = throttle(500, (text) => {
		let { latitude, longitude } = this.props.coordinates;
		const { selectedAddress } = this.props;
		if (selectedAddress && selectedAddress.id) {
			latitude = selectedAddress.lat;
			longitude = selectedAddress.lng;
		}
		this.setState({ is_loading_restaurants: true });
		apiFactory
			.get(`vendors?lat=${latitude}&lng=${longitude}&name=${text}&per_page=999`)
			.then(({ data }) => {
				this.setState({ is_loading_restaurants: false, restaurants: data.vendors.data });
			})
			.catch((error) => {
				this.setState({ is_loading_restaurants: false });
			});
	});

	getFilteredRestaurants = throttle(500, () => {
		this.setState({ modalVisible: false });
		let { latitude, longitude } = this.props.coordinates;
		const { selectedAddress } = this.props;
		if (selectedAddress && selectedAddress.id) {
			latitude = selectedAddress.lat;
			longitude = selectedAddress.lng;
		}

		let arr = [];

		this.state.filters.map((item) => {
			if (item.check === true) {
				arr.push(item);
			}
		});

		if (arr.length === 0) {
			apiFactory.get(`vendors?lat=${latitude}&lng=${longitude}&name=${this.state.text}`).then(({ data }) => {
				this.setState({ restaurants: data.vendors.data });
			});
		} else if (arr.length === 1) {
			apiFactory
				.get(`vendors?lat=${latitude}&lng=${longitude}&name=${this.state.text}&${arr[0].keyFilter}=1`)
				.then(({ data }) => {
					this.setState({ restaurants: data.vendors.data });
				});
		} else {
			apiFactory
				.get(
					`vendors?lat=${latitude}&lng=${longitude}&name=${this.state.text}&${arr[0].keyFilter}=1&${arr[1].keyFilter}=1`
				)
				.then(({ data }) => {
					this.setState({ restaurants: data.vendors.data });
				});
		}

		this.RBSheet.close();
	});

	getItems = throttle(500, (text) => {
		let { latitude, longitude } = this.props.coordinates;
		const { selectedAddress } = this.props;
		if (selectedAddress && selectedAddress.id) {
			latitude = selectedAddress.lat;
			longitude = selectedAddress.lng;
		}

		this.setState({ is_loading_items: true });
		apiFactory
			.get(`products?lat=${latitude}&lng=${longitude}&title=${text}`)
			.then(({ data }) => {
				this.setState({ is_loading_items: false, foodItems: data.products.data });
			})
			.catch((error) => {
				this.setState({ is_loading_items: false });
			});
	});

	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			foodItems: [],
			selected: '',
			modalVisible: true,
			restaurants: [],
			popularSearches: [],
			filters: [
				{
					title: translate('search.recommended'),
					check: false,
					keyFilter: 'recommended',
				},
				{
					title: translate('search.free_delivery'),
					check: false,
					keyFilter: 'free_delivery',
				},
				{
					title: translate('search.fastest'),
					check: false,
					keyFilter: 'fastest',
				},
				{
					title: translate('search.distance'),
					check: false,
					keyFilter: 'distance',
				},
			],
			recents: [],
			text: '',
			[IS_LOADING_CATEGORIES]: false,
			[IS_LOADING_RESTAURANTS]: false,
			is_loading_restaurants: null,
			is_loading_items: null,
			selectedRestaurant: {},
			restaurantSelected: false,
		};
	}

	componentDidMount() {
		this.getCategories();
		this.getPopularSearch();
		this.getRecents();
	}

	getRecents = async () => {
		let recents = await AsyncStorage.getItem('recents');
		let newrecents = JSON.parse(recents);
		if (newrecents == null) {
			this.setState({ recents: [] });
		} else {
			var filtered = newrecents.filter(function (el) {
				return el != null;
			});

			this.setState({ recents: filtered });
		}
	};

	clearAllRecents = async () => {
		try {
			await AsyncStorage.removeItem('recents');
			this.setState({ recents: [] });
		} catch (err) {
			console.log('clearAllRecents ', err);
		}
	};

	removeRecentItem = async (text) => {
		try {
			let { recents } = this.state;
			if (text) {
				var filtered = recents.filter(function (el) {
					return el != text;
				});
				await AsyncStorage.setItem('recents', JSON.stringify(filtered));
				this.setState({ recents: filtered });
			}
		} catch (err) {
			console.log('clearAllRecents ', err);
		}
	};

	getCategories = async () => {
		await this.setState({
			[IS_LOADING_CATEGORIES]: true,
		});
		apiFactory.get('vendors/food-categories').then(({ data }) => {
			this.setState({ [IS_LOADING_CATEGORIES]: false, categories: data['food_categories'] });
		});
	};

	getPopularSearch = async () => {
		await this.setState({
			[IS_LOADING_CATEGORIES]: true,
		});
		apiFactory.get('search/suggestions').then(({ data }) => {
			this.setState({ [IS_LOADING_CATEGORIES]: false, popularSearches: data['suggestions'] });
		});
	};

	search = (text) => {
		this.setState({ text });
		if (text.length > 2) {
			this.getRestaurants(text);
			this.getItems(text);
		} else {
			this.setState({ restaurants: [] });
		}
	};

	onFavChange = (data) => {
		let found_index = this.state.restaurants.findIndex((i) => i.id == data.id);

		if (found_index != -1) {
			let tmp = this.state.restaurants.slice(0, this.state.restaurants.length);
			tmp[found_index].isFav = data.isFav;
			this.setState({ restaurants: tmp });
		}
	};
	onProductFavChange = (data) => {
		let found_index = this.state.foodItems.findIndex((i) => i.id == data.id);

		if (found_index != -1) {
			let tmp = this.state.foodItems.slice(0, this.state.foodItems.length);
			tmp[found_index].isFav = data.isFav;
			this.setState({ foodItems: tmp });
		}
	};

	showSimilar = async (restaurant) => {
		let { recents } = this.state;
		this.goToRestaurantDetails(restaurant);
		let text = restaurant.title;
		if (text) {
			recents.push(text);
			if (recents.length >= 8) {
				let newrecents = recents.slice(1);
				this.setState({ recents: newrecents });
			}
			await AsyncStorage.setItem('recents', JSON.stringify(recents));
		}
	};

	goToRestaurantDetails = (vendor) => {
		this.props.setVendorCart(vendor);
		this.props.rootStackNav.navigate(RouteNames.VendorScreen);
	};

	renderSearchView = () => {
		const { restaurants, foodItems, text } = this.state;

		return (
			<View style={[Theme.styles.row_center, { width: '100%', marginBottom: 16, paddingHorizontal: 20 }]}>
				<AuthInput
					placeholder={translate('search.search_vendors_on_search')}
					underlineColorAndroid={'transparent'}
					autoCapitalize={'none'}
					returnKeyType={'done'}
					isSearch={true}
					value={this.state.text}
					onChangeText={this.search}
					style={{ flex: 1, height: 45 }}
					rightComp={
						this.state.text !== '' ? (
							<TouchableOpacity onPress={() => this.setState({ text: '' })}>
								<Icon name={'circle-with-cross'} color={'#878E97'} size={18} />
							</TouchableOpacity>
						) : null
					}
				/>
				{text.length > 2 && (restaurants.length > 0 || foodItems.length > 0) && (
					<RoundIconBtn
						style={{ marginLeft: 12, width: 45, height: 45 }}
						icon={<MaterialIcons name='filter-list' size={26} color={Theme.colors.cyan2} />}
						onPress={() => this.RBSheet.open()}
					/>
				)}
			</View>
		);
	};

	render() {
		if (this.state[IS_LOADING_CATEGORIES]) {
			return <BlockSpinner />;
		}

		const {
			filters,
			restaurants,
			selected,
			recents,
			foodItems,
			popularSearches,
			selectedRestaurant,
			restaurantSelected,
		} = this.state;
		const { text } = this.state;

		let filteredRecents = recents.filter((value, index, self) => self.indexOf(value) === index);

		let array_last_eight;
		array_last_eight = filteredRecents.slice(-8);
		filteredRecents = array_last_eight;

		return (
			<View style={[styles.searchView]}>
				<RBSheet
					ref={(ref) => (this.RBSheet = ref)}
					closeOnDragDown={true}
					duration={300}
					closeOnPressBack={true}
					height={380}
					customStyles={{
						container: {
							borderTopLeftRadius: 10,
							borderTopRightRadius: 10,
							alignItems: 'center',
						},
					}}
				>
					<View onPress={() => {}} style={{ height: '100%' }}>
						<View style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: '#fff' }}>
							<View style={{ flexDirection: 'row' }}>
								<TouchableOpacity
									onPress={() => this.RBSheet.close()}
									style={{ height: 20, width: 20, left: 15, top: 15, flex: 1, zIndex: 1 }}
								>
									<Icon name={'cross'} size={25} color={'#000'} />
								</TouchableOpacity>
								<Text
									style={{
										width: '95%',
										top: 15,
										fontSize: 16,
										textAlign: 'center',
										fontFamily: Theme.fonts.bold,
										color: '#25252D',
									}}
								>
									{translate('search.filter')}
								</Text>
							</View>
							<FlatList
								data={filters}
								style={{ marginTop: 45 }}
								renderItem={({ item, index }) => {
									return (
										<TouchableOpacity
											onPress={() => {
												let arr = filters;
												arr[index].check = !arr[index].check;
												this.setState({ filters: arr });
											}}
											style={{
												flexDirection: 'row',
												paddingVertical: 10,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<Text
												style={{
													width: '80%',
													left: 0,
													height: '100%',
													fontSize: 14,
													fontFamily: Theme.fonts.medium,
													color: '#25252D',
												}}
											>
												{item.title}
											</Text>
											<FontAwesome
												name={item.check === true ? 'check-circle' : 'circle-thin'}
												size={30}
												style={{}}
												color={item.check === true ? Theme.colors.cyan2 : 'lightgray'}
											/>
										</TouchableOpacity>
									);
								}}
							/>
							<TouchableOpacity
								onPress={() => this.getFilteredRestaurants()}
								style={{
									width: '90%',
									height: '13%',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: 5,
									bottom: '10%',
									backgroundColor: Theme.colors.cyan2,
									alignSelf: 'center',
									marginBottom: 8,
								}}
							>
								<Text style={{ color: '#fff', fontSize: 16, fontFamily: Theme.fonts.bold }}>
									{translate('search.applyFilters')}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</RBSheet>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>{this.renderSearchView()}</View>
				<ScrollView>
					{text.length > 2 && (
						<View
							style={{
								flexDirection: 'row',
								paddingHorizontal: 20,
								justifyContent: 'flex-start',
							}}
						>
							<View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 14 }}>
								<TouchableOpacity onPress={() => this.setState({ selectedRestaurant: true })}>
									<Text
										style={{
											color: selectedRestaurant ? Theme.colors.cyan2 : '#B5B5B5',
											fontSize: 16.5,
											fontFamily: Theme.fonts.medium,
										}}
									>
										{translate('search.restaurants_tab')}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{ marginLeft: 20 }}
									onPress={() => this.setState({ selectedRestaurant: false })}
								>
									<Text
										style={{
											color: !selectedRestaurant ? Theme.colors.cyan2 : '#B5B5B5',
											fontSize: 16.5,
											fontFamily: Theme.fonts.medium,
										}}
									>
										{translate('search.items_tab')}
									</Text>
								</TouchableOpacity>
							</View>
							{/* {selectedRestaurant && (
                <TouchableOpacity
                  onPress={() => this.RBSheet.open()}
                  style={{
                    flexDirection: 'row', marginTop: 14, borderRadius: 4, borderWidth: 1, borderColor: '#EBEBEB', width: 69,
                    alignItems: 'center', justifyContent: 'center', height: 24
                  }}
                >
                  <Text style={{ color: '#25252D', fontSize: 12, }}>{translate('search.filter')}</Text>
                  <MaterialIcons name={'filter-list'} color={'#000000'} size={14} style={{ marginLeft: 3 }} />
                </TouchableOpacity>
              )} */}
						</View>
					)}
					<View></View>
					{text.length < 3 ? (
						<View style={{ paddingHorizontal: 20 }}>
							<View style={[Theme.styles.row_center]}>
								<Text style={styles.subjectTitle}>{translate('search.recents')}</Text>
								<TouchableOpacity onPress={this.clearAllRecents}>
									<Text style={styles.clearallBtn}>{translate('search.clear_all')}</Text>
								</TouchableOpacity>
							</View>
							<FlatList
								data={filteredRecents.reverse()}
								keyExtractor={(item) => item}
								renderItem={({ item }) => {
									return (
										<StartItem
											title={item}
											cat='recents'
											onPress={() => this.search(item)}
											onRemove={(text) => this.removeRecentItem(text)}
										/>
									);
								}}
							/>
							<Text style={styles.subjectTitle}>{translate('search.popular')}</Text>
							<View style={styles.popularSearches}>
								{popularSearches.map((item, index) => (
									<PopularItem key={index} title={item} onPress={() => this.search(item)} />
								))}
							</View>
						</View>
					) : (
						<View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
							{selectedRestaurant ? (
								<View>
									{restaurants.length > 0 ? (
										<FlatList
											data={restaurants}
											keyExtractor={(item) => item.id.toString()}
											renderItem={({ item }) => {
												return (
													<VendorItem
														data={item}
														vendor_id={item.id}
														isFav={item.isFav}
														is_open={item.is_open}
														style={{ width: '100%', marginBottom: 12 }}
														onFavChange={this.onFavChange}
														onSelect={() => {
															this.showSimilar(item);
														}}
													/>
												);
											}}
										/>
									) : (
										this.state.is_loading_restaurants == false && (
											<View
												style={{
													height: windowHeight / 1.5,
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												<View>
													<FastImage
														source={require('../../../common/assets/images/search.png')}
														style={{
															marginBottom: 30,
															width: 40,
															height: 40,
															resizeMode: 'contain',
														}}
													/>
												</View>
												<Text
													style={{
														fontSize: 16,
														color: '#7E7E7E',
														fontFamily: Theme.fonts.medium,
													}}
												>
													{translate('search.not_found_part_one')}
												</Text>
												<Text
													style={{
														color: '#25252D',
														fontSize: 16,
														fontFamily: Theme.fonts.medium,
														marginTop: 3,
													}}
												>
													{"'" + text + "'"}
												</Text>
												<Text
													style={{
														fontSize: 16,
														color: '#7E7E7E',
														fontFamily: Theme.fonts.medium,
														marginTop: 12,
													}}
												>
													{translate('search.not_found_part_two')}
												</Text>
											</View>
										)
									)}
								</View>
							) : (
								<View>
									{foodItems.length > 0 ? (
										<FlatList
											data={foodItems}
											keyExtractor={(item) => item.id.toString()}
											renderItem={({ item }) => {
												return (
													<VendorFoodItem
														data={item}
														food_id={item.id}
														isFav={item.isFav}
														onSelect={(data) => {
															this.goToRestaurantDetails(data.vendor);
														}}
														onFavChange={this.onProductFavChange}
													/>
												);
											}}
										/>
									) : (
										this.state.is_loading_items == false && (
											<View
												style={{
													height: windowHeight / 1.5,
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												<View>
													<FastImage
														source={require('../../../common/assets/images/search.png')}
														style={{
															marginBottom: 30,
															width: 40,
															height: 40,
															resizeMode: 'contain',
														}}
													/>
												</View>
												<Text
													style={{
														fontSize: 16,
														color: '#7E7E7E',
														fontFamily: Theme.fonts.medium,
													}}
												>
													{translate('search.not_found_part_one')}
												</Text>
												<Text
													style={{
														color: '#25252D',
														fontSize: 16,
														fontFamily: Theme.fonts.medium,
														marginTop: 3,
													}}
												>
													{"'" + text + "'"}
												</Text>
												<Text
													style={{
														fontSize: 16,
														color: '#7E7E7E',
														fontFamily: Theme.fonts.medium,
														marginTop: 12,
													}}
												>
													{translate('search.not_found_part_two')}
												</Text>
											</View>
										)
									)}
								</View>
							)}
						</View>
					)}
				</ScrollView>
			</View>
		);
	}
}

function mapStateToProps({ app, vendors, shop }) {
	return {
		coordinates: app.coordinates,
		favourites: vendors.favourites,
		selectedAddress: shop.selectedAddress,
	};
}

export default connect(mapStateToProps, {
	setVendorCart,
})(withNavigation(SearchScreen));
