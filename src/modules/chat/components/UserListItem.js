import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import Theme from "../../../theme";
import {isEmpty, getImageFullURL} from '../../../common/services/utility'; 
import CheckBox from '../../../common/components/buttons/checkbox';
import { translate } from '../../../common/services/translate';

const UserListItem = memo(({ full_name, photo, invite_status, type, checked, style, onPress, onRightBtnPress }) => {
    console.log('UserListItem');
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress ? onPress : () => { }}>
            <FastImage
                style={styles.avatar}
                source={{uri: getImageFullURL(photo) }}
                resizeMode={FastImage.resizeMode.cover}
            />
            <View style={{ flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                <Text style={styles.name}>{full_name}</Text>
                {
                    type == 'checkbox' && <CheckBox
                        checked={checked == true}
                        onPress={onPress ? onPress : () => { }}
                    />
                }
                {
                    type == 'snapfooder' && <TouchableOpacity onPress={onRightBtnPress ? onRightBtnPress : () => { }}>
                        <Text style={[styles.invite,{
                            color : invite_status == 'invited' ? Theme.colors.gray7 : Theme.colors.cyan2
                        }]}>
                            {invite_status == 'invited' ? translate('chat.cancel') : translate('chat.invite')}</Text>
                    </TouchableOpacity>
                }
                {
                    type == 'invite_status' && <View >
                        <Text style={[styles.invite, {
                            color : invite_status == 'invited' ? Theme.colors.gray7 : Theme.colors.cyan2
                        }]}>{invite_status == 'invited' ? translate('chat.already_invited') : translate('chat.invite')}</Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
    );
}, 
(prevProps, nextProps) => {
    if (
        prevProps.checked != nextProps.checked || 
        prevProps.invite_status != nextProps.invite_status || 
        prevProps.full_name != nextProps.full_name || 
        prevProps.photo != nextProps.photo
    ) {
        return false;
    }
    return true;
});

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flexDirection: 'row',
        borderRadius: 15,
        backgroundColor: '#FAFAFC',
        alignItems: 'center'
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
    invite: {
        paddingVertical: 5,
        color: '#23CBD8',
        fontSize: 14,
        fontFamily: Theme.fonts.semiBold
    }
});

export default UserListItem;
