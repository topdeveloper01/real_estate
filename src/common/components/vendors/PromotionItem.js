import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppText from '../../../common/components/AppText';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import Config from '../../../config';
import React from 'react';

const PromotionItem = ({ data, onSelect, style }) => {

    const getDateLimit = () => {
        return moment(data.end_time, "YYYY-MM-DD  hh:mm:ss").diff(moment(new Date()), 'days');
    }

    return <TouchableOpacity onPress={() => onSelect()}
        style={[Theme.styles.col_center, styles.container, style]}>
        <View style={[Theme.styles.row_center_start, { width: '100%', marginBottom: 4, }]}>
            <Text style={[styles.title]}>{data.title}</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                {
                    getDateLimit() > 0 &&
                    <Text style={styles.date_limit}>{getDateLimit()} days left</Text>
                }
            </View>
        </View>
        <View style={[Theme.styles.row_center, Theme.styles.w100]}>
            <View style={[Theme.styles.col_center_start, { flex: 1, alignItems: 'flex-start' }]}>
                <Text style={[styles.sub_title]}>{data.type.charAt(0).toUpperCase() + data.type.slice(1)}</Text>
                <Text style={[styles.descTxt]}>{data.description}</Text>
            </View>
            {
                data.type == 'discount' && <View style={[Theme.styles.col_center_start, styles.imgView]}>
                    <FastImage
                        source={{ uri: Config.IMG_BASE_URL + data.promotion_details.product_image_thumbnail_path }}
                        style={styles.img}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
            } 
        </View>
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    container: { height: 116, width: '100%', alignItems: 'flex-start', borderRadius: 15, backgroundColor: '#FAFAFC', padding: 12, marginRight: 16, },
    imgView: { marginLeft: 12, backgroundColor: Theme.colors.white, borderRadius: 10, borderWidth: 1, borderColor: Theme.colors.gray9 },
    img: { width: 56, height: 56, borderRadius: 12, resizeMode: 'cover' },
    title: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold, },
    sub_title: { fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold, },
    descTxt: { marginTop: 8, marginBottom: 8, fontSize: 12, color: Theme.colors.gray7, fontFamily: Theme.fonts.medium, },
    date_limit: { fontSize: 12, fontFamily: Theme.fonts.semiBold, color: '#F55A00', marginBottom: 3 },
})
export default PromotionItem;
