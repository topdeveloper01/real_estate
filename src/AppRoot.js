import React from 'react';
import { AsyncStorage, StatusBar, View } from 'react-native';
import BottomTabs from './routes/stack';
import { setStorageKey, getStorageKey, KEYS } from './common/services/storage';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import { getLoggedInUser, legacyLogin, setAsLoggedIn, setAsSeenOnboard, setUserNeedLogin } from './store/actions/auth';
import * as RNLocalize from 'react-native-localize';
import {
	closeRatingModal,
	getAddresses,
	getLastUnReviewedOrder,
	setAddress,
	setSafeAreaData,
	loadAppLang,
	addDefaultAddress,
	goActiveScreenFromPush,
} from './store/actions/app';
import { updateCartItems } from './store/actions/shop';
import { updateProfileDetails } from './store/actions/auth';
import { loadUserSetting } from './common/services/user';
import {
	PUSH_NOTIFICATION_NEW_BLOG,
	PUSH_NOTIFICATION_NEW_VENDOR,
	PUSH_NOTIFICATION_OPENED_EVENT,
	PUSH_NOTIFICATION_RECEIVED_EVENT,
	setupPushNotifications,
} from './common/services/pushNotifications';
import { EventRegister } from 'react-native-event-listeners';
import apiFactory from './common/services/apiFactory';
import { openRateAppModal, shouldOpenRateAppModal, updateOpenedAppCount } from './common/services/rate';

