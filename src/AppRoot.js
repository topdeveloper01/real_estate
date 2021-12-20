import React from 'react';
import {   StatusBar, View } from 'react-native';
import BottomTabs from './routes/stack';
import { setStorageKey, getStorageKey, KEYS } from './common/services/storage';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging'; 
import { connect } from 'react-redux';
import { getLoggedInUser ,setAsLoggedIn, } from './store/actions/auth'; 
import { 
	PUSH_NOTIFICATION_RECEIVED_EVENT,
	setupPushNotifications,
} from './common/services/pushNotifications';
import { EventRegister } from 'react-native-event-listeners'; 

class AppRoot extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			orderDetails: {},
			loadedInfo: false,
			messages: [],
		};
	}


	async componentDidMount() {
		await this.loadLoginInfo();
 
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
		if (this.unsubscribe) {
			console.log('app route unmount');
			this.unsubscribe();
		}
		if (this.pushNotiListener) {
			EventRegister.removeEventListener(this.pushNotiListener);
		} 
	}
 

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
				case 'chat_notification': { 
					break;
				} 
				default: {
					//GOT NOTHING TO DO xD
				}
			}
		}
	};
 

	appLoaded = () => {
		this.setState({ loadedInfo: true }, () => {
			SplashScreen.hide();
		});
	};
  
	loadLoginInfo = async () => {  
		try {
			let token = await getStorageKey(KEYS.TOKEN);
			if (token) {
				console.log('token', token); 
				let logged_user_data = await this.props.getLoggedInUser(token);
				if (logged_user_data != null) {
					this.props.setAsLoggedIn();
				} 
			}
		} catch (e) {
			console.log('loadLoginInfo error', e);
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
				{this.renderContent()}
			</View>
		);
	}
}

const mapStateToProps = ({ app }) => ({  
});

export default connect(mapStateToProps, {   
	setAsLoggedIn, 
	getLoggedInUser,   
})(AppRoot);
