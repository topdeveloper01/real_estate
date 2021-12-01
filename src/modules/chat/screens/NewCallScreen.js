import React from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, View, Text, FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import Theme from "../../../theme";
import RouteNames from "../../../routes/names";
import { CALL_HISTORY, CHAT_HISTORY } from "../../../config/constants";
import { translate } from '../../../common/services/translate';
import BackButton from "../../../common/components/buttons/back_button";
import SearchBox from "../../../common/components/social/search/SearchBox";
import UserListItem from '../components/UserListItem';

class NewCallScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFriend: true
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
            headerTitle: null,
        };
    };

    render() {
        const { isFriend } = this.state;
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    {this.renderTitleBar()}
                    {this.renderSearchBar()}
                    {this.renderTab()}
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
                <Text style={styles.title}>New Call</Text>
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

    onChangeSearch(search) {
        console.log(search);
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
                <Text style={[styles.tabText, { color: isSelected ? '#23CBD8' : 'black' }]}>{title}</Text>
            </TouchableOpacity>
        );
    }

    renderFriendList() {
        return (
            <FlatList
                style={styles.listContainer}
                data={CHAT_HISTORY}
                numColumns={1}
                keyExtractor={(item, index) => index}
                renderItem={(item, index) => (
                    <UserListItem
                        key={item.item.id}
                        full_name={item.item.full_name}
                        photo={item.item.photo}
                        invite_status={item.item.invite_status}
                        type='none'
                        onPress={() => {
                            this.props.navigation.navigate(RouteNames.CallScreen, { user: item.item })
                        }}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.spaceCol} />} />);
    }

    renderSnapfooders() {
        return (
            <FlatList
                style={styles.listContainer}
                data={CALL_HISTORY}
                numColumns={1}
                keyExtractor={(item, index) => index}
                renderItem={(item, index) => (
                    <UserListItem
                        key={item.item.id}
                        full_name={item.item.full_name}
                        photo={item.item.photo}
                        invite_status={item.item.invite_status}
                        type='invite_status'
                        onPress={() => { }}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.spaceCol} />}
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
        marginTop: 20
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
    safeAreaDims: app.safeAreaDims,
});

export default connect(
    mapStateToProps,
    {},
)(withNavigation(NewCallScreen));
