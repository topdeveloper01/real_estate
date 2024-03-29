import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Image, ActivityIndicator, Platform, TouchableOpacity, Text, View, StyleSheet, RefreshControl, KeyboardAvoidingView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import Entypo from 'react-native-vector-icons/Entypo';
import { width, height } from 'react-native-dimension';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { updateProfileDetails } from '../../../store/actions/auth';
import { getAllListings } from '../../../store/actions/listings';
import { setVendorCart, getAllCities, setAllCity_1, setAllCity_2, setAllCity_3 } from '../../../store/actions/app';
import Theme from '../../../theme';
import RouteNames from '../../../routes/names';
import { AuthInput, VendorItem, } from '../../../common/components';
import TabsTypeButton from '../../../common/components/buttons/tab_btn';
import FeatureList from '../components/FeatureList';
import FilterBar from '../../../common/components/vendors/FilterVar';
import BlockSpinner from '../../../common/components/BlockSpinner';
import NoRestaurants from '../../../common/components/restaurants/NoRestaurants';
import { FOR_RENT, FOR_SELL } from '../../../config/constants';
import alerts from '../../../common/services/alerts';

const vertPerPage = 10;

const HomePage = (props) => {

    const [featuredBlocks, setFeaturedBlocks] = useState([])
    const [allvendors, setAllVendors] = useState([])

    const [vertLoading, setVertLoading] = useState(null)
    const [isRefreshing, setRefreshing] = useState(false)


    const [cityLoading, setCityLoading] = useState(false)

    const [searchTerm, setSearchTerm] = useState('')


    const [filter_city_1, setFilterCity1] = useState(null)
    const [filter_city_2, setFilterCity2] = useState(null)
    const [filter_city_3, setFilterCity3] = useState(null)

    const [filter_type, setFilterType] = useState(FOR_RENT)
    const [filter_use_format, setFilterUseFormat] = useState(-1)
    const [filter_price, setFilterPrice] = useState(-1)
    const [filter_size, setFilterSize] = useState(-1)
    const [filter_rooms, setFilterRooms] = useState(-1)
    const [filter_outer, setFilterOuter] = useState(-1)

    useEffect(() => {
        updateUserToken()
        loadCitiesData()
    }, [])

    useEffect(() => {
        loadVendors();
        loadFeaturedBlocks();
    }, [
        searchTerm, filter_type, filter_use_format, filter_price, filter_size, filter_rooms, filter_outer, filter_city_1, filter_city_2, filter_city_3
    ])

    const goRootStackScreen = (name, params) => {
        if (params) {
            props.rootStackNav.navigate(name, params)
        }
        else {
            props.rootStackNav.navigate(name)
        }
    }

    const updateUserToken = async () => {
        let platform = "iOS";
        if (Platform.OS === 'android') {
            platform = "Android"
        }

        try {
            let newUserData = {
                ...props.user,
                platform: platform
            }
            const updated_user = await props.updateProfileDetails(newUserData);

            console.log('updated_user', updated_user);
        }
        catch (error) {
            console.log('updateUserToken ', error);
        }
    }

    const loadCitiesData = async () => {
        try {
            setCityLoading(true);
            let city1_items = await getAllCities(1);
            let city2_items = await getAllCities(2);
            let city3_items = await getAllCities(3);

            props.setAllCity_1(city1_items);
            props.setAllCity_2(city2_items);
            props.setAllCity_3(city3_items);
            setCityLoading(false);
        }
        catch (error) {
            setCityLoading(false);
            console.log('loadCitiesData ', error);
        }
    }


    const getFilers = () => {
        return { searchTerm, filter_type, filter_use_format, filter_price, filter_size, filter_rooms, filter_outer, filter_city_1, filter_city_2, filter_city_3 }
    }

    const loadVendors = async () => {
        try {
            setVertLoading(true);
            let filterKeys = getFilers();
            let vendorsData = await getAllListings(filterKeys);
            setAllVendors(vendorsData)
            setVertLoading(false);
        }
        catch (error) {
            setVertLoading(false);
            console.log('get Vendors', error)
        }
    }

    const loadFeaturedBlocks = async () => {
        try {
            let filterKeys = getFilers();
            filterKeys.is_featured = true;
            let vendorsData = await getAllListings(filterKeys);
            setFeaturedBlocks(vendorsData)
        }
        catch (error) {
            console.log('get Vendors', error)
        }
    };

    const isEmptyData = () => {
        return (featuredBlocks.length == 0 && allvendors.length == 0)
    }

    const goVendorDetail = (vendor) => {
        props.setVendorCart(vendor)
        goRootStackScreen(RouteNames.VendorScreen)
    }

    const _renderVertVendors = () => {
        return <View style={[Theme.styles.col_center_start, { width: '100%', alignItems: 'flex-start', }]}>
            {
                allvendors.map((vendor, index) =>
                    <View key={vendor.id} style={[Theme.styles.col_center, { width: '100%', }]}>
                        <VendorItem
                            data={vendor}
                            vendor_id={vendor.id}
                            style={{ width: '100%', marginRight: 0, }}
                            onSelect={() => goVendorDetail(vendor)}
                        />
                    </View>
                )
            }
        </View>
    }

    return (
        <View style={[Theme.styles.col_center_start, { flex: 1, backgroundColor: Theme.colors.white }]}>
            <Spinner visible={cityLoading} />
            <View style={[Theme.styles.row_center_start, styles.header]}>
                <View style={[Theme.styles.col_center, { flex: 1, alignItems: 'flex-start' }]}>
                    <Text style={styles.headerTitle}>滙槿地產有限公司</Text>
                    <Text style={styles.headerSubTitle}>Hollys Property And Renovation Company Limited</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    if (props.isLoggedIn == false) {
                        return alerts.confirmation('必須', '登入後繼續', '登入', '取消')
                            .then(
                                () => {
                                    props.navigation.push(RouteNames.WelcomeScreen, { backRoute: RouteNames.BottomTabs })
                                },
                                (error) => {
                                }
                            );
                    }
                    goRootStackScreen(RouteNames.NotificationsScreen)
                }}>
                    <MaterialCommunityIcons name='bell' size={24} color={Theme.colors.text} />
                </TouchableOpacity>
            </View>
            <TabsTypeButton
                value={filter_type}
                onChange={(value) => {
                    setFilterType(value)
                }}
            />
            {/* <View style={{ width: '100%', marginTop: 6, paddingHorizontal: 20, }}>
                <AuthInput
                    placeholder={'關鍵字/地區/標籤 (Search By Keyword)'}
                    underlineColorAndroid={'transparent'}
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    isSearch={true}
                    value={searchTerm}
                    onChangeText={(searchTerm) => {
                        setSearchTerm(searchTerm)
                    }}
                    backgroundColor={Theme.colors.gray4}
                    style={{ borderWidth: 0, backgroundColor: Theme.colors.gray4 }}
                    rightComp={searchTerm !== '' ? (
                        <TouchableOpacity onPress={() => {
                            setSearchTerm('')
                        }}>
                            <Entypo name={'circle-with-cross'} color={'#878E97'} size={18} />
                        </TouchableOpacity>
                    ) : null}
                />
            </View> */}
            <View style={{ width: '100%', paddingHorizontal: 20, }}>
                <FilterBar
                    isSell={filter_type == FOR_SELL}
                    onChangeArea={(value) => {
                        setFilterCity1(value.city1)
                        setFilterCity2(value.city2)
                        setFilterCity3(value.city3)
                    }}
                    onChangeType={(value) => { setFilterUseFormat(value) }}
                    onChangePrice={(value) => { setFilterPrice(value) }}
                    onChangeSize={(value) => { setFilterSize(value) }}
                    onChangeRooms={(value) => { setFilterRooms(value) }}
                    onChangeOuter={(value) => { setFilterOuter(value) }}
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
                                    loadFeaturedBlocks();
                                }}
                            />
                        }
                        extraHeight={50}
                    >
                        {
                            featuredBlocks.length > 0 &&
                            <FeatureList
                                label={'精選樓盤 HOT ESTATE'}
                                items={featuredBlocks}
                                goVendorDetail={(vendor) => {
                                    goVendorDetail(vendor)
                                }}
                            />
                        }
                        {
                            _renderVertVendors()
                        }
                    </KeyboardAwareScrollView>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    header: { width: '100%', paddingHorizontal: 20, height: 90, paddingTop: 34, backgroundColor: '#F7F7F7' },
    headerTitle: { fontSize: 20, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
    headerSubTitle: { fontSize: 12, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
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


const mapStateToProps = ({ app }) => ({
    user: app.user || {},
    isLoggedIn: app.isLoggedIn,
    language: app.language,
    vendorData: app.vendorData,
});

export default connect(mapStateToProps, {
    setVendorCart, updateProfileDetails, setAllCity_1, setAllCity_2, setAllCity_3
})(HomePage);