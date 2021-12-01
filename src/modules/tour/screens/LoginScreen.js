import React from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { extractErrorMessage, validateUserData } from '../../../common/services/utility';
import { translate } from '../../../common/services/translate';
import { setAsLoggedIn, login, register, getLoggedInUser, PHONE_NOT_VERIFIED, setUserNeedLogin, updateProfileDetails } from '../../../store/actions/auth';
import { getAddresses, setAddress, addDefaultAddress } from '../../../store/actions/app';
import { loadUserSetting } from '../../../common/services/user';
import alerts from '../../../common/services/alerts';
import { isEmpty, validateEmailAddress, openExternalUrl } from '../../../common/services/utility';
import Theme from '../../../theme';
import Header1 from '../../../common/components/Header1';
import SwitchTab from '../../../common/components/SwitchTab';
import AppText from '../../../common/components/AppText';
import MainBtn from '../../../common/components/buttons/main_button';
import AuthInput from '../../../common/components/AuthInput';
import Authpage from '../../../common/components/Authpage';

const tabs = ['Login', 'Register']
class LoginScreen extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            isKeyboadVisible: false,
            loadingFacebook: false,
            email: '',
            password: '',
            curTab: props.route.params != null ? (props.route.params.page || 'Login') : 'Login',
            backRoute : props.route.params != null ? props.route.params.backRoute : null
        };
    }

    onChangeTab = (tab) => {
        if (this.state.curTab != tab) {
            this.setState({ email: '', password: '', full_name: '', phone: '' })
        }
        this.setState({ curTab: tab })
    }

    login = async () => {
        const { email, password } = this.state;
        if (email == '' || password == '') {
            alerts.error(translate('attention'), translate('fill_all_fields'));
            return;
        }
        if (validateEmailAddress(email) === false) {
            alerts.error(translate('attention'), translate('wrong_email_format'));
            return;
        }

        this.setState({ loading: true });
        try {
            const logged_user_data = await this.props.login({ email, password });

            this.setState({ loading: false });
            await loadUserSetting(this.props, logged_user_data);
            if (this.state.backRoute) {
                this.props.navigation.pop(2);
            }
        }
        catch (e) {
            console.log('login', e)
            this.setState({ loading: false });
            alerts.error(translate('restaurant_details.we_are_sorry'), extractErrorMessage(e));
        }
    };

    register = () => {
        const { full_name, phone, email, password } = this.state;
        let pass2 = password;
        validateUserData({ full_name, email, phone, password, pass2 }, true).then(async () => {
            if (!this.state.loading) {
                this.setState({ loading: true });
                try {
                    await this.props.register({ full_name, email, phone, password });
                    const logged_user_data =  await this.props.login({ email, password });

                    this.setState({ loading: false });
                    await loadUserSetting(this.props, logged_user_data);
                    
                    if (this.state.backRoute) {
                        this.props.navigation.pop(2);
                    }
                }
                catch (e) {
                    console.log('register', e)
                    this.setState({ loading: false });
                    alerts.error(translate('restaurant_details.we_are_sorry'), extractErrorMessage(e));
                }
            }
        });
    };

    _openForgetPassword = () => {
        openExternalUrl('https://snapfood.al/auth/login');
    };

    renderLoginForm() {
        const { loading, loadingFacebook } = this.state;
        return <View style={[{ flex: 1, width: '100%', paddingHorizontal: 20, backgroundColor: '#ffffff' }]} keyboardShouldPersistTaps='handled'>
            <KeyboardAwareScrollView style={[{ width: '100%' }]}>
                <View style={[styles.formview]}>
                    <AuthInput
                        placeholder={translate('auth_login.email_address')}
                        underlineColorAndroid={'transparent'}
                        keyboardType={'email-address'}
                        placeholderTextColor={'#DFDFDF'}
                        selectionColor={Theme.colors.cyan2}
                        onChangeText={email => this.setState({ email })}
                        returnKeyType={'next'}
                        autoCapitalize={'none'}
                        value={this.state.email}
                        secure={false}
                        style={{ marginBottom: 20 }}
                    />
                    <AuthInput
                        placeholder={translate('auth_login.password')}
                        underlineColorAndroid={'transparent'}
                        setRef={(input) => {
                            this.passwordInput = input;
                        }}
                        autoCapitalize={'none'}
                        placeholderTextColor={'#DFDFDF'}
                        onChangeText={password => this.setState({ password })}
                        returnKeyType={'done'}
                        value={this.state.password}
                        secure={true}
                        style={{ marginBottom: 10 }}
                        setRef={ref => ref && ref.setNativeProps({ style: { fontFamily: 'Yellix-Medium' } })} 
                    />
                    <TouchableOpacity style={{ marginBottom: 40 }} onPress={this._openForgetPassword}>
                        <AppText style={styles.forgotPasswordText}>
                            {translate('auth_login.forgot_your_password')}
                        </AppText>
                    </TouchableOpacity>
                    <MainBtn
                        disabled={loading}
                        loading={loading}
                        title={translate('auth_login.login_button')}
                        onPress={() => {
                            this.login()
                        }}
                    />
                </View>
            </KeyboardAwareScrollView>
            {
                !this.state.isKeyboadVisible &&
                <View style={[Theme.styles.row_center, { width: '100%', marginBottom: 40, }]}>
                    <View style={[Theme.styles.row_center]}>
                        <AppText style={styles.descTxt}>
                            {translate('auth_login.no_account')}
                        </AppText>
                        <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => this.setState({ curTab: 'Register' })}>
                            <AppText style={styles.create_accountText}>
                                {translate('create_account')}
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </View>
    }

    renderRegisterForm() {
        const { loading, loadingFacebook } = this.state;
        return (
            <View style={{ flex: 1, width: '100%', backgroundColor: '#ffffff', }}>
                <KeyboardAwareScrollView style={[{ flex: 1, width: '100%', paddingHorizontal: 20 }]} keyboardShouldPersistTaps='handled'>
                    <View style={[styles.formview]}>
                        <AuthInput
                            placeholder={translate('auth_register.full_name')}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'default'}
                            placeholderTextColor={'#DFDFDF'}
                            selectionColor={Theme.colors.cyan2}
                            onChangeText={full_name => this.setState({ full_name })}
                            returnKeyType={'next'}
                            autoCapitalize={'none'}
                            value={this.state.full_name}
                            secure={false}
                            style={{ marginBottom: 20 }}
                        />
                        <AuthInput
                            placeholder={translate('auth_register.cell')}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'phone-pad'}
                            placeholderTextColor={'#DFDFDF'}
                            selectionColor={Theme.colors.cyan2}
                            onChangeText={phone => this.setState({ phone })}
                            returnKeyType={'next'}
                            autoCapitalize={'none'}
                            value={this.state.phone}
                            secure={false}
                            style={{ marginBottom: 20 }}
                        />
                        <AuthInput
                            placeholder={translate('auth_login.email_address')}
                            underlineColorAndroid={'transparent'}
                            keyboardType={'email-address'}
                            placeholderTextColor={'#DFDFDF'}
                            selectionColor={Theme.colors.cyan2}
                            onChangeText={email => this.setState({ email })}
                            returnKeyType={'next'}
                            autoCapitalize={'none'}
                            value={this.state.email}
                            secure={false}
                            style={{ marginBottom: 20 }}
                        />
                        <AuthInput
                            placeholder={translate('auth_login.password')}
                            underlineColorAndroid={'transparent'}
                            setRef={(input) => {
                                this.passwordInput = input;
                            }}
                            autoCapitalize={'none'}
                            placeholderTextColor={'#DFDFDF'}
                            onChangeText={password => this.setState({ password })}
                            returnKeyType={'done'}
                            value={this.state.password}
                            secure={true}
                            style={{ marginBottom: 40 }}
                            setRef={ref => ref && ref.setNativeProps({ style: { fontFamily: 'Yellix-Medium' } })} 
                        />
                        <MainBtn
                            disabled={loading}
                            loading={loading}
                            title={translate('create_account')}
                            onPress={() => this.register()}
                        />
                    </View>
                </KeyboardAwareScrollView>
                {
                    !this.state.isKeyboadVisible &&
                    <View style={[Theme.styles.row_center, { marginBottom: 40, }]}>
                        <AppText style={styles.descTxt}>
                            {translate('auth_register.already_registered')}
                        </AppText>
                        <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => this.setState({ curTab: 'Login' })}>
                            <AppText style={styles.create_accountText}>
                                {translate('auth_login.login_button')}
                            </AppText>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Authpage onKeyboardDidShow={() => {
                    this.setState({
                        isKeyboadVisible: true
                    });
                }}
                    onKeyboardDidHide={() => {
                        this.setState({
                            isKeyboadVisible: false
                        });
                    }}>
                    <SwitchTab
                        items={tabs}
                        curitem={this.state.curTab}
                        onSelect={(item) => this.onChangeTab(item)}
                        style={styles.tabstyle}
                        active_style={styles.active_style}
                        inactive_style={styles.inactive_style}
                        inactivetxt_style={styles.inactivetxt_style}
                        activetxt_style={styles.activetxt_style}
                    />
                    {
                        this.state.curTab == 'Login' ?
                            this.renderLoginForm() : this.renderRegisterForm()
                    }
                </Authpage>
                <Header1
                    style={{ position: 'absolute', left: 20, top: 0, }}
                    onLeft={() => {
                        this.props.navigation.pop();
                    }}
                    title={''}
                />
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    tabstyle: {
        paddingLeft: 0, paddingRight: 0, marginTop: -25, marginBottom: 40, width: 274, height: 50, borderRadius: 15,
        backgroundColor: '#fff', elevation: 1, shadowOffset: { width: 1, height: 1 },
        shadowColor: '#999',
        shadowOpacity: 0.6,
    },
    active_style: { height: 50, marginLeft: 0, marginRight: 0, borderRadius: 15, backgroundColor: Theme.colors.text },
    inactive_style: { height: 50, marginLeft: 0, marginRight: 0, borderRadius: 15, backgroundColor: Theme.colors.white },
    inactivetxt_style: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold, },
    activetxt_style: { fontSize: 16, color: Theme.colors.white, fontFamily: Theme.fonts.semiBold, },
    formview: { flex: 1, width: '100%', position: 'relative' },
    forgotPasswordText: {
        color: '#F55A00',
        fontSize: 12,
        fontFamily: Theme.fonts.semiBold,
        textAlign: 'right',
        marginVertical: Theme.sizes.xTiny,
    },
    title: { marginTop: 80, marginBottom: 35, fontFamily: Theme.fonts.bold },
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
    }
})


function mapStateToProps({ app }) {
    return {
        user: app.user,
        hasVerifiedPhone: app.hasVerifiedPhone,
    };
}

export default connect(mapStateToProps, {
    login,
    register,

    setAsLoggedIn,
    setUserNeedLogin,
    getLoggedInUser,
    setAddress,
    getAddresses,
    updateProfileDetails,
    addDefaultAddress,
})(LoginScreen);
