import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux'
import RouteNames from './names';
import { setHomeTabNavigation } from '../store/actions/app'
/**
 * screens
 *  */
// home tab modules 
import HomePage from '../modules/home/screens/HomePage'; 
// search tab modules
import SearchScreen from '../modules/search/screens/SearchScreen';
// chat tab modules
import ChatScreen from '../modules/chat/screens/ChatScreen';  
// profile tab modules
import ProfileScreen from '../modules/profile/screens/ProfileScreen'; 


const HomeStack = createStackNavigator();
function HomeTabRoute(props) {

    const { rootStackNav, homeTabNav } = props
    useEffect(() => {
        props.setHomeTabNavigation(homeTabNav)
    }, [])

    return (
        <HomeStack.Navigator
            // this options hide all header
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={RouteNames.HomeScreen}
        >
            {/* <HomeStack.Screen name={RouteNames.HomeScreen} component={HomeScreen} /> */}
            <HomeStack.Screen name={RouteNames.HomeScreen}
                children={(_props) => <HomePage rootStackNav={rootStackNav} homeTabNav={homeTabNav} navigation={_props.navigation} />}
            /> 
        </HomeStack.Navigator>
    );
}

const mapStateToProps = ({ app }) => ({
    hometab_navigation: app.hometab_navigation,
});
export default connect(mapStateToProps, { setHomeTabNavigation })(HomeTabRoute);

const SearchStack = createStackNavigator();
export function SearchTabRoute({ rootStackNav, homeTabNav }) {
    return (
        <SearchStack.Navigator
            // this options hide all header
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={RouteNames.SearchScreen}
        > 
            <SearchStack.Screen name={RouteNames.SearchScreen}
                children={(_props) => <SearchScreen rootStackNav={rootStackNav} homeTabNav={homeTabNav} navigation={_props.navigation} />}
            /> 
        </SearchStack.Navigator>
    );
}

const ChatStack = createStackNavigator();
export function ChatTabRoute({ rootStackNav, homeTabNav }) {
    return (
        <ChatStack.Navigator
            // this options hide all header
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={RouteNames.ChatScreen}
        > 
            <ChatStack.Screen name={RouteNames.ChatScreen}
                children={(_props) => <ChatScreen rootStackNav={rootStackNav} homeTabNav={homeTabNav} navigation={_props.navigation} />}
            /> 
        </ChatStack.Navigator>
    );
}
 

const ProfileStack = createStackNavigator();
export function ProfileTabRoute({ rootStackNav, homeTabNav }) {
    return (
        <ProfileStack.Navigator
            // this options hide all header
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={RouteNames.ProfileScreen}
        >
            <ProfileStack.Screen name={RouteNames.ProfileScreen}
                children={(_props) => <ProfileScreen rootStackNav={rootStackNav} homeTabNav={homeTabNav} navigation={_props.navigation} />}
            />
        </ProfileStack.Navigator>
    );
}