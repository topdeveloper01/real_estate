import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Image, ActivityIndicator, ScrollView, TouchableOpacity, Text, View, StyleSheet, RefreshControl, KeyboardAvoidingView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { width, height } from 'react-native-dimension';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import {
    setHomeVendorFilter, setHomeVendorSort
} from '../../../store/actions/app';
import { getFavourites, getFeaturedBlocks, getVendors, getFoodCategories, toggleFavourite } from '../../../store/actions/vendors';
import { setVendorCart } from '../../../store/actions/shop';
import { extractErrorMessage, getImageFullURL, openExternalUrl, } from '../../../common/services/utility';
import { translate } from '../../../common/services/translate';
import { SNAPFOOD_CITYS, VSort_Title, VSort_Closest, VSort_FastDelivery, VSort_HighRating, VSort_Low2HighPrice, VSort_PopularFirst } from '../../../config/constants';
import Theme from '../../../theme';
import RouteNames from '../../../routes/names';
import { OrderType_Delivery, OrderType_Pickup, OrderType_Reserve } from '../../../config/constants'
import { AuthInput, AppBadge, MainBtn, RoundIconBtn, ImageCarousel, VendorItem, SwitchTab } from '../../../common/components';
import FeatureList from '../components/FeatureList';
import Switch from '../components/Switch';
import CategItem from '../components/CategItem';
import HomeHeader from '../components/HomeHeader';
import BlockSpinner from '../../../common/components/BlockSpinner';
import NoRestaurants from '../../../common/components/restaurants/NoRestaurants';


const expectedBlocks = [
    { key: 'suggested', icon: 'top' },
    { key: 'new', icon: 'new' },
    { key: 'exclusive', icon: 'collision' },
    // { key: 'free_delivery', icon: null },
    // { key: 'all', icon: null },
];
const vertPerPage = 10;

