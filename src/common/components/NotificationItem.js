import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ImageBackground, View, Text, StyleSheet, Image } from 'react-native'; 
import AppText from './AppText';
import Theme from '../../theme';
//svgs
import Svg_noti from '../assets/svgs/noti_circle.svg';

const NotificationItem = ({title, message}) => { 

    return <TouchableOpacity activeOpacity={0.9}
        style={[Theme.styles.col_center, styles.container, ]}>
        <View style={[Theme.styles.row_center]}>
            <Svg_noti />
            <View style={{ flex: 1, width: '100%', paddingLeft: 12, flexDirection: 'column', }}>
                <View style={[Theme.styles.row_center_start, { width: '100%' }]}>
                    <AppText style={[styles.title]}>{title}</AppText>
                </View>
                <View style={[Theme.styles.row_center_start, { width: '100%', marginTop: 6 }]}>
                    <AppText style={[styles.text]} >{message}</AppText>
                </View>
            </View>
        </View>
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Theme.colors.white,
        shadowColor: Theme.colors.blackPrimary,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
        marginBottom: 16,
        borderRadius: 16,
        padding: 12, 
    }, 
    title: { fontSize: 16, color: Theme.colors.text, fontFamily: Theme.fonts.bold,  },
    text: { fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.medium, }, 
})

function arePropsEqual(prevProps, nextProps) {
    return prevProps.title == nextProps.title && prevProps.message == nextProps.message
}
 
export default React.memo(NotificationItem, arePropsEqual);
