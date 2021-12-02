import React, { memo } from 'react';
import { TouchableOpacity, Text, } from 'react-native';
import Theme from '../../../theme';
// svgs
import Svg_rad_active from '../../assets/svgs/radio_selected.svg'
import Svg_rad_inactive from '../../assets/svgs/radio_unselected.svg' 

const RadioBtn = ({ onPress, checked, text, style, textStyle}) => {
    return (
        <TouchableOpacity style={[Theme.styles.row_center, style]} onPress={onPress ? onPress : ()=>{}}>
            {
                checked == true ? <Svg_rad_active /> : <Svg_rad_inactive />
            }
            {text && <Text style={textStyle}>{text}</Text>}
        </TouchableOpacity>
    );
};

export default RadioBtn;
