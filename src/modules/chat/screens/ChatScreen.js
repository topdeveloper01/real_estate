import React from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, View, Text, FlatList, Image, SafeAreaView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import moment from 'moment';
import FastImage from "react-native-fast-image";
import { height } from 'react-native-dimension'; 
import { setAllChannels } from '../../../store/actions/app';
import RouteNames from '../../../routes/names'; 
import { translate } from '../../../common/services/translate'; 
import { isEmpty, convertTimestamp2Date, getImageFullURL, checkInSameWeek } from '../../../common/services/utility'; 
import BlockSpinner from '../../../common/components/BlockSpinner';
import Theme from "../../../theme"; 
import NoRestaurants from '../../../common/components/restaurants/NoRestaurants'
import Header1 from '../../../common/components/Header1';
import { channelCollection } from '../../../common/services/firebase';

class ChatScreen extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props);

        this.state = {
            showConvModal: false,
            new_invites: [],
            isChatList: true,
            display_channels: [],
            isLoadingChat: null,
        };
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.getChatChannelsListner(this.props.user.id)
    }

    componentWillUnmount() {
        this._isMounted = false;
        if (this.removefocusListener) {
            this.removefocusListener()
        }
        if (this.chatchannel_listener) {
            this.chatchannel_listener()
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.user.id != prevProps.user.id) {
            console.log('componentDidUpdate : getChatChannelsListner')
            this.getChatChannelsListner(this.props.user.id)
        }
    }

    onChangeSearch = async (search) => {
        search = search.toLowerCase();
        const user_id = this.props.user.id;
        let filtered_channels = [];
        this.props.chat_channels.map((channel) => {
            if (channel.channel_type == 'single' && channel.partner != null && channel.creator != null) {
                if (user_id == channel.creator.id && channel.partner.full_name != null && channel.partner.full_name.toLowerCase().includes(search)) {
                    filtered_channels.push(channel)
                }
                else if (user_id == channel.partner.id && channel.creator.full_name != null && channel.creator.full_name.toLowerCase().includes(search)) {
                    filtered_channels.push(channel)
                }
            }
            else {
                if (channel.full_name != null && channel.full_name.toLowerCase().includes(search)) {
                    filtered_channels.push(channel)
                }
            }
        })

        this.setState({ display_channels: filtered_channels })
    }

    getChatChannelsListner = (user_id) => {
        if (this.chatchannel_listener) {
            console.log('remove old chat channel listener')
            this.chatchannel_listener()
        }
        this.setState({ isLoadingChat: true })
        this.chatchannel_listener = channelCollection.where('users', 'array-contains', user_id).orderBy('last_msg.createdAt', 'desc').onSnapshot((snapshots) => {
            var tmp_channels = [];
            snapshots.forEach((doc) => {
                tmp_channels.push(doc.data());
            });
            // console.log(tmp_channels)
            this.setState({ display_channels: tmp_channels, isLoadingChat: false })
            this.props.setAllChannels(tmp_channels)
        },
            (error) => {
                this.setState({ isLoadingChat: false })
                console.log('chat channel listener error', error)
            });
    }

    renderTab() {
        const { isChatList } = this.state;
        return (
            <View style={styles.tabContainer}>
                {this.renderTabButton('Chats', isChatList, () => {
                    this.setState({ isChatList: true })
                })}
                <View style={styles.spaceRow} />
                {this.renderTabButton('Calls', !isChatList, () => {
                    this.setState({ isChatList: false })
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

    renderChatHistory() {
        return (
            <FlatList
                style={styles.listContainer}
                data={this.state.display_channels}
                numColumns={1}
                keyExtractor={item => item.id.toString()}
                renderItem={(item, index) => this.renderChatItem(item)}
                ItemSeparatorComponent={() => <View style={styles.spaceCol} />}
                ListFooterComponent={() => <View style={styles.spaceCol} />}
                ListEmptyComponent={() => this.state.isLoadingChat == false && <NoRestaurants style={{marginTop: height(30)}}/> }
            />);
    }

    renderChatItem({ item }) {
        const user_id = this.props.user.id
        const getPhoto = () => {
            if (item.channel_type == 'single') {
                if (user_id == item.creator.id) {
                    return getImageFullURL(item.partner.photo)
                }
                else if (user_id == item.partner.id) {
                    return getImageFullURL(item.creator.photo)
                }
            }
            else {
                return getImageFullURL(item.photo)
            }
            return getImageFullURL('default')
        }
        const getName = () => {
            if (item.channel_type == 'single') {
                if (user_id == item.creator.id) {
                    return item.partner.full_name
                }
                else if (user_id == item.partner.id) {
                    return item.creator.full_name
                }
            }
            else {
                return item.full_name
            }
            return ''
        }
        const getLastMsg = () => {
            if (item.last_msg == null) { return ''; }
            if (item.last_msg.user == null) { return ''; }

            if (item.channel_type == 'single') {
                if (item.last_msg.map != null) {
                    return translate('social.chat.user_shared_location');
                }
                else if (item.last_msg.emoji != null) {
                    return (item.last_msg.emoji != null && item.last_msg.emoji.length > 0) ? item.last_msg.emoji.map(item => item.code).join('') : '';
                }
                else if (item.last_msg.images != null) {
                    return translate('social.chat.user_shared_photo');
                }
                else if (item.last_msg.audio != null) {
                    return translate('social.chat.user_shared_audio');
                }
                else if (item.last_msg.text != null) {
                    return item.last_msg.text;
                }
                return ''
            }
            else {
                let isMe = false;
                let last_msg_user = item.last_msg.user.full_name;
                if (user_id == item.last_msg.user._id) {
                    last_msg_user = translate('you');
                    isMe = true;
                }

                if (item.last_msg.map != null) {
                    return last_msg_user + ': ' + (isMe ? translate('social.chat.you_shared_location') : translate('social.chat.user_shared_location'));
                }
                else if (item.last_msg.emoji != null) {
                    return last_msg_user + ': ' + (isMe ? translate('social.chat.you_sent_emoji') : translate('social.chat.user_sent_emoji'))
                    // + (item.last_msg.emoji.code != null ? item.last_msg.emoji.code : item.last_msg.emoji.name)
                }
                else if (item.last_msg.images != null) {
                    return last_msg_user + ': ' + (isMe ? translate('social.chat.you_shared_photo') : translate('social.chat.user_shared_photo'))
                }
                else if (item.last_msg.audio != null) {
                    return last_msg_user + ': ' + (isMe ? translate('social.chat.you_shared_audio') : translate('social.chat.user_shared_audio'))
                }
                else if (item.last_msg.text != null) {
                    return last_msg_user + ': ' + item.last_msg.text;
                }
                return ''
            }
        }
        const getTime = () => {
            if (item.last_msg != null && item.last_msg.createdAt != null) {
                let msg_moment = moment(convertTimestamp2Date(item.last_msg.createdAt));
                let cur_moment = moment();
                if (msg_moment.format('DD/MM/YYYY') == cur_moment.format('DD/MM/YYYY')) {
                    return moment(convertTimestamp2Date(item.last_msg.createdAt)).format('h:mm A');
                }
                if (checkInSameWeek(convertTimestamp2Date(item.last_msg.createdAt))) {
                    return msg_moment.format('dddd');
                }
                return msg_moment.format('DD/MM/YYYY');
            }
            else {
                return ''
            }
        }
        const getUnreadCnt = () => {
            if (item.unread_cnt != null) {
                return item.unread_cnt[this.props.user.id] || 0
            }
            return 0
        }
        return (
            <TouchableOpacity style={[Theme.styles.row_center, styles.chatContainer]} onPress={() => {
                this.props.navigation.navigate(RouteNames.MessagesScreen, { channelId: item.id })
            }}>
                <FastImage
                    style={styles.avatar}
                    source={{ uri: getPhoto() }}
                    resizeMode={FastImage.resizeMode.cover} />
                <View style={[Theme.styles.row_center, { flex: 1 }]}>
                    <View style={[Theme.styles.col_center, { alignItems: 'flex-start', flex: 1 }]}>
                        <View style={[Theme.styles.row_center_start]}>
                            <Text style={styles.name}>
                                {getName()}
                            </Text>
                            {
                                getUnreadCnt() > 0 &&
                                <View style={styles.unreadContainer}>
                                    <Text style={styles.unread}>{getUnreadCnt()}</Text>
                                </View>
                            }
                        </View> 
                        <Text style={styles.message} numberOfLines={2} >{getLastMsg()}</Text>
                    </View>
                    <Text style={styles.time}>{getTime()}</Text>
                </View>
            </TouchableOpacity>
        );
    }


    render() {
        const { isChatList } = this.state;
        return (
            <View style={styles.container}>
                <Header1
                    left={<View />}
                    style={{ paddingHorizontal: 20, height: 90, marginBottom: 0 }}
                    title={'通訊 Message'}
                />
                {
                    this.state.isLoadingChat ? <BlockSpinner /> :
                        this.renderChatHistory()
                } 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        marginTop: 40,
    },
    moreContainer: {
        width: 45,
        height: 45,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E9E9F7',
        alignItems: 'center',
        justifyContent: 'center'
    },
    moreIcon: {
        height: 20,
        width: 20
    },
    moreAlert: {
        width: 10,
        height: 10,
        backgroundColor: '#F55A00',
        position: 'absolute',
        top: -5,
        right: -5,
        borderRadius: 10
    },
    spaceRow: {
        width: 15
    },
    spaceCol: {
        height: 15
    },
    tabContainer: {
        marginHorizontal: 20,
        borderColor: '#F6F6F9',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 10,
        flexDirection: 'row'
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
        width: '100%',
        backgroundColor: Theme.colors.white,
        paddingVertical: 16,
        borderBottomColor: '#808080aa',
        borderBottomWidth: 1
    },
    listContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20, 
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40, 
        marginRight: 10
    },
    name: { 
        fontSize: 16,
        color: Theme.colors.text,
        fontFamily: Theme.fonts.semiBold
    },
    time: {
        fontSize: 12,
        color: Theme.colors.gray7,
        fontFamily: Theme.fonts.semiBold
    },
    message: { 
        marginTop: 6,
        fontSize: 14,
        color: '#808080',
        fontFamily: Theme.fonts.medium,
    },
    unreadContainer: {
        marginLeft: 20,
        height: 15,
        paddingHorizontal: 4,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F55A00',
    },
    unread: {
        textAlign: 'center',
        color: 'white',
        fontSize: 12,
        lineHeight: 14,
    },
    popupContainer: {
        width: 140,
        borderColor: '#E9E9F7',
        borderRadius: 12,
        backgroundColor: 'white',
        borderWidth: 2,
        paddingHorizontal: 2,
        marginTop: 50,
        elevation: 0
    },
    popupText: {
        color: Theme.colors.text,
        fontSize: 14,
        fontFamily: Theme.fonts.semiBold
    },
});

const mapStateToProps = ({ app, chat }) => ({
    isLoggedIn: app.isLoggedIn,
    language: app.language,
    user: app.user,
    chat_channels: app.chat_channels || []
});

export default connect(
    mapStateToProps,
    {  
        setAllChannels,
    },
)(withNavigation(ChatScreen));