class AppRoot extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			orderDetails: {},
			loadedInfo: false,
			messages: [],
		};
	}

	onAuthStateChanged = (user) => {
		this.loadLoginInfo(user.uid);
	}

	async componentDidMount() {
		this.FbAuth_subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);

		RNLocalize.addEventListener('change', this.handleLocalizationChange);
		this.setupNotificationListener();
		const wasOpenedByNotification = await setupPushNotifications();
		if (wasOpenedByNotification) {
			console.log('was Opened By Notification');
		}

		this.unsubscribe = messaging().onMessage(async (remoteMessage) => {
			console.log('onMessage', remoteMessage);
			EventRegister.emit(PUSH_NOTIFICATION_RECEIVED_EVENT, remoteMessage);
		});

		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
			if (this.unsubscribe) {
				console.log('background unsubscribe on message');
				this.unsubscribe();
			}
			console.log('Message handled in the background!', remoteMessage);
			EventRegister.emit(PUSH_NOTIFICATION_RECEIVED_EVENT, remoteMessage);
		});
	}

	componentWillUnmount() {
		if (this.FbAuth_subscriber) {
			this.FbAuth_subscriber();
		}
		if (this.unsubscribe) {
			console.log('app route unmount');
			this.unsubscribe();
		}
		if (this.pushNotiListener) {
			EventRegister.removeEventListener(this.pushNotiListener);
		}
		RNLocalize.removeEventListener('change', this.handleLocalizationChange);
	}

	checkStoreRating = async () => {
		const shouldOpen = await shouldOpenRateAppModal();
		if (shouldOpen) {
			openRateAppModal();
		} else {
			await updateOpenedAppCount();
		}
	};

	setupNotificationListener = () => {
		this.pushNotiListener = EventRegister.addEventListener(
			PUSH_NOTIFICATION_RECEIVED_EVENT,
			async (notification) => {
				this.onNotificationOpened(notification);
			}
		);
	};

	onNotificationOpened = async (notification) => {
		const vm = this;

		console.log('onNotificationOpened', notification);
		if (notification && notification.data) {
			switch (notification.data.type) {
				case 'order_status_change': {
					await vm.props.goActiveScreenFromPush({
						isOrderSummVisible: true,
						order: {
							id: notification.data['order_id'],
							status: notification.data['status']
						},
					});
					break;
				}
				case 'user_category_change': {
					try {
						await vm.props.goActiveScreenFromPush({
							isWalletVisible: true,
						});
					} catch (error) {
						console.log('user_category_change', error);
					}
					break;
				}
				case 'friend_request_notification': {
					try {
						console.log('isInvitationVisible');
						await vm.props.goActiveScreenFromPush({
							isInvitationVisible: true,
						});
					} catch (error) {
						console.log('friend_request_notification', error);
					}
					break;
				}
				case 'group_chat_invite_notification': {
					try {
						await vm.props.goActiveScreenFromPush({
							isChatVisible: true,
							pushConversationId: notification.data.conversation_id,
							pushChatMsgTime: new Date().getTime(),
						});
					} catch (error) {
						console.log('friend_request_notification', error);
					}
					break;
				}
				case 'chat_notification': {
					try {
						await vm.props.goActiveScreenFromPush({
							isChatVisible: true,
							pushConversationId: notification.data.conversation_id,
							pushChatMsgTime: notification.data.date_time
						});
					} catch (error) {
						console.log('friend_request_notification', error);
					}
					break;
				}
				case 'vendor_notification': {
					setTimeout(() => {
						try {
							EventRegister.emit(PUSH_NOTIFICATION_NEW_VENDOR, notification.data);
						} catch (e) {
							console.log(e);
						}
					}, 100);
					break;
				}
				case 'blog_notification': {
					try {
						await vm.props.goActiveScreenFromPush({
							isBlogVisible: true,
							pushBlogId: notification.data.blog_id,
						});
					} catch (error) {
						console.log('blog_notification', error);
					}
					break;
				}
				default: {
					//GOT NOTHING TO DO xD
				}
			}
		}
	};

	handleLocalizationChange = async () => {
		await this.props.loadAppLang().then();
		this.forceUpdate();
	};

	appLoaded = () => {
		this.setState({ loadedInfo: true }, () => {
			SplashScreen.hide();
		});
	};

	loadDimCarts = async () => {
		try {
			await this.props.setSafeAreaData();
		} catch (e) {
			console.log(e);
		}
		try {
			const cartItems = await getStorageKey(KEYS.CART_ITEMS);
			if (cartItems) {
				this.props.updateCartItems(cartItems);
			}
		} catch (e) {
			console.log(e);
		}
	}

	loadSettings = async () => {
		this.loadDimCarts();

		try {
			await this.props.loadAppLang();
		} catch (e) {
			console.log('loadAppLang err', e);
		}

		try {
			const seenOnboard = await getStorageKey(KEYS.SEEN_ONBOARD);
			if (seenOnboard == true) {
				await this.props.setAsSeenOnboard();
			}
		} catch (e) {
			console.log(e);
		}
	};

	loadLoginInfo = async (user_id) => {
		let logged_user_data = null;
		try {
			logged_user_data = await this.props.getLoggedInUser(user_id);
			if (logged_user_data != null) {
				this.props.setAsLoggedIn();
			} 
		} catch (e) {
			console.log('load Login Info error', e);
		}  
		this.appLoaded();
	};

	renderContent = () => {
		const { loadedInfo } = this.state;
		if (!loadedInfo) {
			return null;
		}
		return <BottomTabs />;
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<StatusBar translucent={true} backgroundColor='transparent' barStyle='dark-content' />
				{/* {!Config.isAndroid && <StatusBar barStyle={'dark-content'} />} */}
				{this.renderContent()}
			</View>
		);
	}
}

const mapStateToProps = ({ app }) => ({
	isReviewModalVisible: app.isReviewModalVisible,
	reviewModalData: app.reviewModalData,
});

export default connect(mapStateToProps, {
	setAsSeenOnboard,
	updateCartItems,

	setSafeAreaData,
	getLastUnReviewedOrder,
	closeRatingModal,
	legacyLogin,
	loadAppLang,

	setAsLoggedIn,
	setUserNeedLogin,
	getLoggedInUser,
	setAddress,
	getAddresses,
	updateProfileDetails,
	addDefaultAddress,
	goActiveScreenFromPush,
})(AppRoot);
