import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, } from 'react-native';
// svgs
import Svg_cb_active from '../../assets/svgs/checkbox_selected.svg'
import Svg_cb_inactive from '../../assets/svgs/checkbox_unselected.svg'

const CheckBox = memo(({ onPress, checked}) => {
    return (
        <TouchableOpacity onPress={onPress ? onPress : ()=>{}}>
            {
                checked == true ? <Svg_cb_active /> : <Svg_cb_inactive />
            }
        </TouchableOpacity>
    );
});

export default CheckBox;
