import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Image, StatusBar, View, Animated, ScrollView, Share, InteractionManager, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import { width, height } from 'react-native-dimension';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux'
import { setTmpFood } from '../../../store/actions/app';
import { getVendorDetail, toggleFavourite } from '../../../store/actions/vendors';
import { getPastOrders, changeOrderStatus } from '../../../store/actions/orders';
import { extractErrorMessage, openExternalUrl } from '../../../common/services/utility';
import { translate } from '../../../common/services/translate';
import alerts from '../../../common/services/alerts'
import Theme from '../../../theme';
import Config from '../../../config'
import { appMoment } from '../../../common/services/translate';
import { CartViewButton, VendorFoodItem, RoundIconBtn, ImageCarousel, VendorItem, SwitchTab } from '../../../common/components';
import RouteNames from '../../../routes/names';
import ShopInfoView from '../components/ShopInfoView';
import PastorderView from '../components/PastorderView';
import VendorInfoLocItem from '../components/VendorInfoLocItem';
import VendorInfoItem from '../components/VendorInfoItem';
import BlockSpinner from '../../../common/components/BlockSpinner';
import VendorFoodList from '../components/VendorFoodList';
import ScrollableHorizontalMenu from '../../../common/components/ScrollableHorizontalMenu';
import VendorClosedModal from '../../../common/components/modals/VendorClosedModal';
import { setVendorCart, AddProduct2Cart, updateCartItems, getDiscount } from '../../../store/actions/shop';


function getSwiperHeight(cur_tab, vendor_data, latest_offers, all_offers, scrollChanged) {
    console.log('getSwiperHeight called!');
    const FoodCatHeight = 38;
    const FoodItemHeight = 122;
    const GroceryItemHeight = 192;
    const Empty_Offer_Height = 280;
    const First_Products_ShowCnt = 6;
    const bottomPadding = 0;
    if (cur_tab == 'Menu') {

        let height = 0;
        let first_visible_cat_index = -1;
        let total_products_cnt = 0;
        if (vendor_data != null && vendor_data.categories != null && vendor_data.categories.length > 0) {
            vendor_data.categories.map((cat, index) => {
                height = height + FoodCatHeight;
                if (cat.products != null && cat.products.length > 0) {
                    if (vendor_data.vendor_type == 'Restaurant') {
                        height = height + FoodItemHeight * cat.products.length;
                    }
                    else {
                        height = height + GroceryItemHeight * (parseInt(cat.products.length / 2) + (cat.products.length % 2));
                    }
                    total_products_cnt = total_products_cnt + cat.products.length;
                    if (first_visible_cat_index == -1 && total_products_cnt > First_Products_ShowCnt) {
                        first_visible_cat_index = index;
                    }
                }
            })
        }

        if (scrollChanged == false) {
            if (vendor_data.vendor_type == 'Restaurant') {
                return FoodItemHeight * Math.min(First_Products_ShowCnt, total_products_cnt) + (first_visible_cat_index + 1) * FoodCatHeight;
            }
            else {
                return GroceryItemHeight * ((Math.min(First_Products_ShowCnt, total_products_cnt) / 2) + 1) + (first_visible_cat_index + 1) * FoodCatHeight;
            }
        }
        height = height + bottomPadding;
        return Math.max(height, Empty_Offer_Height);
    }
    else if (cur_tab == 'Offers') {
        let height = 0;
        if (latest_offers != null && latest_offers.length > 0) {
            height = height + FoodItemHeight * latest_offers.length;
        }
        if (all_offers != null && all_offers.length > 0) {
            height = height + FoodItemHeight * all_offers.length;
        }
        height = height + bottomPadding;
        return Math.max(height, Empty_Offer_Height);
    }
    return 280; // for info view
}

const getClosedVendorModalTitle = (vendorData, language) => {
    if (vendorData.custom_closed_info != null && vendorData.custom_closed_info != '') {
        return vendorData.custom_closed_info;
    }
    if (vendorData.vendor_opening_days != null) {
        let day_index = vendorData.vendor_opening_days.findIndex(i => i.week_day == new Date().getDay().toString())
        if (day_index != -1) {
            if (vendorData.vendor_opening_days[day_index].time_open != null) {
                let open_time = appMoment(vendorData.vendor_opening_days[day_index].time_open, "HH:mm:ss").format("h:mm A")
                if (language == 'en') {
                    return `This vendor is currently closed and will open at ${open_time}. You can still see their menu.`
                }
                else {
                    return `Ky shitës aktualisht është i mbyllur dhe do të hapet në ${open_time}. Ende mund të shihni menunë e tyre.`
                }
            }
        }
    }
    if (language == 'en') {
        return 'This vendor is currently closed. You can still see their menu.'
    }
    else {
        return 'Ky shitës aktualisht është i mbyllur. Ende mund të shihni menunë e tyre.'
    }
}

