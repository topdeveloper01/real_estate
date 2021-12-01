import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { isEmpty, getImageFullURL } from '../../../common/services/utility';
import { findZodiacSign } from '../../../common/components/ZodiacSign';
import Theme from '../../../theme';
// svgs
import Svg_edit from '../../../common/assets/svgs/btn_edit.svg';
import Svg_birthday from '../../../common/assets/svgs/ic_birthday.svg';

const ProfileAvatarView = ({ photo, full_name, birthdate, city, country, onEdit }) => {
    console.log('ProfileAvatarView')

    return <View style={[Theme.styles.col_center, styles.container]}>
        <View style={[Theme.styles.row_center_end, { width: '100%' }]}>
            <TouchableOpacity onPress={onEdit}>
                <Svg_edit />
            </TouchableOpacity>
        </View>
        <View style={[Theme.styles.col_center, styles.avatarView]}>
            <View style={[Theme.styles.col_center, styles.photoView]}>
                <FastImage
                    source={
                        (isEmpty(photo) || photo == 'x') ?
                            require('../../../common/assets/images/user-default.png')
                            :
                            { uri: getImageFullURL(photo) }
                    }
                    style={styles.avatarImg}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={[Theme.styles.row_center, { marginTop: 12 }]}>
                <Text style={styles.name}>{full_name}</Text>
                {
                    birthdate != null &&
                    findZodiacSign(moment(birthdate).toDate())
                }
            </View>
            {
                birthdate != null &&
                <View style={[Theme.styles.row_center,]}>
                    <Svg_birthday />
                    <Text style={[styles.infoTxt, { paddingBottom: 6, marginLeft: 6 }]}>
                        {moment(birthdate).format('D MMM, YYYY')} ({moment().diff(moment(birthdate), 'years')}y)
                    </Text>
                </View>
            }
            <Text style={styles.infoTxt}>{city}, {country}</Text>
        </View>
    </View>
};

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', paddingHorizontal: 20 },
    avatarView: { marginTop: 16, },
    photoView: { height: 100, width: 100, borderWidth: 1, borderColor: Theme.colors.gray9, borderRadius: 15, backgroundColor: '#E8D7D0' },
    avatarImg: { width: 100, height: 100, borderRadius: 6, },
    name: { marginRight: 4, paddingBottom: 4, fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
    infoTxt: { marginTop: 6, fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.gray7 },
})

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.photo != nextProps.photo ||
        prevProps.full_name != nextProps.full_name ||
        prevProps.birthdate != nextProps.birthdate ||
        prevProps.city != nextProps.city ||
        prevProps.country != nextProps.country
    ) {
        return false;
    }
    return true;
}

export default React.memo(ProfileAvatarView, arePropsEqual);
