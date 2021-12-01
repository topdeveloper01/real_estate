import React from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import FastImage from "react-native-fast-image";
import Theme from "../../../theme";
import RouteNames from "../../../routes/names";
import { translate } from '../../../common/services/translate';
import alerts from '../../../common/services/alerts';
import apiFactory from '../../../common/services/apiFactory';
import { getImageFullURL, isEmpty } from '../../../common/services/utility';
import BackButton from "../../../common/components/buttons/back_button";
import SearchBox from "../../../common/components/social/search/SearchBox";
import NoFriends from '../components/NoFriends';
import UserListItem from '../components/UserListItem';

const IS_LOADING = 'isLoading';
const IS_REFRESHING = 'isRefreshing';
const IS_LOADING_NEXT = 'isLoadingNext';

class SnapfoodersScreen extends React.Component {
    _selected_user_id = null;
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            searchTerms: '',
            page: 1,
            totalPages: 1,
            snapfooders: [],
        };
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.getSnapfooders(IS_REFRESHING)
        this.removefocusListener = this.props.navigation.addListener('focus', () => {
            if (this._selected_user_id != null) {
                this.updateSnapfoodDetail(this._selected_user_id)
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        if (this.removefocusListener) {
            this.removefocusListener()
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
        this.getSnapfooders('none');
    };

    onGoDetail = (user) => {
        this.props.navigation.navigate(RouteNames.SnapfooderScreen, { user: user})
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
                });
            }
        },
            (error) => {
                const message = error.message || translate('generic_error');
                this.setState({
                    [propToLoad]: false,
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
        return null;
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
                <View style={{ flex: 1, }}>
                    {this.renderTitleBar()}
                    {this.renderSearchBar()}
                    {this.renderFriendList()}
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
                <Text style={styles.title}>{translate('social.snapfooders')}</Text>
            </View>
        );
    }

    renderSearchBar() {
        return (
            <View style={styles.searchContainer}>
                <SearchBox onChangeText={this.onChangeSearch} hint={translate('social.search.snapfooders')} />
            </View>
        );
    }

    renderFriendList() {
        return (
            <FlatList
                style={styles.listContainer}
                data={this.state.snapfooders}
                numColumns={1}
                keyExtractor={item => item.id.toString()}
                renderItem={(item) => this.renderFriendItem(item)}
                ItemSeparatorComponent={() => <View style={styles.spaceCol} />}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state[IS_REFRESHING]}
                        onRefresh={() => this.getSnapfooders(IS_REFRESHING)}
                    />
                }
                ListFooterComponent={this.renderNextLoader()}
                ListEmptyComponent={() => this.state[IS_REFRESHING] == false && <NoFriends title={translate('social.no_snapfooders')} desc={translate('social.no_snapfooders_desc')} />}
                onEndReachedThreshold={0.3}
                onEndReached={this.loadNextPage}
            />
        );
    }

    renderFriendItem = ({ item }) => {
        return (
            <UserListItem
                full_name={item.full_name} 
                photo={item.photo}  
                invite_status={item.invite_status}
                type='invite_status'
                onPress={() => { 
                    this._selected_user_id = item.id
                    this.onGoDetail(item) 
                }}
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
        paddingHorizontal: 20,
        marginTop: 50
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
        marginTop: 15,
        paddingHorizontal: 20
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
    listContainer: {
        flex: 1,
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 20
    },
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
)(withNavigation(SnapfoodersScreen));
