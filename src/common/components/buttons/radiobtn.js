import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, } from 'react-native';
// svgs
import Svg_rad_active from '../../assets/svgs/radio_selected.svg'
import Svg_rad_inactive from '../../assets/svgs/radio_unselected.svg'
import Svg_rad1_active from '../../assets/svgs/radio1_selected.svg'
import Svg_rad1_inactive from '../../assets/svgs/radio1_unselected.svg'

const RadioBtn = ({ onPress, checked, btnType, style}) => {
    return (
        <TouchableOpacity style={style} onPress={onPress ? onPress : ()=>{}}>
            {
                checked == true ? ( btnType == 1 ? <Svg_rad1_active /> : <Svg_rad_active /> ): ( btnType == 1 ? <Svg_rad1_inactive /> : <Svg_rad_inactive />)
            }
        </TouchableOpacity>
    );
};

export default RadioBtn;
