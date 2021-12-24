import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ImageBackground, View, Text, StyleSheet, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux'; 
import AppText from '../AppText'; 
import Theme from '../../../theme'; 
import Img_placeholder from '../../assets/images/placeholder2.png'
import { formatNumber } from '../../services/utility';

const VendorItem = (props) => {
    const { data, can_delete, onSelect, onEdit, onDelete, style } = props

    return <TouchableOpacity onPress={() => onSelect()}
        style={[Theme.styles.row_center, styles.container, style,]}>
        <View style={[Theme.styles.col_center, styles.imgView]}> 
            <FastImage
                source={
                    data.photos != null && data.photos.length > 0 ? 
                    { uri:  data.photos[0].image } : Img_placeholder
                }
                style={styles.img}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
        <View style={{ flex: 1, height: '100%', paddingVertical: 4, paddingLeft: 12, flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                <AppText style={[styles.title]}>{data.title}</AppText>
                {
                    can_delete == true &&
                    <TouchableOpacity style={{ paddingHorizontal: 4, marginRight: 8 }} onPress={onEdit ? onEdit : ()=>{}}>
                        <AppText style={styles.deleteBtnTxt}>編輯</AppText>
                    </TouchableOpacity>
                } 
                {
                    can_delete == true &&
                    <TouchableOpacity style={{ paddingHorizontal: 4 }} onPress={onDelete ? onDelete : ()=>{}}>
                        <AppText style={styles.deleteBtnTxt}>刪除</AppText>
                    </TouchableOpacity>
                } 
            </View>
            <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                <AppText style={[styles.title]}>{data.title_en}</AppText>
            </View>
            <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 5 }]}>
                <AppText style={[styles.text]} numberOfLines={1}>{data.area} {data.street} {data.building} {data.floor}</AppText>
            </View>
            <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                <View style={{ flex: 1 }} />
                <AppText style={[styles.price]}>${formatNumber(data.price)}</AppText>
            </View>
        </View>
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    container: {
        height: 120, width: '100%', alignItems: 'flex-start', paddingVertical: 16,
        backgroundColor: Theme.colors.white, borderBottomWidth: 1, borderBottomColor: Theme.colors.gray4
    },
    imgView: { width: 150, height: 88, backgroundColor: '#F6F6F9' },
    img: { width: 150, height: 88, },
    title: { flex: 1, fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.bold, marginRight: 6 },
    text: { fontSize: 12, color: Theme.colors.gray3, fontFamily: Theme.fonts.semiBold, },
    tag: { marginRight: 6, padding: 6, borderRadius: 6, backgroundColor: Theme.colors.yellow1 },
    tag_txt: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold },
    price: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold, },
    deleteBtnTxt: { fontSize: 14, color: Theme.colors.red, fontFamily: Theme.fonts.semiBold, },
})

function arePropsEqual(prevProps, nextProps) {
    return prevProps.vendor_id == nextProps.vendor_id
}

const mapStateToProps = ({ app, shop }) => ({
    isLoggedIn: app.isLoggedIn,
});
export default connect(mapStateToProps, {   })(VendorItem);
