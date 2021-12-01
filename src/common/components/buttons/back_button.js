import React, {memo} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather'

const BackButton = memo(({onPress, style, iconCenter}) => {
    return (
        <TouchableOpacity style={[styles.container, {alignItems: iconCenter ? 'center' : 'flex-start'}, style]} onPress={() => onPress()}>
            <Feather name='chevron-left' color={'#000000'} size={24} style={styles.icon} />
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    // icon: {
    //     height: 20
    // },

});

export default BackButton;
