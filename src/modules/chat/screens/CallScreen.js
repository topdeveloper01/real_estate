import React from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, View, Text, FlatList, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import FastImage from "react-native-fast-image";
// svgs
import Svg_endcall from '../../../common/assets/svgs/ic_endcall.svg'
import Svg_mute_active from '../../../common/assets/svgs/ic_mute_active.svg'
import Svg_mute_inactive from '../../../common/assets/svgs/ic_mute_inactive.svg'
import Svg_speaker_active from '../../../common/assets/svgs/ic_speaker_active.svg'
import Svg_speaker_inactive from '../../../common/assets/svgs/ic_speaker_inactive.svg'
import Theme from '../../../theme';

class CallScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            muteActive: false,
            speakerActive: false,
            user: props.route.params.user
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
            headerTitle: null,
        };
    };

    render() {
        const { muteActive, speakerActive } = this.state;
        let muteImage = muteActive ? <Svg_mute_active /> : <Svg_mute_inactive />;
        let speakerImage = speakerActive ? <Svg_speaker_active /> : <Svg_speaker_inactive />;
        return (
            <View style={styles.container}>
                <Image
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{ uri: this.state.user.avatar }}
                    blurRadius={1}
                />
                <View style={[Theme.styles.col_center, styles.callInfoView]}>
                    <Text style={styles.callstatus}>Calling</Text>
                    <FastImage source={{ uri: this.state.user.avatar }}
                        style={styles.avatarImg}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <Text style={styles.name}>{this.state.user.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginHorizontal: 60, marginTop: 60, marginBottom: 40, alignItems: 'center' }}>
                    <TouchableOpacity style={{ width: 60, height: 60 }} onPress={() => {
                        this.setState({ muteActive: !muteActive });
                    }}>
                        {muteImage}
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={{ width: 75, height: 75 }} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Svg_endcall />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity style={{ width: 60, height: 60 }} onPress={() => {
                        this.setState({ speakerActive: !speakerActive });
                    }}>
                        {speakerImage}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    callInfoView: { 
        flex: 1, paddingBottom: 80,
    },
    callstatus : {fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.gray6},
    name : {fontSize: 20, fontFamily: Theme.fonts.bold, color: Theme.colors.white},
    avatarImg : {width: 144, height: 144, borderRadius: 20, marginVertical: 20,},
});

const mapStateToProps = ({ app, chat }) => ({
    isLoggedIn: app.isLoggedIn,
    user: app.user,
    messages: chat.messages,
    safeAreaDims: app.safeAreaDims,
});

export default connect(
    mapStateToProps,
    {},
)(withNavigation(CallScreen));
