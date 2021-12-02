import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
// custom input
import RouteNames from './names';
// guest modules
import WelcomeScreen from '../modules/tour/screens/WelcomeScreen';
import LoginScreen from '../modules/tour/screens/LoginScreen';
import RegisterScreen from '../modules/tour/screens/RegisterScreen';
import ForgetPassScreen from '../modules/tour/screens/ForgetPassScreen';
import ResetPassScreen from '../modules/tour/screens/ResetPassScreen';
import ResetPassDoneScreen from '../modules/tour/screens/ResetPassDoneScreen';
import AlmostDoneScreen from '../modules/tour/screens/AlmostDoneScreen';
import LocationSetupScreen from '../modules/tour/screens/LocationSetupScreen';
import OnboardingScreen from '../modules/tour/screens/OnboardingScreen';
import PhoneVerificationScreen from '../modules/tour/screens/PhoneVerificationScreen';
import EditPhoneScreen from '../modules/tour/screens/EditPhoneScreen';
// member modules
import HomeTabs from './home';
import FilterScreen from '../modules/home/screens/FilterScreen';
import VendorScreen from '../modules/home/screens/VendorScreen';
import VendorLocationScreen from '../modules/home/screens/VendorLocationScreen';
import FoodScreen from '../modules/home/screens/FoodScreen';
import PastOrderScreen from '../modules/home/screens/PastOrderScreen';
import CartScreen from '../modules/home/screens/CartScreen';
import NewAddressScreen from '../modules/home/screens/NewAddressScreen';
import AddressMapScreen from '../modules/home/screens/AddressMapScreen';
import CartPaymentScreen from '../modules/home/screens/CartPaymentScreen';
import CartSplitScreen from '../modules/home/screens/CartSplitScreen';
import SplitOrderScreen from '../modules/home/screens/SplitOrderScreen';
import SplitOrderNotuserScreen from '../modules/home/screens/SplitOrderNotuserScreen';
import OrderSummScreen from '../modules/orders/screens/OrderSummScreen';
import SnapfoodersSplitScreen from '../modules/home/screens/SnapfoodersSplitScreen';
// order
import OrderFilterScreen from '../modules/orders/screens/FilterScreen';
import TrackOrderScreen from '../modules/orders/screens/TrackOrderScreen';
import OrderReviewScreen from '../modules/orders/screens/OrderReviewScreen';
// profile
import SettingScreen from '../modules/profile/screens/SettingScreen';
import ChangePasswordScreen from '../modules/profile/screens/ChangePasswordScreen';
import FavouritesScreen from '../modules/profile/screens/FavouritesScreen';
import AddressesScreen from '../modules/profile/screens/AddressesScreen';
import WalletScreen from '../modules/profile/screens/WalletScreen';
import InviteScreen from '../modules/profile/screens/InviteScreen';
import ConfirmIdentityScreen from '../modules/profile/screens/ConfirmIdentityScreen';
import PaymentMethodsScreen from '../modules/profile/screens/PaymentMethodsScreen';
import NewCardScreen from '../modules/profile/screens/NewCardScreen';
import ProfileEditScreen from '../modules/profile/screens/ProfileEditScreen';
import BlogScreen from '../modules/profile/screens/BlogScreen';
import BlogDetailsScreen from '../modules/profile/screens/BlogDetailsScreen';
import BlogFilterScreen from '../modules/profile/screens/BlogFilterScreen';
import PromotionsScreen from '../modules/profile/screens/PromotionsScreen';
// chat
import NewCallScreen from '../modules/chat/screens/NewCallScreen';
import NewChatScreen from '../modules/chat/screens/NewChatScreen';
import NewGroupScreen from '../modules/chat/screens/NewGroupScreen';
import InvitationsScreen from '../modules/chat/screens/InvitationsScreen';
import SnapfoodMapScreen from '../modules/chat/screens/SnapfoodMapScreen';
import MyFriendsScreen from '../modules/chat/screens/MyFriendsScreen';
import SnapfoodersScreen from '../modules/chat/screens/SnapfoodersScreen';
import CallScreen from '../modules/chat/screens/CallScreen';
import SnapfooderScreen from '../modules/chat/screens/SnapfooderScreen';
import CreateGroupScreen from '../modules/chat/screens/CreateGroupScreen';
import MessagesScreen from '../modules/chat/screens/MessagesScreen';
import LocationPickupScreen from '../modules/chat/screens/LocationPickupScreen';
import LocationMsgScreen from '../modules/chat/screens/LocationMsgScreen';

import AddListingScreen from '../modules/profile/screens/AddListingScreen';
import PolicyScreen from '../modules/profile/screens/PolicyScreen';
import TermsScreen from '../modules/profile/screens/TermsScreen';
import NotificationsScreen from '../modules/profile/screens/NotificationsScreen';
import MyListingsScreen from '../modules/home/screens/MyListingsScreen';

const OnboardStack = createStackNavigator();
const GuestStack = createStackNavigator();
const PhoneVerifyStack = createStackNavigator();
const SetupLocationStack = createStackNavigator();
const MemberStack = createStackNavigator();