const HomePage = (props) => {

    const catsLoaded = useRef(false);
    const featureLoaded = useRef(false);
    const vendorsLoaded = useRef(false);

    const foodCategID = useRef(null);

    const [curFoodCatID, setCurFoodCatID] = useState(null);

    const [foodCategories, setFoodCats] = useState([])
    const [featuredBlocks, setFeaturedBlocks] = useState([])
    const [allvendors, setAllVendors] = useState([])

    const [dataLoading, setDataLoading] = useState(null)
    const [showCateg, setShowCateg] = useState(false)

    const [vertLoading, setVertLoading] = useState(false)

    const [isRefreshing, setRefreshing] = useState(false)

    const [vertPage, setVertPage] = useState(1)
    const [vertTotalPages, setVertTotalPages] = useState(1)

    useEffect(() => {
        loadData(true);
        foodCategID.current = null;
        setCurFoodCatID(null);
    }, [
        props.home_vendor_filter.vendor_type,
        props.home_vendor_filter.order_type,
        props.coordinates.latitude,
        props.coordinates.longitude,
    ])

    useEffect(() => {
        if (dataLoading == false) {
            loadVendors(1, vertPerPage, true);
        }
    }, [
        props.home_vendor_filter.is_meal,
        props.home_vendor_filter.is_dietary,
        props.home_vendor_filter.ongoing_offer,
        props.home_vendor_filter.open_now,
        props.home_vendor_filter.online_payment,
        props.home_vendor_filter.searchTerm,
        props.home_vendor_filter.low_fee,
        props.home_vendor_filter.high_fee,
        props.home_vendor_sort,
    ])

    useEffect(() => {
        if (dataLoading == false) {
            onFavChange(props.vendorData)
        }
    }, [props.vendorData.isFav])

    const goRootStackScreen = (name, params) => {
        if (params) {
            props.rootStackNav.navigate(name, params)
        }
        else {
            props.rootStackNav.navigate(name)
        }
    }
    const goTabStackScreen = (name) => {
        props.homeTabNav.navigate(name);
    }

    const getFilers = (flag) => {

        const { vendor_type, order_type, is_meal, is_dietary, ongoing_offer, open_now, online_payment, low_fee, high_fee, searchTerm } = props.home_vendor_filter;
        let filters = []
        if (vendor_type == 'Vendors') {
            filters.push("vendor_type=Restaurant")
        }
        else {
            filters.push("vendor_type=Grocery")
        }
        filters.push("order_method=" + order_type)

        if (flag == 1) {
            return filters;
        }

        if (foodCategID.current != null) {
            filters.push(`food_category_ids[]=${foodCategID.current}`);
        }
        if (flag == 2) {
            return filters;
        }
        if (is_meal) {
            filters.push("is_meal=1")
        }
        if (is_dietary) {
            filters.push("is_dietary=1")
        }
        if (ongoing_offer) {
            filters.push("promotions=1")
        }
        if (open_now) {
            filters.push("open_now=1")
        }
        if (online_payment) {
            filters.push("online_payment=1")
        }
        if (low_fee != null) {
            filters.push(`low_fee=${low_fee}`)
        }
        if (high_fee != null) {
            filters.push(`high_fee=${high_fee}`)
        }
        if (searchTerm != '') {
            filters.push("name=" + searchTerm)
        }
        return filters;
    }

    const getSortDir = (sort_type) => {
        if (sort_type == VSort_Title) {
            return 1;
        }
        else if (sort_type == VSort_FastDelivery) {
            return 1;
        }
        else if (sort_type == VSort_HighRating) {
            return -1;
        }
        else if (sort_type == VSort_Closest) {
            return 1;
        }
        else if (sort_type == VSort_Low2HighPrice) {
            return 1;
        }
        else if (sort_type == VSort_PopularFirst) {
            return -1;
        }
        else {
            return 1;
        }
    }

    const loadData = async (includeCatLoad = false, isHomeRefresh = false) => {
        if (isHomeRefresh) {
            setRefreshing(true);
        }
        else {
            setDataLoading(true);
        }

        setShowCateg(includeCatLoad == false);
        if (includeCatLoad) {
            loadCategories();
        }
        loadVendors(1, vertPerPage, true);
        loadFeaturedBlocks();
    };

    const loadCategories = async () => {
        try {
            catsLoaded.current = false;
            let formattedFoodCategories = [];
            let categs_filterKeys = getFilers(1);
            let categs_response = await getFoodCategories(categs_filterKeys);
            if (!!categs_response && !!categs_response.food_categories && !!categs_response.food_categories.length >= 0) {
                formattedFoodCategories = categs_response.food_categories.map(
                    ({ icon, id, search_count, title_en, title_sq, image }) => ({
                        id,
                        icon,
                        title_en,
                        title_sq,
                        image,
                        selected: false,
                    })
                );
            }

            catsLoaded.current = true;
            setFoodCats(formattedFoodCategories);
            checkDataLoading();
        }
        catch (error) {
            catsLoaded.current = true;
            checkDataLoading();
            console.log('get Food Categories', error)
        }
    }

    const loadVendors = async (page, perPage, forceLoading = false) => {
        try {
            if (!vertLoading || forceLoading) {
                vendorsLoaded.current = false;
                if (forceLoading) {
                    setVertLoading(true);
                }
                let { latitude, longitude } = props.coordinates;
                let filterKeys = getFilers();
                let order_dir = getSortDir(props.home_vendor_sort);

                let vendorsData = await getVendors(page, latitude, longitude, props.home_vendor_sort, order_dir, perPage, filterKeys);

                if (page > 1) {
                    const currentVendorIds = allvendors.map((x) => x.id);
                    const newVendors = vendorsData.data.filter((x) => currentVendorIds.indexOf(x.id) === -1);
                    setVertPage(vendorsData['current_page']);
                    setVertTotalPages(vendorsData['last_page']);
                    setAllVendors([...allvendors, ...newVendors])
                } else {
                    setVertPage(vendorsData['current_page']);
                    setVertTotalPages(vendorsData['last_page']);
                    setAllVendors(vendorsData.data);
                }
                vendorsLoaded.current = true;
                setVertLoading(false);
                checkDataLoading();
            }
        }
        catch (error) {
            vendorsLoaded.current = true;
            setVertLoading(false);
            checkDataLoading();
            console.log('get Vendors', error)
        }
    }

    const loadFeaturedBlocks = async () => {
        try {
            featureLoaded.current = false;
            let { latitude, longitude } = props.coordinates;
            let filterKeys = getFilers(2);
            let _featuredBlocks = await props.getFeaturedBlocks(latitude, longitude, filterKeys);
            setFeaturedBlocks(_featuredBlocks);
            featureLoaded.current = true;
            checkDataLoading();
        }
        catch (error) {
            featureLoaded.current = true;
            checkDataLoading();
            console.log('load Featured Blocks ', error)
        }
    };

    const isEmptyData=()=>{
        let featured_cnt = 0;
        expectedBlocks.map(({ key, icon }) => {
            if (featuredBlocks[key] && featuredBlocks[key].vendors) {
                featured_cnt = featured_cnt + featuredBlocks[key].vendors.length;
            }
        })
        return (featured_cnt == 0 && allvendors.length == 0 ) 
    }

    const checkDataLoading = () => {
        if (catsLoaded.current == true && featureLoaded.current == true && vendorsLoaded.current == true) {
            setDataLoading(false);
            setRefreshing(false);
        }
    }

    const goVendorDetail = (vendor) => {
        props.setVendorCart(vendor)
        goRootStackScreen(RouteNames.VendorScreen)
    }

    const onFavChange = (data) => {
        console.log('onFavChange onFavChange')
        let found_all_index = allvendors.findIndex(i => i.id == data.id)
        if (found_all_index != -1) {
            let tmp = allvendors.slice(0, allvendors.length)
            tmp[found_all_index].isFav = data.isFav
            setAllVendors(tmp)

            console.log('fave change', data.title, data.isFav)
        }

        let _featuredBlocks = Object.assign({}, featuredBlocks);

        expectedBlocks.map(({ key, icon }) => {
            if (_featuredBlocks[key] != null && _featuredBlocks[key].vendors != null && _featuredBlocks[key].vendors.length > 0) {
                let found_index = _featuredBlocks[key].vendors.findIndex(i => i.id == data.id)
                if (found_index != -1) {
                    _featuredBlocks[key].vendors[found_index].isFav = data.isFav;
                }
            }
        })
        setFeaturedBlocks(_featuredBlocks);
    }

    const _renderCategories = () => {
        return <View style={[Theme.styles.col_center, (foodCategories != null && foodCategories.length > 0) && { marginTop: 16 }]}>
            <ScrollView
                horizontal={true}
                style={{ width: '100%', paddingBottom: ((foodCategories != null && foodCategories.length > 0) ? 12 : 6), }}
            >
                {
                    foodCategories.map((cat, index) =>
                        <CategItem
                            key={cat.id}
                            category={cat}
                            cat_id={cat.id}
                            isSelected={curFoodCatID == cat.id}
                            onSelect={(categ) => {
                                if (foodCategID.current == categ.id) {
                                    foodCategID.current = null;
                                    setCurFoodCatID(null);
                                }
                                else {
                                    foodCategID.current = categ.id;
                                    setCurFoodCatID(categ.id);
                                }
                                loadData(false);
                            }} />
                    )
                }
            </ScrollView>
            <View style={styles.scrollviewHider} />
        </View>

    }

    const _renderFeatureBlocks = () => {
        return <View style={{ width: '100%', marginTop: 8, }}>
            {
                expectedBlocks.map(({ key, icon }) => {
                    if ((featuredBlocks[key] && featuredBlocks[key].block && featuredBlocks[key].block['is_active'])) {
                        const restaurants = featuredBlocks[key].vendors;
                        if (!restaurants || restaurants.length === 0) {
                            return null;
                        }
                        return <FeatureList
                            key={key}
                            label={props.language == 'sq' ? featuredBlocks[key].block.title_sq : featuredBlocks[key].block.title_en}
                            items={restaurants}
                            onFavChange={onFavChange}
                            goVendorDetail={(vendor) => {
                                goVendorDetail(vendor)
                            }}
                        />
                    }
                })
            }
        </View>
    }

    const _renderSearchView = () => {
        if (dataLoading != false) { return null; }
        return <View style={[Theme.styles.row_center, { width: '100%', marginBottom: 20 }]}>
            <AuthInput
                placeholder={props.home_vendor_filter.vendor_type == 'Vendors' ? translate('search.search_vendors') : translate('search.search_grocery')}
                underlineColorAndroid={'transparent'}
                autoCapitalize={'none'}
                returnKeyType={'done'}
                isSearch={true}
                value={props.home_vendor_filter.searchTerm}
                onChangeText={(searchTerm) => {
                    props.setHomeVendorFilter({
                        searchTerm: searchTerm
                    })
                }}
                style={{ flex: 1, height: 45, marginRight: 12, }}
                rightComp={props.home_vendor_filter.searchTerm !== '' ? (
                    <TouchableOpacity onPress={() => {
                        props.setHomeVendorFilter({
                            searchTerm: ''
                        })
                    }}>
                        <Entypo name={'circle-with-cross'} color={'#878E97'} size={18} />
                    </TouchableOpacity>
                ) : null}
            />
            <RoundIconBtn style={{ width: 45, height: 45 }} icon={<MaterialIcons name='filter-list' size={26} color={Theme.colors.cyan2} />}
                onPress={() => goRootStackScreen(RouteNames.FilterScreen)} />
        </View>
    }

    const _renderVertVendors = () => {
        if (dataLoading == false && allvendors.length == 0) {
            if (props.home_vendor_filter.searchTerm == null || props.home_vendor_filter.searchTerm == '') {
                return <NoRestaurants desc={
                    props.home_vendor_filter.vendor_type == 'Vendors' ? translate('no_restaurant_filter') : translate('no_grocery_filter')}
                    style={{ marginVertical: 20, paddingBottom: 100 }}
                />
            }
            return <NoRestaurants desc={
                props.home_vendor_filter.vendor_type == 'Vendors' ? translate('no_restaurant_search') : translate('no_grocery_search')}
                style={{ marginVertical: 20 , paddingBottom: 100}}
            />
        }

        return <View style={[Theme.styles.col_center_start, { width: '100%', alignItems: 'flex-start', }]}>
            <Text style={styles.subjectTitle}>
                {props.home_vendor_filter.vendor_type == 'Vendors' ? translate('all_vendors') : translate('all_grocery')}
            </Text>
            <ScrollView
                style={{ width: '100%', marginTop: 16, }}
            >
                {
                    allvendors.map((vendor, index) =>
                        <View key={vendor.id} style={[Theme.styles.col_center, { width: '100%', }]}>
                            <VendorItem
                                data={vendor}
                                vendor_id={vendor.id}
                                isFav={vendor.isFav}
                                is_open={vendor.is_open}
                                style={{ width: '100%', marginBottom: 16, marginRight: 0, }}
                                onFavChange={onFavChange}
                                onSelect={() => goVendorDetail(vendor)}
                            />
                        </View>
                    )
                }
            </ScrollView>
        </View>
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }

    const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return contentOffset.y == 0;
    }

    return (
        <View style={[Theme.styles.col_center_start, { flex: 1, backgroundColor: Theme.colors.white }]}>
            <HomeHeader
                curTab={props.home_vendor_filter.vendor_type}
                coordinates={props.coordinates}
                isLoggedIn={props.isLoggedIn}
                cashback_amount={props.user.cashback_amount}
                photo={props.user.photo}
                onLocationSetup={(coordinates) => {
                    goRootStackScreen(RouteNames.LocationSetupScreen, { from_home: true, coords: coordinates })
                }}
                onGoWallet={() => {
                    goRootStackScreen(RouteNames.WalletScreen)
                }}
                onGoProfile={() => {
                    goTabStackScreen(RouteNames.ProfileStack)
                }}
                onTabChange={(item) => {
                    props.setHomeVendorFilter({
                        order_type: OrderType_Delivery,
                    })
                    setTimeout(() => {
                        props.setHomeVendorFilter({
                            vendor_type: item
                        })
                    }, 200);
                }}
            />
            <View style={{ width: '100%', paddingHorizontal: 20, }}>
                <View style={[Theme.styles.row_center, styles.operationTab]}>
                    <SwitchTab
                        curitem={props.home_vendor_filter.order_type}
                        items={props.home_vendor_filter.vendor_type == 'Vendors' ? [OrderType_Delivery, OrderType_Pickup, OrderType_Reserve] : [OrderType_Delivery, OrderType_Pickup]}
                        onSelect={(item) => {
                            setTimeout(() => {
                                props.setHomeVendorFilter({
                                    order_type: item
                                })
                            }, 200);
                        }}
                        style={{ width: '100%' }}
                    />
                </View>
            </View>
            {
                (dataLoading == false && isEmptyData() == true) ?
                    <NoRestaurants />
                    :
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps='handled'
                        style={styles.scrollview}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    loadData(true, true);
                                }}
                            />
                        }
                        onScroll={({ nativeEvent }) => {
                            if (isCloseToTop(nativeEvent)) {
                                loadVendors(1, vertPerPage)
                            }
                            if (isCloseToBottom(nativeEvent)) {
                                if (vertPage < vertTotalPages) {
                                    console.log('isCloseToBottom : load Next Vendors', vertPage + 1, vertPerPage)
                                    loadVendors(vertPage + 1, vertPerPage)
                                }
                            }
                        }}
                        extraHeight={50}
                    >
                        {_renderCategories()}
                        {_renderFeatureBlocks()}
                        {_renderSearchView()}
                        {
                            !isRefreshing && vertLoading ?
                                <BlockSpinner style={{ minHeight: 80, paddingBottom : 260}} /> :
                                _renderVertVendors()
                        }
                        {
                            vertLoading == false && (vertPage < vertTotalPages) &&
                            <ActivityIndicator size='small' color={Theme.colors.cyan2} style={{ paddingVertical: 10, }} />
                        }
                    </KeyboardAwareScrollView>
            }
            {
                dataLoading != false &&
                <View style={{ height: (height(100) - 154 - (showCateg ? 120 : 0)), width: '100%', backgroundColor: Theme.colors.white, position: 'absolute', left: 0, top: (showCateg ? 274 : 154) }}>
                    <BlockSpinner />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    operationTab: { height: 62, width: '100%', marginTop: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F6F6F9' },
    subjectTitle: { fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
    divider: { width: '100%', height: 1, backgroundColor: '#F6F6F9' },
    scrollview: { flex: 1, width: '100%', paddingHorizontal: 20, backgroundColor: Theme.colors.white },
    scrollviewHider: { width: '100%', marginTop: -12, height: 15, backgroundColor: Theme.colors.white },
    modalContent: { width: '100%', paddingVertical: 40, paddingHorizontal: 20, backgroundColor: Theme.colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    modalBtnTxt: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
    modalCityContent: { width: '100%', height: height(90), paddingVertical: 35, backgroundColor: Theme.colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    modalQContent: { width: '100%', paddingBottom: 35, paddingTop: 20, paddingHorizontal: 20, backgroundColor: Theme.colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
})


const mapStateToProps = ({ app, shop }) => ({
    user: app.user || {},
    isLoggedIn: app.isLoggedIn,
    coordinates: app.coordinates,
    address: app.address || {},
    language: app.language,
    home_vendor_filter: app.home_vendor_filter,
    home_vendor_sort: app.home_vendor_sort,
    vendorData: shop.vendorData,
});

export default connect(mapStateToProps, {
    setHomeVendorFilter, setHomeVendorSort, setVendorCart, getFeaturedBlocks, toggleFavourite
})(HomePage);