import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import Theme from "../../../theme";
import {isEmpty, getImageFullURL} from '../../../common/services/utility';
import { translate } from '../../../common/services/translate';
import { findZodiacSign } from '../../../common/components/ZodiacSign';


const SnapfooderAvatar = ({full_name, photo, birthdate, country}) => {
    console.log('SnapfooderAvatar');
    return (
        <View style={[Theme.styles.col_center, styles.avatarView]}>
            <View style={[Theme.styles.col_center, styles.photoView]}>
                <FastImage
                    source={{ uri: getImageFullURL(photo) }}
                    style={styles.avatarImg}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={[Theme.styles.row_center, { marginTop: 10 }]}>
                <Text style={styles.name}>{full_name}</Text>
                {
                    birthdate != null &&
                    findZodiacSign(moment(birthdate).toDate())
                }
            </View>
            <Text style={styles.infoTxt}>{country}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    avatarView: { marginTop: 16, },
    photoView: { height: 100, width: 100, borderWidth: 1, borderColor: Theme.colors.gray9, borderRadius: 15, backgroundColor: '#E8D7D0' },
    avatarImg: { width: 100, height: 100, borderRadius: 6, },
    name: { marginRight: 4, fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
    infoTxt: { marginTop: 6, fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.gray7 },
});

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.full_name != nextProps.full_name || 
        prevProps.photo != nextProps.photo || 
        prevProps.birthdate != nextProps.birthdate || 
        prevProps.country != nextProps.country
        ) {
        console.log('SnapfooderAvatar item equal : ', false )
        return false;
    } 
    return true;
} 

export default React.memo(SnapfooderAvatar, arePropsEqual); 