const VendorScreen = (props) => {
    const scrollView = useRef(null);
    const _mounted = useRef(true);
    const currentCatIndex = useRef(0);
    const scrollOnLayout = useRef(false);
    const scrollToValue = useRef(null);
    const productsListDimensions = useRef([]);

    const tabs = ['Menu', 'Offers', 'Info']

    const [goCartLoading, showGoCartLoading] = useState(false)

    const [isShowHeaderTitle, setShowHeaderTitle] = useState(false)

    const [isLoading, showLoading] = useState(false)
    const [isClosedVendorModal, showClosedVendorModal] = useState(false)
    const [curTab, setCurTab] = useState('Menu')

    const [scrollChanged, setScrollChanged] = useState(false)

    const [horizontalScrollMenuIndex, setHorizontalScrollMenuIndex] = useState(0);

    const [past_orders, setPastOrders] = useState([])
    const [latest_offers, setLatestOffers] = useState([])
    const [all_offers, setAllOffers] = useState([])

    const [order_methods, setOrderMethods] = useState([])
    const [handover_method, setHandoverMethod] = useState(null)
    const [vendorCartItems, setVendorCartItems] = useState([])
    const [bannerData, setBanner] = useState(null)

    const [cartVendorLoaded, setCartVendorLoaded] = useState(false)

    const scrollX = useRef(new Animated.Value(0)).current;
    const v_transY = scrollX.interpolate({
        inputRange: [0, 40, 80, 120, 150, 200, 300],
        outputRange: [0, -40, -50, -80, -80, -80, -250],
        extrapolate: "clamp"
    });

    const closedVendorTitle = useMemo(() => getClosedVendorModalTitle(props.vendorData, props.language),
        [props.vendorData, props.language]);
    const swiperHeight = useMemo(() => getSwiperHeight(curTab, props.vendorData, latest_offers, all_offers, scrollChanged),
        [curTab, props.vendorData, latest_offers, all_offers, scrollChanged]);

    useEffect(() => {
        loadData();

        return () => {
            console.log("vendor screen unmount")
            _mounted.current = false;
        };
    }, [props.vendorData.id])

    const loadData = () => {
        _mounted.current = true;

        let items = props.cartItems.filter(i => i.vendor_id == props.vendorData.id && i.quantity > 0)
        setVendorCartItems(items)

        if (props.vendorData.banners != null && props.vendorData.banners.length > 0) {
            let banners = []
            let titles = []
            let descs = []
            // console.log('banners', props.vendorData.banners)
            props.vendorData.banners.map(banner => {
                banners.push({ source: { uri: Config.IMG_BASE_URL + banner.image_path } })
                titles.push(banner.title)
                descs.push(banner.description)
            })
            setBanner({ banners, titles, descs })
        }
        else {
            setBanner(null)
        }

        loadOffer(props.vendorData.id);
        loadPastOrders(props.vendorData.id);

        console.log('props.vendorData.order_method ', props.vendorData.order_method)
        if (props.vendorData.order_method != null) {
            let supported_order_methods = props.vendorData.order_method.split('-');
            if (supported_order_methods.length > 0) {
                setOrderMethods(supported_order_methods);
                setHandoverMethod(supported_order_methods[0]);
                loadVendorDetails(props.vendorData.id, supported_order_methods[0], cartVendorLoaded == false);
            }
        }
    }

    useEffect(() => {
        let items = props.cartItems.filter(i => i.vendor_id == props.vendorData.id && i.quantity > 0)
        setVendorCartItems(items)
    }, [props.cartItems])

    useEffect(() => {
        console.log('tmpFoodData.isFav')
        onProductFavChange(props.tmpFoodData)
    }, [props.tmpFoodData.isFav])

    const loadVendorDetails = async (id, order_method, showClosedModal) => {
        if (id == null) { return; }
        let { latitude, longitude } = props.coordinates;

        showLoading(true);
        getVendorDetail(id, latitude, longitude, order_method).then((data) => {
            props.setVendorCart(data);
            showLoading(false);
            
            setTimeout(() => {
                setScrollChanged(true);
                if (showClosedModal == true) {
                    showClosedVendorModal(data.is_open != 1)
                }
            }, 200)
        })
            .catch(error => {
                showLoading(false);
                console.log('get Vendor Detail', error)
                alerts.error(translate('restaurant_details.we_are_sorry'), extractErrorMessage(error));
            })
    };

    const loadPastOrders = (vendor_id) => {
        getPastOrders(vendor_id).then(data => {
            if (_mounted.current == false) {
                return;
            }
            setPastOrders(data)
        })
            .catch(error => {
                console.log('getPastOrders', error)
            })
    }

    const loadOffer = (vendor_id) => {
        props.getDiscount(vendor_id, 'time').then(res => {
            if (_mounted.current == false) {
                return;
            }
            setLatestOffers(res)
        })
            .catch(err => {
                console.log('load latest Offer', err)
            })

        props.getDiscount(vendor_id).then(res => {
            if (_mounted.current == false) {
                return;
            }
            setAllOffers(res)
        })
            .catch(err => {
                console.log('load all Offer', err)
            })
    }

    const onPressFav = () => {
        props.toggleFavourite(props.vendorData.id, props.vendorData.isFav == 1 ? 0 : 1).then((res) => {
            if (_mounted.current == false) {
                return;
            }
            props.setVendorCart({ ...props.vendorData, isFav: props.vendorData.isFav == 1 ? 0 : 1 })
        })
            .catch((error) => {
                console.log('onPressFav', error)
            })
    }

    const goPastOrder = () => {
        props.navigation.navigate(RouteNames.PastOrderScreen, {
            vendor_id: props.vendorData.id,
            logo: props.vendorData.logo_thumbnail_path,
            title: props.vendorData.title
        });
    };

    const goFoodDetail = (food_data) => {
        props.setTmpFood(food_data)
        props.navigation.navigate(RouteNames.FoodScreen);
    }

    const goCart = () => {
        if (props.isLoggedIn == false) {
            props.navigation.push(RouteNames.WelcomeScreen, { backRoute: RouteNames.BottomTabs })
            return;
        }
        if (props.cartItems != null && props.cartItems.length > 0) {
            let vendor_id = props.cartItems[0].vendor_id;
            if (vendor_id == props.vendorData.id) {
                props.navigation.navigate(RouteNames.CartScreen)
                return;
            }
            else {
                showGoCartLoading(true);
                let { latitude, longitude } = props.coordinates;
                getVendorDetail(vendor_id, latitude, longitude).then((data) => {
                    showGoCartLoading(false);
                    if (_mounted.current == false) {
                        return;
                    }
                    setCartVendorLoaded(true);
                    props.setVendorCart(data);

                    props.navigation.navigate(RouteNames.CartScreen)
                })
                    .catch(error => {
                        showGoCartLoading(false);
                        console.log('get Vendor Detail', error)
                        alerts.error(translate('restaurant_details.we_are_sorry'), extractErrorMessage(error));
                    })
            }
        }
    }

    const onShare = async () => {
        const shareOptions = {
            title: 'Snapfood Vendor',
            message:
                Platform.OS === 'android'
                    ? `https://snapfood.al/restaurant/${props.vendorData['hash_id']}/${props.vendorData['slug']}`
                    : '',
            url: `https://snapfood.al/restaurant/${props.vendorData['hash_id']}/${props.vendorData['slug']}`,
            subject: 'Link for Snapfood',
        };
        await Share.share(shareOptions);
    };

    const onProductFavChange = (data) => {
        const { categories } = props.vendorData
        if (categories && categories.length && categories.length > 0) {
            let tmp = categories.slice(0, categories.length)
            let cat_index = tmp.findIndex(i => i.id == data.category_id)
            if (cat_index != -1) {
                if (tmp[cat_index].products && tmp[cat_index].products.length && tmp[cat_index].products.length > 0) {
                    let product_index = tmp[cat_index].products.findIndex(i => i.id == data.id)
                    if (product_index != -1) {
                        tmp[cat_index].products[product_index].isFav = data.isFav

                        props.setVendorCart({ ...props.vendorData, categories: tmp })
                    }
                }
            }
        }
    }

    const _renderHeader = () => {
        return <View style={[Theme.styles.row_center, styles.header,
        { backgroundColor: isShowHeaderTitle ? '#fff' : 'transparent' }
        ]}>
            <RoundIconBtn style={{ ...styles.headerBtn, borderWidth: isShowHeaderTitle ? 0 : 1, marginLeft: isShowHeaderTitle ? -8 : 0 }} icon={<Feather name='chevron-left' size={22} color={Theme.colors.text} />} onPress={() => {
                props.navigation.goBack()
            }} />
            {
                isShowHeaderTitle && <View style={[Theme.styles.row_center_start,]}>
                    <RoundIconBtn style={{ ...Theme.styles.col_center, ...styles.topLogoView }}
                        icon={
                            <FastImage source={{ uri: Config.IMG_BASE_URL + props.vendorData.logo_thumbnail_path }} style={styles.topLogo} resizeMode={FastImage.resizeMode.contain} />
                        }
                        onPress={() => { }} />
                    <Text style={styles.topLogoText} numberOfLines={1}>{props.vendorData.title}</Text>
                </View>
            }
            <View style={{ flex: 1, }} />
            {
                <View style={[Theme.styles.row_center_end, { alignItems: 'flex-end', }]}>
                    <RoundIconBtn style={styles.headerBtn} icon={<Entypo name='share' size={20} color={Theme.colors.text} />} onPress={onShare} />
                    <View style={{ width: 33, height: 48, marginLeft: 10, justifyContent: 'flex-end', }}>
                        <RoundIconBtn
                            diabled={props.cartItems != null && props.cartItems.length == 0}
                            style={styles.headerBtn}
                            icon={<FontAwesome5 name='shopping-bag' size={20} color={Theme.colors.text} />}
                            onPress={goCart} />
                        {(props.cartItems != null && props.cartItems.length > 0) && <View style={styles.cartBadge} />}
                    </View>
                    {
                        props.isLoggedIn &&
                        <RoundIconBtn style={{ width: 33, height: 33, borderRadius: 8, backgroundColor: '#fff', marginLeft: 10, paddingTop: 3 }}
                            icon={<Entypo name='heart' size={24} color={props.vendorData.isFav == 1 ? Theme.colors.cyan2 : Theme.colors.gray5} />}
                            onPress={() => onPressFav()} />
                    }
                </View>
            }
        </View>
    }

    const _renderOperationTabs = () => {
        return <View style={[Theme.styles.row_center, styles.operationTab,]}>
            <SwitchTab
                items={tabs}
                curitem={curTab}
                onSelect={(item) => setCurTab(item)}
                style={{ width: '100%', paddingLeft: 0, paddingRight: 0, }}
            />
        </View>
    }

    const _renderHandover = () => {
        return <View style={[Theme.styles.col_center, styles.handoverView]}>
            <View style={styles.divider} />
            <SwitchTab
                items={order_methods}
                curitem={handover_method}
                onSelect={(item) => {
                    setHandoverMethod(item)
                    loadVendorDetails(props.vendorData.id, item, false);
                }}
                style={styles.orderMethodTabstyle}
                active_style={styles.activeTab_style}
                inactive_style={styles.inactiveTab_style}
                inactivetxt_style={styles.inactiveTabtxt_style}
                activetxt_style={styles.activeTabtxt_style}
            />
        </View>
    }

    const getDelta = () => {
        let delta = 170;
        if (props.vendorData.order_method != 'Delivery' && order_methods.length > 0) {
            delta = delta + 55;
        }
        if (props.isLoggedIn && past_orders.length > 0) {
            delta = delta + 55;
        }
        return delta;
    }

    const renderCategoriesMenu = () => {
        return (
            <View
                style={[Theme.styles.col_center, styles.categList,]}>
                <ScrollableHorizontalMenu
                    selectedItem={horizontalScrollMenuIndex}
                    onItemSelected={(index) => {
                        if (!scrollView.current) {
                            return;
                        }
                        if (!productsListDimensions.current) {
                            return;
                        }
                        currentCatIndex.current = index;

                        setTimeout(() => {
                            scrollOnLayout.current = true;

                            let delta = getDelta() + 70;
                            if (index >= productsListDimensions.current.length) {
                                scrollView.current.scrollTo({ y: (delta + swiperHeight), animated: true });
                                return;
                            }
                            else {
                                const offset = productsListDimensions.current[index];
                                if (offset == null) { return; }
                                let scrollOffset;
                                if (index === 0) {
                                    scrollOffset = delta;
                                } else {
                                    scrollOffset = offset.y + delta;
                                }

                                scrollToValue.current = scrollOffset;
                                scrollView.current.scrollTo({ y: scrollOffset, animated: true });
                            }
                        }, 400)
                    }}
                    items={props.vendorData.categories || []}
                />
                <View style={Theme.styles.row_center}>
                    <View style={styles.scrollviewHider} />
                </View>
            </View>
        );
    };

    const getCartCnt = (food_data) => {
        let foundIndex = props.cartItems.findIndex(i => i.id == food_data.id)
        if (foundIndex != -1) {
            return props.cartItems[foundIndex].quantity;
        }
        return 0;
    }

    const _renderOffers = (title, list) => {
        return <View style={[Theme.styles.col_center_start, styles.foodList]}>
            <Text style={styles.subjectTitleOffer}>{title}</Text>
            {
                (list.length == null || list.length == 0) && title == translate('vendor_profile.latest_offers') &&
                <Text style={styles.NoOffer}>{translate('vendor_profile.no_latest_offer')}{props.vendorData.title}</Text>
            }
            {
                (list.length == null || list.length == 0) && title == translate('vendor_profile.all_offers') &&
                <Text style={styles.NoOffer}>{translate('vendor_profile.no_all_offer')}{props.vendorData.title}</Text>
            }
            {
                list.length > 0 && <ScrollView
                    style={{ width: '100%', }}
                >
                    {
                        list.map((item, index) =>
                            <VendorFoodItem
                                key={index}
                                type='offer'
                                cartEnabled={true}
                                food_id={item.id}
                                isFav={item.isFav}
                                cartCnt={getCartCnt(item)}
                                data={item}
                                onFavChange={onProductFavChange}
                                onSelect={(data) => goFoodDetail(data)}
                            />
                        )
                    }
                </ScrollView>
            }
        </View>
    }

    console.log('vendor screen')
    return (
        <React.Fragment>
            <Spinner visible={goCartLoading} />
            <View style={[Theme.styles.flex_1, { width: '100%', height: '100%', }, styles.forgroundView]}>
                <Animated.View
                    style={[Theme.styles.col_center, {
                        width: '100%',
                        backgroundColor: '#fff',
                        transform: [
                            { translateY: v_transY }
                        ],
                    },
                    ]}>
                    <FastImage source={{ uri: `${Config.IMG_BASE_URL}${props.vendorData.profile_path}?w=600&h=600` }} style={styles.topBannerImg} />
                    <View style={styles.photoTransWrap} />
                </Animated.View>
            </View>
            <Animated.ScrollView
                ref={scrollView}
                bounces={false}
                alwaysBounceVertical={false}
                alwaysBounceHorizontal={false}
                style={{ flex: 1, marginTop: 80, width: '100%', }}
                stickyHeaderIndices={[1,]}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollX
                                }
                            }
                        }
                    ],
                    {
                        useNativeDriver: true,
                        listener: (event) => {
                            const scrollY = event.nativeEvent.contentOffset.y;
                            // console.log('Scroll y', scrollY)
                            // setScrollY(scrollY)
                            if (scrollY > 100) {
                                if (isShowHeaderTitle == false) {
                                    setShowHeaderTitle(true);
                                }
                            }
                            else {
                                if (isShowHeaderTitle == true) {
                                    setShowHeaderTitle(false);
                                }
                            }

                            if (scrollToValue.current == null && productsListDimensions.current) {
                                let delta = getDelta();

                                let { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                                let index = 0;
                                for (let i = 0; i < productsListDimensions.current.length; i++) {
                                    if (productsListDimensions.current[i] != null && scrollY > productsListDimensions.current[i].y + delta) {
                                        index = i;
                                    }
                                }
                                if (layoutMeasurement.height + contentOffset.y >= contentSize.height) {
                                    index = productsListDimensions.current.length - 1;
                                }
                                setHorizontalScrollMenuIndex(index);
                            }
                        }
                    }
                )}
                onTouchStart={() => {
                    scrollToValue.current = null;
                }}
            >
                {<View style={{ width: '100%' }}>
                    <ShopInfoView data={props.vendorData} handover_method={handover_method} />
                    {props.vendorData.order_method != 'Delivery' && order_methods.length > 0 && _renderHandover()}
                    {
                        curTab == 'Menu' &&
                        <View style={[Theme.styles.col_center, { width: '100%', backgroundColor: Theme.colors.white, }]}>
                            <View style={[Theme.styles.col_center, { width: '100%', paddingHorizontal: 20, }]}>
                                {_renderOperationTabs()}
                                {props.isLoggedIn && !isLoading && past_orders.length > 0 && <PastorderView onPress={() => goPastOrder()} />}
                            </View>
                        </View>
                    }
                </View>
                }
                {
                    curTab != 'Menu' && <View style={[Theme.styles.col_center_start, { backgroundColor: Theme.colors.white, width: '100%', paddingHorizontal: 20, }]}>
                        {_renderOperationTabs()}
                    </View>
                }
                {!isLoading && curTab == 'Menu' && <View style={[Theme.styles.col_center, { width: '100%', backgroundColor: Theme.colors.white, paddingHorizontal: 20, }]}>
                    {renderCategoriesMenu()}
                </View>}
                {
                    !isLoading &&
                    <Swiper
                        onIndexChanged={(index) => { }}
                        scrollEnabled={false}
                        loop={false}
                        index={curTab == 'Menu' ? 0 : (curTab == 'Offers' ? 1 : 2)}
                        showsPagination={false}
                        style={{ height: swiperHeight }}
                    >
                        <View style={{ width: '100%' }}>
                            <VendorFoodList
                                vendor_id={props.vendorData.id}
                                scrollChanged={scrollChanged}
                                navigation={props.navigation}
                                onChangeDimensions={(dimentions) => {
                                    if (dimentions != null) {
                                        productsListDimensions.current = dimentions;
                                    }
                                    if (scrollOnLayout.current == true) {
                                        if (!scrollView.current) {
                                            return;
                                        }
                                        if (currentCatIndex.current >= dimentions.length) {
                                            return;
                                        }

                                        let delta = getDelta() + 70;
                                        const offset = dimentions[currentCatIndex.current];
                                        if (offset == null) { return; }
                                        let scrollOffset;
                                        if (currentCatIndex.current === 0) {
                                            scrollOffset = delta;
                                        } else {
                                            scrollOffset = offset.y + delta;
                                        }
                                        scrollView.current.scrollTo({ y: scrollOffset });
                                    }
                                }}
                            />
                        </View>
                        <View style={[Theme.styles.col_center_start, { backgroundColor: Theme.colors.white, width: '100%' }]}>
                            <View style={[Theme.styles.row_center,]}>
                                {
                                    _renderOffers(translate('vendor_profile.latest_offers'), latest_offers || [])
                                }
                            </View>
                            <View style={[Theme.styles.row_center,]}>
                                {
                                    _renderOffers(translate('vendor_profile.all_offers'), all_offers || [])
                                }
                            </View>
                        </View>
                        <View style={[Theme.styles.col_center_start, { backgroundColor: Theme.colors.white, width: '100%', paddingHorizontal: 20 }]}>
                            <VendorInfoLocItem
                                data={props.vendorData}
                                vendor_id={props.vendorData.id}
                                style={{ marginTop: 12, }}
                                onSelect={(latitude, longitude) => {
                                    props.navigation.navigate(RouteNames.VendorLocationScreen,
                                        {
                                            address: { lat: latitude, lng: longitude },
                                            info: {
                                                title: props.vendorData.title,
                                                is_open: props.vendorData.is_open,
                                                logo: props.vendorData.logo_thumbnail_path,
                                                distance: (parseFloat(props.vendorData.distance) / 1000).toFixed(1)
                                            }
                                        });
                                }} />
                            <VendorInfoItem data={props.vendorData} vendor_id={props.vendorData.id} />
                        </View>
                    </Swiper>
                }
                {(isLoading ||
                    (productsListDimensions.current && props.vendorData.categories && (productsListDimensions.current.length < props.vendorData.categories.length)))
                    && <BlockSpinner style={{ minHeight: 120 }} />}

                {vendorCartItems.length > 0 && <View style={{ height: 100 }} />}
            </Animated.ScrollView>
            {vendorCartItems.length > 0 && <CartViewButton onPress={() => {
                if (props.isLoggedIn) {
                    props.navigation.navigate(RouteNames.CartScreen)
                }
                else {
                    props.navigation.push(RouteNames.WelcomeScreen, { backRoute: RouteNames.BottomTabs })
                }
            }} diabled={props.vendorData.is_open != 1} cartItems={vendorCartItems} style={styles.cartview} />}

            <VendorClosedModal
                showModal={isClosedVendorModal}
                title={closedVendorTitle}
                goHome={() => {
                    showClosedVendorModal(false)
                    props.navigation.goBack()
                }}
                onClose={() => showClosedVendorModal(false)}
            />
            {_renderHeader()}
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    header: { position: 'absolute', top: 0, left: 0, height: 80, width: '100%', paddingBottom: 0, paddingHorizontal: 20, alignItems: 'flex-end' },
    headerBtn: { width: 33, height: 33, borderRadius: 8, backgroundColor: Theme.colors.white, },
    operationTab: { height: 62, width: '100%', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F6F6F9' },
    subjectTitle: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text, },
    subjectTitleOffer: { marginBottom: 12, marginTop: 12, fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.gray7 },
    NoOffer: { marginBottom: 24, marginTop: 24, paddingHorizontal: 18, textAlign: 'center', width: '100%', fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.gray7 },
    divider: { width: '100%', height: 1, backgroundColor: Theme.colors.gray9, },
    infoView: { width: '100%', backgroundColor: Theme.colors.white },
    activeIndicator: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#f00' },
    inactiveIndicator: { width: 7, height: 7, borderRadius: 4, color: Theme.colors.gray7 },
    categList: { alignItems: 'flex-start', paddingTop: 10, width: '100%', backgroundColor: Theme.colors.white, },
    scrollviewHider: { width: '100%', marginTop: -10, height: 12, backgroundColor: Theme.colors.white },

    foodList: { width: '100%', paddingHorizontal: 18, backgroundColor: Theme.colors.white, alignItems: 'flex-start' },
    sectionView: { width: '100%', backgroundColor: Theme.colors.white, alignItems: 'flex-start', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Theme.colors.gray9 },

    topLogoText: { maxWidth: 160, color: Theme.colors.text, fontSize: 18, fontFamily: Theme.fonts.bold, marginLeft: 10, },
    topLogoView: { width: 33, height: 33, borderRadius: 8, backgroundColor: Theme.colors.white, },
    topLogo: { width: 26, height: 26, },

    photoTransWrap: { width: '100%', height: 200, backgroundColor: '#00000066', position: 'absolute', top: 0, left: 0, },
    forgroundView: { width: '100%', backgroundColor: Theme.colors.white, position: 'absolute', top: 0, left: 0, },
    topBannerImg: { width: '100%', height: 200, },
    cartview: { position: 'absolute', bottom: 40, left: 0, },
    cartBadge: { position: 'absolute', top: 11, right: -3, width: 11, height: 11, borderRadius: 5.5, backgroundColor: Theme.colors.red1 },

    handoverView: { backgroundColor: Theme.colors.white, paddingHorizontal: 20, paddingTop: 7, paddingBottom: 14 },
    orderMethodTabstyle: {
        marginTop: 14,
        paddingLeft: 0, paddingRight: 0, height: 40, borderRadius: 12,
        backgroundColor: '#fff', elevation: 1, shadowOffset: { width: 1, height: 1 },
        shadowColor: '#999',
        shadowOpacity: 0.6,
        borderWidth: 1, borderColor: Theme.colors.gray6,
    },
    activeTab_style: { maxWidth: 108, height: 40, marginLeft: 0, marginRight: 0, borderRadius: 12, backgroundColor: Theme.colors.text },
    inactiveTab_style: { maxWidth: 108, height: 36, marginLeft: 0, marginRight: 0, borderRadius: 12, backgroundColor: Theme.colors.white },
    inactiveTabtxt_style: { fontSize: 14, lineHeight: 16, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold, },
    activeTabtxt_style: { fontSize: 14, lineHeight: 16, color: Theme.colors.white, fontFamily: Theme.fonts.semiBold, },
})


const mapStateToProps = ({ app, shop }) => ({
    language: app.language,
    coordinates: app.coordinates,
    tmpFoodData: app.tmpFoodData,
    cartItems: shop.items,
    vendorData: shop.vendorData,
    isLoggedIn: app.isLoggedIn,
});

export default connect(mapStateToProps, {
    setVendorCart, toggleFavourite, setTmpFood, AddProduct2Cart, updateCartItems, getDiscount,
})(VendorScreen);
