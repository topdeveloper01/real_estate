import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { connect } from 'react-redux'; 
// custom input
import RouteNames from './names';
// guest modules
import WelcomeScreen from '../modules/tour/screens/WelcomeScreen'; 
import RegisterScreen from '../modules/tour/screens/RegisterScreen';  
// member modules
import HomeTabs from './home'; 
import VendorScreen from '../modules/home/screens/VendorScreen';   
import MyListingsScreen from '../modules/home/screens/MyListingsScreen'; 
// profile 
import ProfileEditScreen from '../modules/profile/screens/ProfileEditScreen';
import AddListingScreen from '../modules/profile/screens/AddListingScreen';
import PolicyScreen from '../modules/profile/screens/PolicyScreen';
import TermsScreen from '../modules/profile/screens/TermsScreen';
import NotificationsScreen from '../modules/profile/screens/NotificationsScreen';
import SendNotification from '../modules/profile/screens/SendNotification';
import City1Screen from '../modules/profile/screens/City1Screen';
import City2Screen from '../modules/profile/screens/City2Screen';
import City3Screen from '../modules/profile/screens/City3Screen';
// chat  
import MessagesScreen from '../modules/chat/screens/MessagesScreen'; 
 
const GuestStack = createStackNavigator(); 
const MemberStack = createStackNavigator();
 

function GuestRoute() {
	return (
		<NavigationContainer>
			<GuestStack.Navigator
				// this options hide all header
				screenOptions={{
					headerShown: false,
					gestureEnabled: true,
					gestureDirection: 'horizontal',
					gestureResponseDistance: {
						horizontal: 100,
					},
					...TransitionPresets.SlideFromRightIOS,
				}}
				initialRouteName={RouteNames.WelcomeScreen}
			>
				<GuestStack.Screen name={RouteNames.WelcomeScreen} component={WelcomeScreen} /> 
				<GuestStack.Screen name={RouteNames.RegisterScreen} component={RegisterScreen} /> 
			</GuestStack.Navigator>
		</NavigationContainer>
	);
}
 

function MemberRoute() {
	return (
		<NavigationContainer>
			<MemberStack.Navigator
				// this options hide all header
				screenOptions={{
					headerShown: false,
					gestureEnabled: false,
					gestureDirection: 'horizontal',
					gestureResponseDistance: {
						horizontal: 100,
					},
					...TransitionPresets.SlideFromRightIOS,
				}}
				initialRouteName={RouteNames.BottomTabs}
			>
				<MemberStack.Screen name={RouteNames.BottomTabs} component={HomeTabs} /> 
				<MemberStack.Screen name={RouteNames.VendorScreen} component={VendorScreen} />  
				<MemberStack.Screen name={RouteNames.ProfileEditScreen} component={ProfileEditScreen} />  
				<MemberStack.Screen name={RouteNames.MessagesScreen} component={MessagesScreen} />
			   
				{/* admin route */}
				<MemberStack.Screen name={RouteNames.AddListingScreen} component={AddListingScreen} />
				<MemberStack.Screen name={RouteNames.PrivacyPolicyScreen} component={PolicyScreen} />
				<MemberStack.Screen name={RouteNames.TermsScreen} component={TermsScreen} />
				<MemberStack.Screen name={RouteNames.NotificationsScreen} component={NotificationsScreen} />
				<MemberStack.Screen name={RouteNames.MyListingsScreen} component={MyListingsScreen} />
				<MemberStack.Screen name={RouteNames.SendNotification} component={SendNotification} />
				<MemberStack.Screen name={RouteNames.City1Screen} component={City1Screen} />
				<MemberStack.Screen name={RouteNames.City2Screen} component={City2Screen} />
				<MemberStack.Screen name={RouteNames.City3Screen} component={City3Screen} />
				
			</MemberStack.Navigator>
		</NavigationContainer>
	);
}

class RootStack extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
 
	render() {
		const { user, isLoggedIn  } = this.props;
  
		if (!isLoggedIn) {
			return <GuestRoute />;
		}  
		return <MemberRoute />;
	}
}

const mapStateToProps = ({ app }) => {
	return {
		user: app.user, 
		isLoggedIn: app.isLoggedIn, 
	};
};

export default connect(mapStateToProps, {})(RootStack);
