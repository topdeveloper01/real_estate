import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from '../../../modules/search/styles/resultsStyles';
import Theme from '../../../theme';
import AppText from '../../../common/components/AppText';
import { translate } from '../../../common/services/translate';
import Svg_img from '../../../common/assets/svgs/empty/no_chat.svg';
import Svg_add_chat from '../../../common/assets/svgs/empty/add_chat.svg';

const NoChats = ( ) => {
  return (
    <View style={[styles.nores, {marginTop: 80}]}>
      <Svg_img />
      <AppText style={[styles.description, { marginTop: 32 }]}>還沒有活躍的對話！</AppText> 
    </View>
  );
};

export default NoChats;
