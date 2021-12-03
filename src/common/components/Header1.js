import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Theme from '../../theme';
import React from 'react';

const Header1 = ({ left, right, title, style, onLeft, onRight }) => {

    return <View style={[styles.header, style]}>
        <View style={[{ width: '100%', }, Theme.styles.row_center]}>
            <View style={[Theme.styles.flex_1, { flexDirection: 'row', }]}>
                <TouchableOpacity onPress={onLeft ? onLeft : () => { }}>
                    {
                        left ? left : <Feather name="chevron-left" size={24} color={Theme.colors.text} />
                    }
                </TouchableOpacity>
            </View>
            <Text style={Theme.styles.headerTitle}>{title}</Text>
            <View style={[Theme.styles.flex_1, Theme.styles.row_center, { justifyContent: 'flex-end', paddingRight: 8 }]}>
                <TouchableOpacity onPress={onRight ? onRight : () => { }}>
                    {right}
                </TouchableOpacity>
            </View>
        </View>
    </View>;
};

const styles = StyleSheet.create({
    header: {
        width: '100%', height: 70, backgroundColor: Theme.colors.white, elevation: 6, paddingBottom: 8, marginBottom: 24, alignItems: 'flex-end', 
        flexDirection: 'row',
        borderBottomColor: Theme.colors.gray4,
        borderBottomWidth: 1
    },
})
export default Header1;
