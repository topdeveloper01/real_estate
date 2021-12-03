import React, {useEffect, useState} from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
 

   

import { connect } from 'react-redux'
// custom input
import RouteNames from './names';
import Theme from '../theme';
import Config from '../config';
import { translate } from '../common/services/translate';
import HomeTabRoute, { SearchTabRoute, ChatTabRoute, OrdersTabRoute, ProfileTabRoute } from './index';
import OrderStatusModal from '../common/components/modals/OrderStatusModal';
// svgs
import Home_active from '../common/assets/svgs/home_active.svg';
import Home_inactive from '../common/assets/svgs/home_inactive.svg';
import Search_active from '../common/assets/svgs/search_active.svg';
import Search_inactive from '../common/assets/svgs/search_inactive.svg';
import Chat_active from '../common/assets/svgs/chat_active.svg';
import Chat_inactive from '../common/assets/svgs/chat_inactive.svg';
import Orders_active from '../common/assets/svgs/orders_active.svg';
import Orders_inactive from '../common/assets/svgs/orders_inactive.svg';
import Profile_active from '../common/assets/svgs/profile_active.svg';
import Profile_inactive from '../common/assets/svgs/profile_inactive.svg';


const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation, props }) {
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    return (
        <View style={styles.barStyle}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    if (props.isLoggedIn == false && (
                        label == translate('bottomtabs.chat') ||
                        label == translate('bottomtabs.orders') ||
                        label == translate('bottomtabs.profile')
                    )) {
                        props.navigation.push(RouteNames.WelcomeScreen, { backRoute: RouteNames.BottomTabs })
                        return;
                    }

                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={[Theme.styles.col_center, { flex: 1, paddingBottom: 4 }]}
                    >
                        {options.tabBarIcon({ focused: isFocused, color: isFocused ? Theme.colors.cyan2 : Theme.colors.gray5, size: 20 })}
                        <Text style={[styles.labelStyle, { color: isFocused ? '#DDDDDD99' : '#DDDDDD22' }]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const HomeTabs=(props)=>{
    useEffect(()=>{

        if (props.isOrderSummVisible == true && props.pushOrderDetails != null) { 
            props.navigation.navigate(RouteNames.OrderSummScreen, { isnew: false, fromPush : true,  order_id: props.pushOrderDetails.id, order_status : props.pushOrderDetails.status });
        } 
        if (props.isWalletVisible == true) {
            props.navigation.navigate(RouteNames.WalletScreen, { fromPush : true });
        }
        if (props.isInvitationVisible == true) {
            props.navigation.navigate(RouteNames.InvitationsScreen, { fromPush : true });
        }
        if (props.isChatVisible == true && props.pushConversationId != null) { 
            props.navigation.navigate(RouteNames.MessagesScreen, { fromPush : true, channelId: props.pushConversationId, pushChatMsgTime : props.pushChatMsgTime })
        }
        if (props.isBlogVisible == true && props.pushBlogId != null) { 
            props.navigation.navigate(RouteNames.BlogDetailsScreen, { fromPush : true, blog: {id : props.pushBlogId} })
        }

    }, [props.isOrderSummVisible, props.pushOrderDetails, props.isWalletVisible, 
        props.isInvitationVisible, props.isChatVisible, props.pushConversationId, 
        props.isBlogVisible, props.pushBlogId, props.pushChatMsgTime])


    return (
        <React.Fragment>
            <Tab.Navigator
                key={props.language}
                initialRouteName={RouteNames.HomeStack}
                tabBarOptions={{
                    showLabel: true,
                    style: {},
                    tabStyle: {},
                }}
                tabBar={_props => <MyTabBar {..._props} props={props} />}
            >
                <Tab.Screen
                    name={RouteNames.HomeStack}
                    children={(_props) => <HomeTabRoute rootStackNav={props.navigation} homeTabNav={_props.navigation} />}
                    options={{
                        tabBarLabel: '首頁',
                        tabBarIcon: ({ focused, color, size }) => (
                            <Entypo name='home' size={22} color={focused ? '#DDDDDD99' : '#DDDDDD22'}/> 
                        ),
                        //   tabBarBadge: 3,
                    }}
                />
                <Tab.Screen
                    name={RouteNames.ChatStack}
                    children={(_props) => <ChatTabRoute rootStackNav={props.navigation} homeTabNav={_props.navigation} />}
                    options={{
                        tabBarLabel: '信息',
                        tabBarIcon: ({ focused, color, size }) => (
                            <MaterialCommunityIcons name='message-text' size={22} color={focused ? '#DDDDDD99' : '#DDDDDD22'}/> 
                        ),
                        //   tabBarBadge: 3,
                    }}
                />
                <Tab.Screen
                    name={RouteNames.SearchStack}
                    children={(_props) => <SearchTabRoute rootStackNav={props.navigation} homeTabNav={_props.navigation} />}
                    options={{
                        tabBarLabel: '搜索',
                        tabBarIcon: ({ focused, color, size }) => (
                            <Fontisto name='search' size={22} color={focused ? '#DDDDDD99' : '#DDDDDD22'}/> 
                        ),
                        //   tabBarBadge: 3,
                    }}
                />  
                <Tab.Screen
                    name={RouteNames.ProfileStack}
                    children={(_props) => <ProfileTabRoute rootStackNav={props.navigation} homeTabNav={_props.navigation} />}
                    options={{
                        tabBarLabel: '帳戶',
                        tabBarIcon: ({ focused, color, size }) => (
                            <MaterialIcons name='settings' size={22} color={focused ? '#DDDDDD99' : '#DDDDDD22'}/> 
                        ),
                        //   tabBarBadge: 3,
                    }}
                />
            </Tab.Navigator>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    labelStyle: { fontSize: 12, fontFamily: Theme.fonts.semiBold, textAlign: 'center', marginTop: 5, },
    barStyle: {
        flexDirection: 'row', height: 72, paddingBottom: Config.isAndroid ? 13 : 21, paddingTop: 13,
        backgroundColor: Theme.colors.gray1, borderTopWidth: 1, borderTopColor: Theme.colors.gray6,
    }
});

const mapStateToProps = ({ app }) => ({
    isLoggedIn: app.isLoggedIn,
    language: app.language,
    hometabs_init_tabname: app.hometabs_init_tabname,

    pushOrderDetails : app.pushOrderDetails,
    pushConversationId : app.pushConversationId,
    isOrderSummVisible: app.isOrderSummVisible,
    isWalletVisible : app.isWalletVisible,
    isInvitationVisible : app.isInvitationVisible,
    isChatVisible : app.isChatVisible,
    isBlogVisible : app.isBlogVisible,
    pushBlogId : app.pushBlogId,
    pushChatMsgTime : app.pushChatMsgTime,
    
});

export default connect(mapStateToProps, {
})(HomeTabs);