function OnBoardRoute() {
	return (
		<NavigationContainer>
			<OnboardStack.Navigator
				// this options hide all header
				screenOptions={{
					headerShown: false,
					gestureEnabled: false,
					gestureDirection: 'horizontal',
					...TransitionPresets.SlideFromRightIOS,
				}}
				initialRouteName={RouteNames.OnboardingScreen}
			>
				<OnboardStack.Screen name={RouteNames.OnboardingScreen} component={OnboardingScreen} />
				<OnboardStack.Screen name={RouteNames.AlmostDoneScreen} component={AlmostDoneScreen} />
				<OnboardStack.Screen
					name={RouteNames.LocationSetupScreen}
					component={LocationSetupScreen}
					options={{
						gestureEnabled: false,
					}}
				/>
			</OnboardStack.Navigator>
		</NavigationContainer>
	);
}

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
				<GuestStack.Screen name={RouteNames.LoginScreen} component={LoginScreen} />
				<GuestStack.Screen name={RouteNames.RegisterScreen} component={RegisterScreen} />
				<GuestStack.Screen name={RouteNames.ForgotScreen} component={ForgetPassScreen} />
				<GuestStack.Screen name={RouteNames.ResetPassScreen} component={ResetPassScreen} />
				<GuestStack.Screen name={RouteNames.ResetPassDoneScreen} component={ResetPassDoneScreen} />
			</GuestStack.Navigator>
		</NavigationContainer>
	);
}

function PhoneVerifyRoute() {
	return (
		<NavigationContainer>
			<PhoneVerifyStack.Navigator
				// this options hide all header
				screenOptions={{
					headerShown: false,
				}}
				initialRouteName={RouteNames.PhoneVerificationScreen}
			>
				<PhoneVerifyStack.Screen
					name={RouteNames.PhoneVerificationScreen}
					component={PhoneVerificationScreen}
				/>
				<PhoneVerifyStack.Screen name={RouteNames.EditPhoneScreen} component={EditPhoneScreen} />
			</PhoneVerifyStack.Navigator>
		</NavigationContainer>
	);
}

