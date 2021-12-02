import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from '../../../modules/search/styles/resultsStyles';
import FastImage from 'react-native-fast-image';
import AppText from '../AppText';
import { translate } from '../../services/translate';
import Svg_img from '../../assets/svgs/empty/empty_list.svg';
import Theme from '../../../theme';

const NoRestaurants = ({style}) => {
    return (
      <View style={[styles.nores, style]}> 
          <Svg_img />
          <AppText style={{fontSize: 18, fontFamily: Theme.fonts.bold, color : Theme.colors.gray3, marginTop: 24}}>暫時沒有相關紀錄</AppText> 
      </View>
    );
};

export default NoRestaurants;
