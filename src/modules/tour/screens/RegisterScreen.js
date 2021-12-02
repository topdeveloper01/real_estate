import React from 'react';
import { Keyboard, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import AppText from '../../../common/components/AppText';
import MainBtn from '../../../common/components/buttons/main_button';
import AuthInput from '../../../common/components/AuthInput';
import PhoneVerificationScreen from './PhoneVerificationScreen';
import RouteNames from '../../../routes/names';
import { facebookLogin, login, PHONE_NOT_VERIFIED, register, appleLogin, setAsLoggedIn } from '../../../store/actions/auth';
import { extractErrorMessage, validateUserData } from '../../../common/services/utility';
import { getAddresses } from '../../../store/actions/app';
import alerts from '../../../common/services/alerts';


class RegisterScreen extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            confirm: null,
            loaded: false,
            loading: false,
            isKeyboadVisible: false,
            loadingFacebook: false,
            full_name: '',
            phone: '',
            email: '',
            password: '',
        };
    }

    state = {
        isKeyboadVisible: false,
        text: ""
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            this.keyboardDidShow
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            this._keyboardDidHide
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardDidShow = () => {
        this.setState({
            isKeyboadVisible: true
        });
    };

    _keyboardDidHide = () => {
        this.setState({
            isKeyboadVisible: false
        });
    };

    next() {
        this.setState({
            nextScreen: true,
        });
    }

    onEmailDone = () => {
        this.passwordInput.focus();
    };

    goBack = () => {
        this.props.navigation.navigate(RouteNames.HomeScreen);
    };

    register = () => {
        const { full_name, phone, email, password } = this.state;
        let pass2 = password;
        validateUserData({ full_name, email, phone, password, pass2 }, true).then(async () => {
            try { 
                const confirmation = await auth().signInWithPhoneNumber('+852' + phone);
                this.setState({confirm: confirmation})
            }
            catch (error) {
                console.log('onsignin,', error)
            }
        });
    };

	onRegisterUserData = async (id) => {  
        if (id == null) return;
        const { full_name, phone, email, password } = this.state;
		let logged_user_data = await this.props.register({id, full_name, email, phone, photo : '', admin : false });
		if (logged_user_data != null) { 
			this.props.setAsLoggedIn();
		} 
	}

    render() {
        const { loading, confirm, full_name, phone, email, password } = this.state; 

        if (confirm != null) {
            return <PhoneVerificationScreen
                isSignin={false}
                user={{
                    full_name, phone, email, password
                }}
                FbConfirm={confirm}
                goBack={() => {
                    this.setState({confirm: null})
                }}
                onSuccess={this.onRegisterUserData}
            />
        }
 
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff', }}>
                <KeyboardAwareScrollView style={[{ flex: 1, width: '100%', padding: 20 }]} keyboardShouldPersistTaps='handled'>
                    <View style={[styles.formview]}>
                        <View style={[Theme.styles.col_center, { width: '100%', alignItems: 'flex-start' }]}>
                            <AppText style={styles.title}>註冊</AppText>
                            <AppText style={styles.sub_title}>建立新帳戶</AppText>
                        </View>
                        <AuthInput
                            placeholder={'用戶名稱'}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'default'}
                            selectionColor={Theme.colors.cyan2}
                            onChangeText={full_name => this.setState({ full_name })}
                            // onSubmitEditing={() => this.onEmailDone()}
                            returnKeyType={'next'}
                            autoCapitalize={'none'}
                            value={this.state.full_name}
                            secure={false}
                            placeholderTextColor={Theme.colors.text}
                            backgroundColor={Theme.colors.gray4}
                            style={{ marginBottom: 20, backgroundColor: Theme.colors.gray4 }}
                        />
                        <AuthInput
                            placeholder={'電話號碼'}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'phone-pad'}
                            selectionColor={Theme.colors.cyan2}
                            onChangeText={phone => this.setState({ phone })}
                            // onSubmitEditing={() => this.onEmailDone()}
                            returnKeyType={'next'}
                            autoCapitalize={'none'}
                            value={this.state.phone}
                            secure={false}
                            placeholderTextColor={Theme.colors.text}
                            backgroundColor={Theme.colors.gray4}
                            style={{ marginBottom: 20, backgroundColor: Theme.colors.gray4 }}
                        />
                        <AuthInput
                            placeholder={'電郵'}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'email-address'}
                            selectionColor={Theme.colors.cyan2}
                            onChangeText={email => this.setState({ email })}
                            // onSubmitEditing={() => this.onEmailDone()}
                            returnKeyType={'next'}
                            autoCapitalize={'none'}
                            value={this.state.email}
                            secure={false}
                            placeholderTextColor={Theme.colors.text}
                            backgroundColor={Theme.colors.gray4}
                            style={{ marginBottom: 20, backgroundColor: Theme.colors.gray4 }}
                        />
                        <AuthInput
                            placeholder={'密碼'}
                            underlineColorAndroid={'transparent'}
                            setRef={(input) => {
                                this.passwordInput = input;
                            }}
                            autoCapitalize={'none'}
                            onChangeText={password => this.setState({ password })}
                            // onSubmitEditing={() => this.login()}
                            returnKeyType={'done'}
                            value={this.state.password}
                            secure={true}
                            placeholderTextColor={Theme.colors.text}
                            backgroundColor={Theme.colors.gray4}
                            style={{ marginBottom: 20, backgroundColor: Theme.colors.gray4 }}
                            setRef={ref => ref && ref.setNativeProps({ style: { fontFamily: 'Yellix-Medium' } })}
                        />
                        <MainBtn
                            disabled={loading}
                            loading={loading}
                            title={'確認'}
                            onPress={() => this.register()}
                        />
                    </View>
                </KeyboardAwareScrollView>
                {
                    !this.state.isKeyboadVisible &&
                    <View style={[Theme.styles.row_center, styles.bottom]}>
                        <AppText style={styles.descTxt}>
                            已經註冊？
                        </AppText>
                        <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                            <AppText style={styles.create_accountText}>
                                登錄
                            </AppText>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formview: { flex: 1, width: '100%', backgroundColor: '#ffffff', position: 'relative' },
    title: { marginTop: 40, fontSize: 32, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
    sub_title: { marginBottom: 30, fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
    descTxt: {
        color: Theme.colors.text,
        fontSize: 14,
        fontFamily: Theme.fonts.semiBold,
        marginVertical: Theme.sizes.xTiny,
    },
    create_accountText: {
        color: Theme.colors.btnPrimary,
        fontSize: 14,
        fontFamily: Theme.fonts.semiBold,
        marginVertical: Theme.sizes.xTiny,
    },
    bottom: { marginBottom: 40 }
})

const mapStateToProps = ({ app }) => ({
    user: app.user,
});

export default connect(
    mapStateToProps,
    {
        register,
        login,
        facebookLogin,
        getAddresses,
        setAsLoggedIn,
        appleLogin
    },
)(RegisterScreen);