function SetupLocationRoute() {
	return (
		<NavigationContainer>
			<SetupLocationStack.Navigator
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
				initialRouteName={RouteNames.AlmostDoneScreen}
			>
				<SetupLocationStack.Screen name={RouteNames.AlmostDoneScreen} component={AlmostDoneScreen} />
				<SetupLocationStack.Screen name={RouteNames.LocationSetupScreen} component={LocationSetupScreen} />
			</SetupLocationStack.Navigator>
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
					gestureEnabled: true,
					gestureDirection: 'horizontal',
					gestureResponseDistance: {
						horizontal: 100,
					},
					...TransitionPresets.SlideFromRightIOS,
				}}
				initialRouteName={RouteNames.BottomTabs}
			>
				<MemberStack.Screen name={RouteNames.BottomTabs} component={HomeTabs} />
				<MemberStack.Screen name={RouteNames.LocationSetupScreen} component={LocationSetupScreen} />
				<MemberStack.Screen name={RouteNames.FilterScreen} component={FilterScreen} />
				<MemberStack.Screen
					name={RouteNames.VendorScreen}
					component={VendorScreen}
					options={{
						gestureResponseDistance: {
							horizontal: 40,
						},
					}}
				/>
				<MemberStack.Screen name={RouteNames.VendorLocationScreen} component={VendorLocationScreen} />
				<MemberStack.Screen name={RouteNames.FoodScreen} component={FoodScreen} />
				<MemberStack.Screen name={RouteNames.PastOrderScreen} component={PastOrderScreen} />
				<MemberStack.Screen name={RouteNames.CartScreen} component={CartScreen} />
				<MemberStack.Screen name={RouteNames.NewAddressScreen} component={NewAddressScreen} />
				<MemberStack.Screen name={RouteNames.AddressMapScreen} component={AddressMapScreen} />
				<MemberStack.Screen name={RouteNames.CartPaymentScreen} component={CartPaymentScreen} />
				<MemberStack.Screen name={RouteNames.CartSplitScreen} component={CartSplitScreen} />
				<MemberStack.Screen name={RouteNames.SplitOrderScreen} component={SplitOrderScreen} />
				<MemberStack.Screen name={RouteNames.SplitOrderNotuserScreen} component={SplitOrderNotuserScreen} />
				<MemberStack.Screen
					name={RouteNames.OrderSummScreen}
					component={OrderSummScreen}
					options={{ gestureEnabled: false }}
				/>
				<MemberStack.Screen name={RouteNames.OrderFilterScreen} component={OrderFilterScreen} />
				<MemberStack.Screen name={RouteNames.TrackOrderScreen} component={TrackOrderScreen} />
				<MemberStack.Screen name={RouteNames.OrderReviewScreen} component={OrderReviewScreen} />
				<MemberStack.Screen name={RouteNames.SettingScreen} component={SettingScreen} />
				<MemberStack.Screen name={RouteNames.ChangePasswordScreen} component={ChangePasswordScreen} />
				<MemberStack.Screen name={RouteNames.FavouritesScreen} component={FavouritesScreen} />
				<MemberStack.Screen name={RouteNames.AddressesScreen} component={AddressesScreen} />
				<MemberStack.Screen name={RouteNames.WalletScreen} component={WalletScreen} />
				<MemberStack.Screen name={RouteNames.InviteScreen} component={InviteScreen} />
				<MemberStack.Screen name={RouteNames.ConfirmIdentityScreen} component={ConfirmIdentityScreen} />
				<MemberStack.Screen name={RouteNames.PaymentMethodsScreen} component={PaymentMethodsScreen} />
				<MemberStack.Screen name={RouteNames.NewCardScreen} component={NewCardScreen} />
				<MemberStack.Screen name={RouteNames.ProfileEditScreen} component={ProfileEditScreen} />
				<MemberStack.Screen name={RouteNames.BlogScreen} component={BlogScreen} />
				<MemberStack.Screen name={RouteNames.BlogDetailsScreen} component={BlogDetailsScreen} />
				<MemberStack.Screen name={RouteNames.BlogFilterScreen} component={BlogFilterScreen} />
				<MemberStack.Screen name={RouteNames.PromotionsScreen} component={PromotionsScreen} />
				<MemberStack.Screen name={RouteNames.SnapfoodersSplitScreen} component={SnapfoodersSplitScreen} />

				{/* chat */}
				<MemberStack.Screen name={RouteNames.NewCallScreen} component={NewCallScreen} />
				<MemberStack.Screen name={RouteNames.NewChatScreen} component={NewChatScreen} />
				<MemberStack.Screen name={RouteNames.NewGroupScreen} component={NewGroupScreen} />
				<MemberStack.Screen name={RouteNames.InvitationsScreen} component={InvitationsScreen} />
				<MemberStack.Screen name={RouteNames.SnapfoodMapScreen} component={SnapfoodMapScreen} />
				<MemberStack.Screen name={RouteNames.SnapfoodersScreen} component={SnapfoodersScreen} />
				<MemberStack.Screen name={RouteNames.CallScreen} component={CallScreen} />
				<MemberStack.Screen name={RouteNames.MyFriendsScreen} component={MyFriendsScreen} />
				<MemberStack.Screen name={RouteNames.SnapfooderScreen} component={SnapfooderScreen} />
				<MemberStack.Screen name={RouteNames.CreateGroupScreen} component={CreateGroupScreen} />
				<MemberStack.Screen
					name={RouteNames.MessagesScreen}
					component={MessagesScreen}
					options={{
						gestureResponseDistance: {
							horizontal: 20,
						},
					}}
				/>
				<MemberStack.Screen name={RouteNames.LocationPickupScreen} component={LocationPickupScreen} />
				<MemberStack.Screen name={RouteNames.LocationMsgScreen} component={LocationMsgScreen} />

				{/* not loggedin user */}
				<MemberStack.Screen name={RouteNames.WelcomeScreen} component={WelcomeScreen} />
				<MemberStack.Screen name={RouteNames.LoginScreen} component={LoginScreen} />
				<MemberStack.Screen name={RouteNames.RegisterScreen} component={RegisterScreen} />
				<MemberStack.Screen name={RouteNames.ForgotScreen} component={ForgetPassScreen} />
				<MemberStack.Screen name={RouteNames.ResetPassScreen} component={ResetPassScreen} />
				<MemberStack.Screen name={RouteNames.ResetPassDoneScreen} component={ResetPassDoneScreen} />

				{/* admin route */}
				<MemberStack.Screen name={RouteNames.AddListingScreen} component={AddListingScreen} />
				<MemberStack.Screen name={RouteNames.PrivacyPolicyScreen} component={PolicyScreen} />
				<MemberStack.Screen name={RouteNames.TermsScreen} component={TermsScreen} />
				<MemberStack.Screen name={RouteNames.NotificationsScreen} component={NotificationsScreen} />
				<MemberStack.Screen name={RouteNames.MyListingsScreen} component={MyListingsScreen} />
				
			</MemberStack.Navigator>
		</NavigationContainer>
	);
}

class RootStack extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	componentDidMount() {
		this.languageChangeListener = EventRegister.on('language-updated', () => {
			this.forceUpdate();
		});
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.languageChangeListener);
	}

	render() {
		const { user, isLoggedIn, seenOnboard, hasVerifiedPhone, needLogin, hasLocation } = this.props;

		console.log(user.phone, isLoggedIn, seenOnboard, hasVerifiedPhone, needLogin, hasLocation);
		if (!isLoggedIn) {
			return <GuestRoute />;
		}  
		return <MemberRoute />;
	}
}

const mapStateToProps = ({ app }) => {
	return {
		user: app.user,
		language: app.language,
		isLoggedIn: app.isLoggedIn,
		hasLocation: app.hasLocation,
		seenOnboard: app.seenOnboard,
		hasVerifiedPhone: app.hasVerifiedPhone,
		needLogin: app.needLogin,
	};
};

export default connect(mapStateToProps, {})(RootStack);
