import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { isEmpty, getImageFullURL } from '../../../common/services/utility'; 
import Theme from '../../../theme';
// svgs
import Svg_edit from '../../../common/assets/svgs/btn-edit.svg';

const ProfileAvatarView = ({ photo, full_name, onEdit }) => {
    console.log('ProfileAvatarView')

    return <View style={[Theme.styles.row_center, styles.container]}>
        <View style={[Theme.styles.col_center, styles.photoView]}>
            <FastImage
                source={
                    isEmpty(photo) ?
                        require('../../../common/assets/images/user-default.png')
                        :
                        { uri: photo }
                }
                style={styles.avatarImg}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
        <View style={[ Theme.styles.flex_1, { marginTop: 12 }]}>
            <Text style={styles.name}>{full_name}</Text>
        </View>
        <TouchableOpacity onPress={onEdit}>
            <Svg_edit />
        </TouchableOpacity>
    </View>
};

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%'  },
    photoView: { height: 80, width: 80, borderWidth: 1, borderColor: Theme.colors.gray9, borderRadius: 40, },
    avatarImg: { width: 80, height: 80, borderRadius: 40, },
    name: { marginLeft: 20, fontSize: 18, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
    infoTxt: { marginTop: 6, fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.gray7 },
})

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.photo != nextProps.photo ||
        prevProps.full_name != nextProps.full_name
    ) {
        return false;
    }
    return true;
}

export default React.memo(ProfileAvatarView, arePropsEqual);
