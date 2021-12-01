import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import Theme from "../../../theme";
import {isEmpty, getImageFullURL} from '../../../common/services/utility'; 
import { translate } from '../../../common/services/translate';

const SuggestedUserItem = ({id, full_name, photo, style, onViewProfile}) => {
    console.log('SuggestedUserItem');
    return (
        <View style={[Theme.styles.col_center, styles.userItemView, style]}>
            <FastImage
                style={styles.userItemAvatar}
                source={{ uri: getImageFullURL(photo)}}
                resizeMode={FastImage.resizeMode.cover} />
            <View style={[Theme.styles.col_center,]}>
                <Text style={styles.userItemName}>{full_name}</Text>
                <TouchableOpacity onPress={onViewProfile}>
                    <Text style={styles.userItemBtnName}>{translate('chat.view_profile')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    userItemView: { width: 120, height: 120, marginRight: 15, borderRadius: 12, backgroundColor: Theme.colors.gray8 },
    userItemAvatar: { width: 50, height: 50, borderRadius: 10, },
    userItemName: { marginTop: 8, fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
    userItemBtnName: { marginTop: 10, fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.cyan2 },
});

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.id != nextProps.id || 
        (prevProps.id == nextProps.id && prevProps.full_name != nextProps.full_name) || 
        (prevProps.id == nextProps.id && prevProps.photo != nextProps.photo)
    ) {
        console.log('SuggestedUserItem item equal : ', false )
        return false;
    } 
    return true;
} 

export default React.memo(SuggestedUserItem, arePropsEqual); 
