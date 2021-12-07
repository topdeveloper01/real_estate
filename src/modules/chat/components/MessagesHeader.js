import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'; 
import Feather from 'react-native-vector-icons/Feather'; 
import Theme from "../../../theme";
import { isEmpty, getImageFullURL } from '../../../common/services/utility'; 

const MessagesHeader = ({ data, channel_id, user_id, style, isMuted, onPressName, onBack, onCall, onDelete, onExit, onMute, onGallery }) => {
    const getMembers = () => {
        if (data == null) { return ''; }
        if (data.members == null) { return '' }
        let member_names = ''
        var remaining_cnt = 0
        let other_members = data.members.filter(i => i.id != user_id)
        other_members.map((item, index) => {
            if (index < 2) {
                member_names = member_names + item.full_name + ', '
            }
            else {
                remaining_cnt = remaining_cnt + 1
            }
        })

        if (remaining_cnt > 0) {
            member_names = member_names + '+' + remaining_cnt
        }
        return member_names
    }

    const getPhoto = () => {
        if (data == null) { return getImageFullURL('default') }
        if (data.channel_type == 'single') {
            if (user_id == data.creator.id) {
                return getImageFullURL(data.partner.photo);
            }
            else if (user_id == data.partner.id) {
                return getImageFullURL(data.creator.photo);
            }
        }
        else {
            return getImageFullURL(data.photo)
        }
        return getImageFullURL('default')
    }

    const getName = () => {
        if (data == null) { return '' }
        if (data.channel_type == 'single') {
            if (user_id == data.creator.id) {
                return data.partner.full_name
            }
            else if (user_id == data.partner.id) {
                return data.creator.full_name
            }
        }
        else {
            return data.full_name
        }
        return ''
    }

    const getDesc = () => {
        if (data == null) { return '' }
        if (data.channel_type == 'single') {
            return 'Online'
        }
        else { // group chat
            return getMembers()
        }
    }

    const canDeleteGroup = () => {
        if (data == null) { return false; }
        if (data.channel_type != 'single' && data.admin != null && data.admin.id == user_id) {
            return true;
        }
        return false;
    }

    const canExitGroup = () => {
        if (data == null) { return false; }
        if (data.channel_type != 'single' && data.users != null && data.users.findIndex(i => i == user_id) >= 0) {
            return true;
        }
        return false;
    }

    const canMute = () => {
        if (data == null) { return false; }
        if (data.channel_type == 'single') {
            return true;
        }
        else if (data.channel_type != 'single' && data != null && data.users != null && data.users.findIndex(i => i == user_id) >= 0) {
            return true;
        }
        return false;
    }

    console.log('message header')

    return ( 
        <View style={[Theme.styles.row_center, styles.container, style]}> 
            <TouchableOpacity style={{ paddingHorizontal: 5, }} onPress={onBack ? onBack : () => { }}>
                <Feather name="chevron-left" size={24} color={Theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.name}>{getName()}</Text>
            <View style={{width: 35}} /> 
            {/* <Menu>
                <MenuTrigger> 
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={styles.popupContainer}>
                    {
                        canDeleteGroup() &&
                        <MenuOption onSelect={onDelete ? onDelete : () => { }}>
                            <View style={[Theme.styles.row_center, styles.popupBtn,]}>
                                
                                <Text style={styles.popupText}>{translate('social.chat.delete_group')}</Text>
                            </View>
                        </MenuOption>
                    }
                    {
                        canMute() &&
                        <MenuOption onSelect={onMute ? onMute : () => { }} >
                            <View style={[Theme.styles.row_center, styles.popupBtn, data.channel_type != 'group' && { borderBottomWidth: 0 }]}>
                                
                                <Text style={styles.popupText}>{data.channel_type != 'single' ? translate('social.chat.mute_group') : translate('social.chat.mute')}</Text>
                            </View>
                        </MenuOption>
                    } 
                    {
                        canExitGroup() &&
                        <MenuOption onSelect={onExit ? onExit : () => { }}>
                            <View style={[Theme.styles.row_center, styles.popupBtn, { borderBottomWidth: 0 }]}>
                               
                                <Text style={styles.popupText}>{translate('social.chat.exit_group')}</Text>
                            </View>
                        </MenuOption>
                    }
                </MenuOptions>
            </Menu> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 32,
        height: 84,
        backgroundColor: '#ffffff',
        borderBottomColor: Theme.colors.gray4,
        borderBottomWidth: 1
    },
    avatar: { backgroundColor: '#fff', width: 30, height: 30, borderRadius: 6, marginRight: 10, },
    name: { flex: 1, textAlign: 'center', marginRight: 7, backgroundColor: '#ffffff88', fontSize: 18, fontFamily: Theme.fonts.bold, color: Theme.colors.text, marginBottom: 5, },
    desc: { fontSize: 10, fontFamily: Theme.fonts.medium, color: Theme.colors.red1 },
    popupContainer: {
        width: 156,
        borderColor: '#E9E9F7',
        borderRadius: 12,
        backgroundColor: 'white',
        borderWidth: 2,
        paddingHorizontal: 2,
        marginTop: 40,
        elevation: 0,
        paddingTop: 6,
    },
    popupBtn: { paddingHorizontal: 5, paddingBottom: 12, borderColor: '#F6F6F9', borderBottomWidth: 1, },
    popupText: {
        flex: 1,
        marginLeft: 10,
        color: Theme.colors.text,
        fontSize: 14,
        fontFamily: Theme.fonts.semiBold
    },
});

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.isMuted != nextProps.isMuted || 
        prevProps.user_id != nextProps.user_id || 
        prevProps.channel_id != nextProps.channel_id ) {
        console.log('MessagesHeader item equal : ', false)
        return false;
    }
     
    return true;
}

export default React.memo(MessagesHeader, arePropsEqual);