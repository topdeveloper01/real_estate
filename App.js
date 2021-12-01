import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { initStripe } from '@stripe/stripe-react-native';
import store from './src/store';
import AppRoot from './src/AppRoot';
import { MenuProvider } from 'react-native-popup-menu';
import Config from './src/config';

console.disableYellowBox = true;

class App extends Component {
	componentDidMount() {
		if (Config.isAndroid == false) {
			initStripe({
				// stripe initialize for apple pay
				publishableKey: Config.STRIPE_PUB_KEY,
				merchantIdentifier: Config.APPlE_MERCHANT_ID,
			});
		}
	}

	render() {
		return (
			<MenuProvider>
				<Provider store={store}>
					<View style={{ flex: 1 }}>
						<AppRoot />
					</View>
				</Provider>
			</MenuProvider>
		);
	}
}

export default App;
