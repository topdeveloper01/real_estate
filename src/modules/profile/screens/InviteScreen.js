
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RoundIconBtn from '../../../common/components/buttons/round_icon_button';
import { height, width } from 'react-native-dimension';

class InviteScreen extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            loadingLocation: false,
            loaded: false,
        };
    }

    componentDidMount() {
        const { address } = this.state;
    }

    inputUpdated = (value, prop) => {
        const { address } = this.state;
        address[prop] = value;
        this.setState({ address });
    };

    focusOn = (input) => {
        this[input].focus();
    };

    _renderHeader = () => {
        return <View style={[Theme.styles.row_center, styles.header]}>
            <RoundIconBtn style={styles.headerBtn} icon={<Feather name='chevron-left' size={22} color={Theme.colors.text} />} onPress={() => {
                this.props.navigation.goBack()
            }} />
            <View style={{ flex: 1 }} />
        </View>
    }

    _renderBottomView = () => {
        const { loadingLocation } = this.state;
        return (
            <View style={[Theme.styles.col_center, styles.bottomView]}>
                <Text style={styles.btmtitle}>{translate('invitation.your_invitation_code')}</Text>
                <View style={[Theme.styles.col_center, styles.invitecodeView]}>
                    <Text style={styles.invitecode}>2D365V4</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.copy}>{translate('invitation.copy')}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        return (
            <KeyboardAwareScrollView
                style={[{ flex: 1 }, { backgroundColor: '#ffffff' }]}
                extraScrollHeight={65}
                enableOnAndroid={true}
                keyboardShouldPersistTaps='handled'
            >
                <LinearGradient colors={['#23CBD8', '#07CCFE']} style={{ flex: 1, height: height(100) }}>
                    <View style={[Theme.styles.col_center_start, styles.main]}>
                        <View style={{ flex: 1, width: '100%', paddingHorizontal: 40, paddingVertical: 15, }}>
                            {/* <Svg_invite width={'100%'} height={'100%'}/> */}
                            <FastImage source={require('../../../common/assets/images/invite.png')} style={{width: '100%', height: '100%'}} resizeMode={FastImage.resizeMode.contain}/>
                        </View>
                        <View style={[Theme.styles.col_center, { flex: 1, paddingHorizontal: 40, }]}>
                            <Text style={styles.title}>Invite your friends and get a 50L reward in your balance.</Text>
                            <TouchableOpacity>
                                <Text style={styles.learnmore}>{translate('invitation.learn_more')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this._renderBottomView()}
                    {this._renderHeader()}
                </LinearGradient>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        width: width(100), padding: 20, position: 'absolute', top: 40,
    },
    headerBtn: { width: 33, height: 33, marginRight: 20, borderRadius: 8, backgroundColor: Theme.colors.white, },
    bottomView: {
        width: width(100), elevation: 4, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, paddingBottom: 35, position: 'absolute', bottom: 0, backgroundColor: Theme.colors.white,
    },
    learnmore: { textDecorationLine: 'underline', fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.white, },
    btmtitle: { fontSize: 16, fontFamily: Theme.fonts.semiBold, color: Theme.colors.gray7, },
    invitecodeView: { marginVertical: 21, width: 206, height: 63, borderRadius: 15, backgroundColor: Theme.colors.gray9 },
    invitecode: { fontSize: 30, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text, },
    copy: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.cyan2, },
    main: { marginTop: 120, marginBottom: 205, flex: 1, },
    title : {marginBottom: 12, textAlign: 'center', fontSize: 20, fontFamily: Theme.fonts.semiBold, color: Theme.colors.white,},
});

function mapStateToProps({ app }) {
    return {
        coordinates: app.coordinates,
    };
}

export default connect(mapStateToProps, { 
})(InviteScreen);