import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Keyboard, StatusBar, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux'; 
import { updateProfileDetails } from '../../../store/actions/auth';
import { MainBtn } from '../../../common/components'; 
import { sendPushNotification } from '../../../store/actions/app'
import alerts from '../../../common/services/alerts';
import { isEmpty,   } from '../../../common/services/utility';
import Theme from '../../../theme';
import AuthInput from '../../../common/components/AuthInput'; 
import Header1 from '../../../common/components/Header1'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const SendNotification = (props) => {
    const [isLoading, ShowLoading] = useState(false);

    const [state, setState] = useState({})

    useEffect(() => { }, []);


    const validateInputs = () => {
        if (isEmpty(state.title)) {
            alerts.error('', '輸入題目');
            return false
        }
        else if (isEmpty(state.message)) {
            alerts.error('', '輸入內容');
            return false
        }
        return true;
    }

    const onSave = async () => {
        if (validateInputs()) {
            try {
                ShowLoading(true);
                await sendPushNotification(state);
                ShowLoading(false);
                alerts.info('', '發放通知成功').then((res) => {
                    props.navigation.goBack();
                });
            } catch (error) {
                ShowLoading(false);
                console.log('on Save', error);
                alerts.error('警告', '出了些問題');
            }
        }
    };


    return (
        <View style={styles.container}>
            <Header1
                onLeft={() => {
                    props.navigation.goBack();
                }}
                style={{ paddingHorizontal: 20, height: 90, marginBottom: 0 }}
                title={'發放通知'}
            />
            <View style={styles.formView}>
                <KeyboardAwareScrollView style={styles.scrollview} keyboardShouldPersistTaps='handled'>
                    <View style={{ height: 20 }}></View>
                    <AuthInput
                        placeholder={'輸入題目'}
                        underlineColorAndroid={'transparent'}
                        keyboardType={'default'}
                        selectionColor={Theme.colors.cyan2}
                        onChangeText={(title) => setState({ ...state, title })}
                        returnKeyType={'next'}
                        autoCapitalize={'none'}
                        value={state.title}
                        secure={false}
                        style={{ marginTop: 25, marginBottom: 12 }}
                    />
                    <AuthInput
                        placeholder={'輸入內容 '}
                        underlineColorAndroid={'transparent'}
                        keyboardType={'default'}
                        selectionColor={Theme.colors.cyan2}
                        onChangeText={(message) => setState({ ...state, message })}
                        returnKeyType={'next'}
                        autoCapitalize={'none'}
                        value={state.message}
                        secure={false}
                        textAlignVertical={'top'}
                        numberOfLines={4}
                        multiline={true}
                        style={{ marginBottom: 12, minHeight: 70 }}
                    />
                    <View style={{ height: 20 }}></View>
                    <View style={{ width: '100%', marginBottom: 40 }}>
                        <MainBtn
                            disabled={isLoading}
                            loading={isLoading} 
                            title={'確認'}
                            onPress={onSave}
                        />
                    </View>
                </KeyboardAwareScrollView> 
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Theme.colors.white,
    },
    formView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    scrollview: {
        flex: 1, width: '100%', paddingHorizontal: 20
    }, 
});

const mapStateToProps = ({ app }) => ({
    user: app.user,
    home_orders_filter: app.home_orders_filter,
});

export default connect(mapStateToProps, {
    updateProfileDetails,
})(SendNotification);
