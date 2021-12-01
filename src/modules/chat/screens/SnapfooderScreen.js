import React from 'react';
import { StyleSheet, InteractionManager, StatusBar, View, Text, ScrollView, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import MapView, { Callout, PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { translate } from '../../../common/services/translate';
import alerts from '../../../common/services/alerts';
import apiFactory from '../../../common/services/apiFactory';
import { SocialMapScreenStyles } from "../../../config/constants";
import BackButton from "../../../common/components/buttons/back_button";
import MainBtn from "../../../common/components/buttons/main_button";
import TransBtn from '../../../common/components/buttons/trans_button';
import Theme from '../../../theme';
import Config from '../../../config';
import SuggestedUserItem from '../components/SuggestedUserItem';
import SnapfooderAvatar from '../components/SnapfooderAvatar';

class SnapfooderScreen extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            btnLoading: false,
            isCheckedFriend: false,
            suggestedLoading: null,
            isFriend: false,
            user: this.props.route.params.user,
            hideAction: this.props.route.params.hideAction == true,
            isReady: false,
        };
    }

    componentDidMount() {
        this._isMounted = true

        if (this.state.user != null) {
            this.getSnapfoodDetail(this.state.user.id, true)
            this.checkFriend(this.state.user.id)
        }
        this.setState({ isReady: true })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getSnapfoodDetail = async (user_id, initLoading = false) => {
        if (initLoading == true) {
            await this.setState({ suggestedLoading: true });
        }
        apiFactory.get(`users/snapfooders/${user_id}`).then(({ data }) => {
            const res_snapfooder = data['snapfooder'];
            if (this._isMounted == true) {
                this.setState({
                    user: res_snapfooder,
                    suggestedLoading: false,
                });
            }
        },
            (error) => {
                const message = error.message || translate('generic_error');
                if (this._isMounted == true) {
                    this.setState({
                        suggestedLoading: false,
                    });
                }
                console.log(message);
            });
    }

    checkFriend = async (snapfooder_id) => {
        this.setState({ isCheckedFriend: false })
        apiFactory.post(`users/friends/check`, {
            user_id: this.props.user.id,
            friend_id: snapfooder_id
        }).then(({ data }) => {
            console.log('check Friend', data.success)
            if (this._isMounted == true) {
                this.setState({
                    isFriend: data.success == true,
                    isCheckedFriend: true
                });
            }
        },
            (error) => {
                this.setState({ isCheckedFriend: true })
                console.log(error);
            });
    }

    onSendInvitation = async () => {
        console.log('onSendInvitation')
        if (this.state.user == null) { return }
        await this.setState({ btnLoading: true });
        apiFactory.post(`users/friends/update`, {
            user_id: this.props.user.id,
            friend_id: this.state.user.id,
            status: 'invited'
        }).then((res) => {
            this.getSnapfoodDetail(this.state.user.id)
            if (this._isMounted == true) {
                this.setState({
                    btnLoading: false,
                });
            }
        },
            (error) => {
                const message = error.message || translate('generic_error');
                if (this._isMounted == true) {
                    this.setState({
                        btnLoading: false,
                    });
                }
                alerts.error(translate('alerts.error'), message);
            });
    }

    onCancelInvitation = async () => {
        if (this.state.user == null) { return }
        await this.setState({ btnLoading: true });
        apiFactory.post(`users/friends/remove`, {
            user_id: this.props.user.id,
            friend_id: this.state.user.id
        }).then((res) => {
            this.getSnapfoodDetail(this.state.user.id)
            if (this._isMounted == true) {
                this.setState({
                    btnLoading: false,
                });
            }
        },
            (error) => {
                const message = error.message || translate('generic_error');
                if (this._isMounted == true) {
                    this.setState({
                        btnLoading: false,
                    });
                }
                alerts.error(translate('alerts.error'), message);
            });
    }

    onRemoveFriend = async () => {
        if (this.state.user == null) { return }
        await this.setState({ btnLoading: true });
        apiFactory.post(`users/friends/remove`, {
            user_id: this.props.user.id,
            friend_id: this.state.user.id
        }).then((res) => {
            this.checkFriend(this.state.user.id);
            if (this._isMounted == true) {
                this.setState({
                    btnLoading: false,
                });
            }
        },
            (error) => {
                const message = error.message || translate('generic_error');
                if (this._isMounted == true) {
                    this.setState({
                        btnLoading: false,
                    });
                }
                alerts.error(translate('alerts.error'), message);
            });
    }

    renderMap() {
        if (this.state.suggestedLoading != false) {
            return null;
        }
        let latitude = parseFloat(this.state.user.latitude)
        let longitude = parseFloat(this.state.user.longitude)
        if (latitude == null || longitude == null || isNaN(latitude) == true || isNaN(longitude) == true) {
            return null;
        }
        return (
            <View style={styles.mapcontainer}>
                <View style={styles.mapview}>
                    {
                        <MapView
                            customMapStyle={SocialMapScreenStyles}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={false}
                            showsMyLocationButton={false}
                            showsPointsOfInterest={false}
                            showsBuildings={false}
                            style={{ width: '100%', height: 214 }}
                            region={{
                                latitude: latitude,
                                longitude: longitude,
                                latitudeDelta: 0.006,
                                longitudeDelta: 0.02,
                            }}
                            initialRegion={{
                                latitude: latitude,
                                longitude: longitude,
                                latitudeDelta: 0.006,
                                longitudeDelta: 0.02,
                            }}>
                            <Marker
                                tracksInfoWindowChanges={false}
                                tracksViewChanges={false}
                                key={'marker_position'}
                                anchor={{ x: 0.5, y: 0.5 }}
                                coordinate={{ latitude: latitude, longitude: longitude }}
                            >
                                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#25DEE240', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#23CBD8' }} />
                                </View>
                            </Marker>
                        </MapView>
                    }
                </View>
            </View>
        );
    }

    renderTitleBar() {
        return (
            <View style={styles.titleContainer}>
                <BackButton iconCenter={true} onPress={() => {
                    this.props.navigation.goBack();
                }} />
                <View style={{ flex: 1 }}>
                </View>
            </View>
        );
    }

    renderSuggestedUsers = (items) => {
        return <View style={[Theme.styles.col_center_start, styles.userHorizList]}>
            <View style={styles.divider} />
            <Text style={styles.subjectTitle}>{translate('chat.suggested_users')}</Text>
            <ScrollView
                horizontal={true}
                style={{ width: '100%', marginTop: 16, paddingBottom: 15, }}
            >
                {
                    items.map((item, index) =>
                        <SuggestedUserItem
                            key={item.id}
                            id={item.id}
                            full_name={item.full_name}
                            photo={item.photo}
                            onViewProfile={() => {
                                this.getSnapfoodDetail(item.id)
                                this.checkFriend(item.id);
                            }}
                        />
                    )
                }
            </ScrollView>
            <View style={styles.scrollviewHider} />
        </View>
    }

    render() {
        const { user, isFriend, btnLoading } = this.state
        console.log('user invitation status ', user.invite_status)
        return (
            <View style={styles.container}>
                {this.renderTitleBar()}
                <ScrollView style={styles.container}>
                    <SnapfooderAvatar
                        full_name={user.full_name}
                        photo={user.photo}
                        birthdate={user.birthdate}
                        country={user.country}
                    />
                    {this.renderMap()}
                    {
                        this.state.suggestedLoading == false && user.suggested_users &&
                        this.renderSuggestedUsers(user.suggested_users || [])
                    }
                </ScrollView>
                {
                    this.state.hideAction != true && this.state.isCheckedFriend &&
                    <View style={[{ width: '100%', paddingHorizontal: 20, marginBottom: 40 }]}>
                        {
                            isFriend ?
                                <TransBtn
                                    disabled={btnLoading}
                                    loading={btnLoading}
                                    btnTxtColor={Theme.colors.gray7}
                                    title={translate('friend_related.remove_friend')}
                                    onPress={this.onRemoveFriend}
                                /> :
                                <MainBtn
                                    disabled={btnLoading}
                                    loading={btnLoading}
                                    style={{ backgroundColor: user.invite_status == 'invited' ? Theme.colors.gray7 : Theme.colors.cyan2 }}
                                    title={user.invite_status == 'invited' ? translate('friend_related.cancel_invitation'): translate('friend_related.add_friend')}
                                    onPress={user.invite_status == 'invited' ? this.onCancelInvitation : this.onSendInvitation}
                                />
                        }
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: Theme.colors.white,
    },
    titleContainer: {
        marginTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    mapcontainer: { paddingHorizontal: 20, paddingTop: 27, },
    mapview: { overflow: 'hidden', width: '100%', height: 214, borderRadius: 10, marginBottom: 20, },
    divider: { width: '100%', height: 1, backgroundColor: Theme.colors.gray9, },
    userHorizList: { width: '100%', paddingLeft: 20, alignItems: 'flex-start', },
    subjectTitle: { marginTop: 15, fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
    scrollviewHider: { width: '100%', marginTop: -12, height: 15, backgroundColor: Theme.colors.white },

});

const mapStateToProps = ({ app, chat }) => ({
    user: app.user,
});

export default connect(
    mapStateToProps,
    {},
)(withNavigation(SnapfooderScreen));
