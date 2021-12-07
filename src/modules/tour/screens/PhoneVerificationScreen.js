import React from 'react';
import { ActivityIndicator, Dimensions, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import AuthInput from '../../../common/components/AuthInput'; 
import MainBtn from "../../../common/components/buttons/main_button";
import LoadingModal from '../../../common/components/modals/LoadingModal';
import { BackButton } from '../../../common/components';
import TransBtn from '../../../common/components/buttons/trans_button';
import { translate } from '../../../common/services/translate';
import RouteNames from '../../../routes/names';
import Theme from '../../../theme';
import apiFactory from '../../../common/services/apiFactory';
import alerts from '../../../common/services/alerts';
import { extractErrorMessage, isEmpty } from '../../../common/services/utility';
import { setHasVerifiedPhone } from '../../../store/actions/auth'; 


class PhoneVerificationScreen extends React.Component {

    constructor(props) {
        super(props);

        this.props = props;
        this.state = {
            FbConfirm: this.props.FbConfirm,
            loadingResend: false,
            loading: false,
            confirmSuccess: false,
            code1: '',
            code2: '',
            code3: '',
            code4: '',
            code5: '',
            code6: ''
        };
    }
 
    verify = async () => {
        if (this.state.FbConfirm == null) { return; }
        const { code1, code2, code3, code4, code5, code6 } = this.state;
        await this.setState({ loading: true, confirmSuccess: false });
        try {
            await this.state.FbConfirm.confirm(code1 + code2 + code3 + code4 + code5 + code6);
            this.setState({ loading: false, confirmSuccess: true });
            this.props.onSuccess(auth().currentUser.uid);
        } catch (error) {
            this.setState({
                loading: false,
                code1: '',
                code2: '',
                code3: '',
                code4: '',
                code5: '',
                code6: '',
                confirmSuccess: false
            });
            console.log('verify', error)
            alerts.error('警告', '錯誤代碼！');
        }
    };

    resend = async () => {
        const { user } = this.props;
        await this.setState({ loadingResend: true });
        try {
            const confirmation = await auth().signInWithPhoneNumber('+852' + user.phone, true);
            this.setState({
                loadingResend: false, 
                FbConfirm: confirmation,
                code1: '',
                code2: '',
                code3: '',
                code4: '',
                code5: '',
                code6: ''
            });
        } catch (error) {
            this.setState({ loadingResend: false });
            console.log('resend', error)
            alerts.error('警告', '出了些問題');
        };
    };

    render() {
        return (
            <KeyboardAwareScrollView style={[{ width: '100%', backgroundColor: '#fff' }]} keyboardShouldPersistTaps='handled'>
                <View style={[Theme.styles.col_center, Theme.styles.background, { backgroundColor: '#ffffff', paddingTop: 60 }]}>
                    <View style={[Theme.styles.col_center, { width: '100%', alignItems: 'flex-start' }]}>
                        <BackButton onPress={() => {
                            this.props.goBack()
                        }} />
                    </View>
                    <View style={[Theme.styles.col_center, { width: '100%', alignItems: 'flex-start' }]}>
                        <Text style={styles.title}>驗證碼</Text>
                        <Text style={styles.sub_title}>輸入驗證碼</Text>
                    </View>
                    <View style={[Theme.styles.row_center, { width: '100%', marginTop: 30, justifyContent: 'space-between', }]}>
                        {
                            [1, 2, 3, 4, 5, 6].map(item =>
                                <AuthInput
                                    key={item}
                                    setRef={(input) => {
                                        if (item == 1) {
                                            this.code1 = input
                                        }
                                        else if (item == 2) {
                                            this.code2 = input
                                        }
                                        else if (item == 3) {
                                            this.code3 = input
                                        }
                                        else if (item == 4) {
                                            this.code4 = input
                                        }
                                        else if (item == 5) {
                                            this.code5 = input
                                        }
                                        else if (item == 6) {
                                            this.code6 = input
                                        }
                                    }}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={'phone-pad'}
                                    selectionColor={Theme.colors.cyan2}
                                    onChangeText={code => {
                                        if (item == 1) {
                                            if (code.length <= 1) {
                                                this.setState({ code1: code })
                                            }
                                            if (code.length >= 1) {
                                                if (this.code2 != null) {
                                                    this.code2.focus()
                                                }
                                            }
                                        }
                                        else if (item == 2) {
                                            if (code.length <= 1) {
                                                this.setState({ code2: code })
                                            }
                                            if (code.length >= 1) {
                                                if (this.code3 != null) {
                                                    this.code3.focus()
                                                }
                                            }
                                        }
                                        else if (item == 3) {
                                            if (code.length <= 1) {
                                                this.setState({ code3: code })
                                            }
                                            if (code.length >= 1) {
                                                if (this.code4 != null) {
                                                    this.code4.focus()
                                                }
                                            }
                                        }
                                        else if (item == 4) {
                                            if (code.length <= 1) {
                                                this.setState({ code4: code })
                                            }
                                            if (code.length >= 1) {
                                                if (this.code5 != null) {
                                                    this.code5.focus()
                                                }
                                            }
                                        }
                                        else if (item == 5) {
                                            if (code.length <= 1) {
                                                this.setState({ code5: code })
                                            }
                                            if (code.length >= 1) {
                                                if (this.code6 != null) {
                                                    this.code6.focus()
                                                }
                                            }
                                        }
                                        else if (item == 6) {
                                            if (code.length <= 1) {
                                                this.setState({ code6: code })
                                            }
                                            if (code.length >= 1) {
                                                Keyboard.dismiss()
                                            }
                                        }
                                    }}
                                    returnKeyType={'next'}
                                    autoCapitalize={'none'} 
                                    textAlign='center'
                                    fontSize={22}
                                    fontFamily={Theme.fonts.bold}
                                    value={this.state['code' + item]}
                                    backgroundColor={Theme.colors.gray4}
                                    style={{ width: 55, height: 60, marginBottom: 20, backgroundColor: Theme.colors.gray4 }}
                                />
                            )
                        }
                    </View>

                    <View style={[Theme.styles.row_center_start, { width: '100%', justifyContent: 'flex-start', marginVertical: 80 }]}>
                        <Text style={styles.notiTxt}>沒有收到驗證碼?</Text>
                        <TransBtn
                            style={{ paddingTop: 10 }}
                            btnTxtColor={Theme.colors.text}
                            title={' 重發一次'}
                            onPress={this.resend}
                        />
                    </View>

                    <MainBtn
                        title={'下一步'}
                        onPress={this.verify}
                        style={{ width: '100%', backgroundColor: Theme.colors.yellow1 }}
                    />
                </View>
                <LoadingModal showModal={this.state.loading} title='請等待'/>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({ 
    title: { fontSize: 32, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
	sub_title: { fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
	notiTxt: { marginTop: 12, fontSize: 15, color: Theme.colors.text, },
})

function mapStateToProps({ app }) {
    return {
        user: app.user,
    };
}
 
export default connect(mapStateToProps, {
    setHasVerifiedPhone,
})(PhoneVerificationScreen);
