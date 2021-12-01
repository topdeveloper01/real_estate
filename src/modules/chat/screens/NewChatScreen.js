import React from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { withNavigation } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import Theme from "../../../theme";
import RouteNames from '../../../routes/names';
import alerts from '../../../common/services/alerts';
import apiFactory from '../../../common/services/apiFactory';
import { getFriends } from '../../../store/actions/app';
import { createSingleChannel, findChannel } from '../../../common/services/chat';
import { translate } from '../../../common/services/translate';
import BackButton from "../../../common/components/buttons/back_button";
import SearchBox from "../../../common/components/social/search/SearchBox";
import UserListItem from '../components/UserListItem';
import NoFriends from '../components/NoFriends';

const IS_LOADING = 'isLoading';
const IS_REFRESHING = 'isRefreshing';
const IS_LOADING_NEXT = 'isLoadingNext';

class NewChatScreen extends React.Component {
    _selected_user_id = null;
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            isFriend: true,
            all_friends: [],
            snapfooders: [],
            page: 1,
            totalPages: 1,
            searchTerms: '',
            friend_loaded : false,
            snapfooders_loaded : false,
            isCreatingChannel : false,
        };
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.getFriendsNotInChannel()
        this.getSnapfooders(IS_REFRESHING)

        this.removefocusListener = this.props.navigation.addListener('focus', () => {
            if (this._selected_user_id != null) {
                this.updateSnapfoodDetail(this._selected_user_id)
            }
		});
        
    }

    componentWillUnmount = () => {
        this._isMounted = false;
        if (this.removefocusListener) {
			this.removefocusListener();
		}
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.chat_channels != prevProps.chat_channels) {
            this.getFriendsNotInChannel(this.state.searchTerms)
        }
    }

    updateSnapfoodDetail = async (user_id) => {
        apiFactory.get(`users/snapfooders/${user_id}`).then(({ data }) => {
            const res_snapfooder = data['snapfooder'];
            if (this._isMounted == true) {
                let tmp = this.state.snapfooders.slice(0, this.state.snapfooders.length);
                let found_index = tmp.findIndex(i => i.id == user_id);
                if (found_index >= 0) {
                    tmp[found_index].invite_status = res_snapfooder.invite_status;
                    this.setState({snapfooders : tmp});
                }
            }
        },
            (error) => {
                const message = error.message || translate('generic_error');
                console.log(message);
            });
    }

    onChangeSearch = async (searchTerms) => {
        await this.setState({ searchTerms });
        this.getFriendsNotInChannel(searchTerms)
        this.getSnapfooders('none');
    };

    onSendInvitation = async (item) => {
        apiFactory.post(`users/friends/update`, {
            user_id: this.props.user.id,
            friend_id: item.id,
            status: 'invited'
        }).then((res) => {
            console.log('onSendInvitation', res.data);
            this.getSnapfooders('none');
        },
            (error) => {
                const message = error.message || translate('generic_error');
                alerts.error(translate('alerts.error'), message);
            });
    }

    onCancelInvitation = async (item) => {
        apiFactory.post(`users/friends/remove`, {
            user_id: this.props.user.id,
            friend_id: item.id
        }).then((res) => {
            this.getSnapfooders('none');
        },
            (error) => {
                const message = error.message || translate('generic_error');
                alerts.error(translate('alerts.error'), message);
            });
    }

    onEnterChannel = async (partner) => {
        let found_channel = await findChannel(this.props.user.id, partner.id)
        if (found_channel != null) {
            this.props.navigation.navigate(RouteNames.MessagesScreen, { channelId: found_channel.id })
        }
        else {
            this.setState({isCreatingChannel: true})
            let channelID = await createSingleChannel(this.props.user, partner);
            this.setState({isCreatingChannel: false})
            if(channelID != null) {
                this.props.navigation.goBack();
                this.props.navigation.navigate(RouteNames.MessagesScreen, { channelId: channelID })
            }
            else {
                alerts.error(translate('alerts.error'), translate('checkout.something_is_wrong'));
            }
        }
    }

    getFriendsNotInChannel = (searchTerm) => {
        if (this.state.isCreatingChannel) {
            return;
        }
        let filter_ids = []
        this.props.chat_channels.map((channel) => {
            if (channel.channel_type == 'single') {
                let partners = channel.users.filter(i => i != this.props.user.id)
                if (partners.length > 0) {
                    filter_ids.push(partners[0])
                }
            }
        })
        this.props.getFriends('accepted', searchTerm, filter_ids).then(data => {
            if (this._isMounted == true) {
                this.setState({ all_friends: data, friend_loaded : true })
            }
        })
            .catch(err => {
                this.setState({friend_loaded : true })
                console.log('getFriends', err)
            })
    }

    getSnapfooders = async (propToLoad = IS_LOADING) => {
        const { searchTerms, page } = this.state;
        let page_num = page;
        if (propToLoad == IS_REFRESHING || propToLoad == 'none') {
            page_num = 1;
        }
        const params = [
            `name=${searchTerms}`,
            `page=${page_num}`,
        ];
        await this.setState({ [propToLoad]: true });
        apiFactory.get(`users/snapfooders?${params.join('&')}`).then(({ data }) => {
            const res_snapfooders = data['snapfooders'];
            let snapfooders = this.state.snapfooders;
            if ([IS_LOADING, IS_LOADING_NEXT].indexOf(propToLoad) > -1) {
                snapfooders = [
                    ...snapfooders,
                    ...res_snapfooders['data'],
                ];
            } else {
                snapfooders = res_snapfooders['data'];
            }
            if (this._isMounted) {
                this.setState({
                    snapfooders: snapfooders,
                    page: res_snapfooders['current_page'],
                    totalPages: res_snapfooders['last_page'],
                    [propToLoad]: false,
                    snapfooders_loaded : true
                });
            }
        },
            (error) => {
                const message = error.message || translate('generic_error');
                this.setState({
                    [propToLoad]: false,
                    snapfooders_loaded : true
                });
                alerts.error(translate('alerts.error'), message);
            });
    };

    loadNextPage = async () => {
        const { page, totalPages } = this.state;
        if (!this.state[IS_LOADING_NEXT] && page < totalPages) {
            await this.setState({
                page: page + 1,
            });
            this.getSnapfooders(IS_LOADING_NEXT);
        }
    };

    renderNextLoader = () => {
        if (this.state[IS_LOADING_NEXT]) {
            return <ActivityIndicator size={28} color={Theme.colors.primary} />;
        }
        return <View style={{ height: 90 }} />;
    };

    render() {
        const { isFriend } = this.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
                <Spinner visible={this.state.isCreatingChannel}/>
                <View style={{ flex: 1, }}>
                    {this.renderTitleBar()}
                    {this.renderSearchBar()}
                    <View style={{ paddingHorizontal: 20, }}>
                        {this.renderTab()}
                    </View>
                    {isFriend ? this.renderFriendList() : this.renderSnapfooders()}
                </View>
            </View>
        );
    }

    renderTitleBar() {
        return (
            <View style={styles.titleContainer}>
                <BackButton onPress={() => {
                    this.props.navigation.goBack();
                }} />
                <Text style={styles.title}>{translate('social.new_chat')}</Text>
            </View>
        );
    }

    renderSearchBar() {
        return (
            <View style={styles.searchContainer}>
                <SearchBox onChangeText={this.onChangeSearch} hint={translate('social.search.friends')} />
            </View>
        );
    }

    renderTab() {
        const { isFriend } = this.state;
        return (
            <View style={styles.tabContainer}>
                {this.renderTabButton('Friends', isFriend, () => {
                    this.setState({ isFriend: true })
                })}
                <View style={styles.spaceRow} />
                {this.renderTabButton('Snapfooders', !isFriend, () => {
                    this.setState({ isFriend: false })
                })}
            </View>
        );
    }

    renderTabButton(title, isSelected, onPress) {
        return (
            <TouchableOpacity style={[styles.tabButton, { backgroundColor: isSelected ? '#E0FBFB' : 'white' }]}
                onPress={onPress}>
                <Text style={[styles.tabText, { color: isSelected ? '#23CBD8' : 'black' }]}>{translate(title)}</Text>
            </TouchableOpacity>
        );
    }

    renderFriendList() {
        return (
            <FlatList
                style={styles.listContainer}
                data={this.state.all_friends}
                numColumns={1}
                keyExtractor={item => item.id.toString()}
                renderItem={(item, index) => (
                    <UserListItem
                        key={item.item.id}
                        full_name={item.item.full_name}
                        photo={item.item.photo}
                        invite_status={item.item.invite_status}
                        type='none'
                        onPress={() => this.onEnterChannel(item.item)}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.spaceCol} />}
                ListEmptyComponent={()=>(this.state.friend_loaded == true && <NoFriends title={translate('social.no_friends_from_new_chat')} />)}
            />
        );
    }

    renderSnapfooders() {
        return (
            <FlatList
                style={styles.listContainer}
                data={this.state.snapfooders}
                numColumns={1}
                keyExtractor={item => item.id.toString()}
                renderItem={(item, index) => (
                    <UserListItem
                        key={item.item.id}
                        full_name={item.item.full_name}
                        photo={item.item.photo}
                        invite_status={item.item.invite_status}
                        type='snapfooder'
                        onPress={() => {
                            this._selected_user_id = item.item.id;
                            this.props.navigation.navigate(RouteNames.SnapfooderScreen, { user: item.item });
                        }}
                        onRightBtnPress={
                            item.item.invite_status == 'invited' ?
                                () => this.onCancelInvitation(item.item) :
                                () => this.onSendInvitation(item.item)
                        }
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.spaceCol} />}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state[IS_REFRESHING]}
                        onRefresh={() => this.getSnapfooders(IS_REFRESHING)}
                    />
                }
                ListFooterComponent={this.renderNextLoader()}
                ListEmptyComponent={() => this.state.snapfooders_loaded == true && <NoFriends title={translate('social.no_snapfooders_from_new_chat')} />}
                onEndReachedThreshold={0.3}
                onEndReached={this.loadNextPage}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 40,
    },
    title: {
        alignSelf: 'center',
        flex: 1,
        textAlign: 'center',
        marginRight: 30,
        fontSize: 18,
        fontFamily: Theme.fonts.bold
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 5,
    },
    spaceRow: {
        width: 15
    },
    spaceCol: {
        height: 10
    },
    tabContainer: {
        borderColor: '#F6F6F9',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 10,
        flexDirection: 'row',
        marginTop: 10
    },
    tabButton: {
        flex: 1,
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabText: {
        fontSize: 14,
        fontFamily: Theme.fonts.semiBold
    },
    chatContainer: {
        padding: 10,
        flexDirection: 'row',
        borderRadius: 15,
        backgroundColor: '#FAFAFC',
        alignItems: 'center'
    },
    listContainer: {
        flex: 1,
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 20
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 6,
        backgroundColor: 'red',
        marginRight: 20
    },
    name: {
        flex: 1,
        fontSize: 14,
        color: 'black',
        fontFamily: Theme.fonts.semiBold
    },
    time: {
        fontSize: 12,
        color: '#AAA8BF',
        fontFamily: Theme.fonts.regular
    },
    message: {
        flex: 1,
        fontSize: 12,
        color: 'black',
        fontFamily: Theme.fonts.regular
    },
    invite: {
        color: '#23CBD8',
        fontSize: 14,
        fontFamily: Theme.fonts.semiBold
    }
});

const mapStateToProps = ({ app, chat }) => ({
    isLoggedIn: app.isLoggedIn,
    user: app.user,
    messages: chat.messages,
    channelId: chat.channelId,
    chat_channels: chat.chat_channels || []
});

export default connect(
    mapStateToProps,
    { getFriends, },
)(withNavigation(NewChatScreen));
