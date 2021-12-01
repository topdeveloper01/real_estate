import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from '../../../modules/search/styles/resultsStyles';
import FastImage from 'react-native-fast-image';
import AppText from '../AppText';
import { translate } from '../../services/translate';

const NoPromotion = () => {
    return (
      <View style={styles.nores}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={require('../../../common/assets/images/nopromo.png')}
            style={styles.image}
          />
          <AppText style={styles.title}>{translate('promotions.no_promotions')}</AppText>
          <AppText style={styles.description}>{translate('promotions.no_promotions_message')}</AppText> 
      </View>
    );
};

export default NoPromotion;
