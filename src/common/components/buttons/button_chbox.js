import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Theme from '../../../theme'

const ButtonCheckbox = memo(({ onSelect, name, isChecked, style }) => {
    return (
        <TouchableOpacity onPress={()=>onSelect(name)} style={[Theme.styles.col_center, { ...styles.container, ...style }, isChecked && {backgroundColor : '#23CBD826'},]} >
            <Text style={[styles.txt, isChecked && {fontFamily: Theme.fonts.bold}]}>{name}</Text>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        height: 32,
        paddingHorizontal: 12,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: Theme.colors.cyan2,
        backgroundColor : Theme.colors.white,
    },
    txt : {fontSize: 13, lineHeight : 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.cyan2}, 
});

export default ButtonCheckbox;
