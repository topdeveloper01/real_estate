import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Theme from '../../../theme'

const IconButton = memo(({ onPress, icon, text, style, textStyle, showAlert, diabled }) => {
    return (
        <TouchableOpacity disabled={diabled == true} style={[Theme.styles.row_center, { ...styles.container, ...style }]} onPress={onPress}>
            {icon}
            <Text style={[styles.text, textStyle]}>{text}</Text>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#E9E9F7',
    },
    text : {
        fontSize: 14,
        fontWeight: '500',
        color : Theme.colors.text,
        marginLeft: 30
    }
});

export default IconButton;
