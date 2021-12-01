import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import Theme from '../../../theme'

const RoundIconButton = memo(({ onPress, icon, style, showAlert, diabled }) => {
    return (
        <TouchableOpacity disabled={diabled == true} style={[Theme.styles.col_center, { ...styles.container, ...style }]} onPress={onPress}>
            {icon}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#E9E9F7',
    },
});

export default RoundIconButton;
