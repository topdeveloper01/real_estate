import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from '../../../modules/search/styles/resultsStyles';
import FastImage from 'react-native-fast-image';
import AppText from '../AppText';
import { translate } from '../../services/translate';
import Svg_img from '../../assets/svgs/empty/no_orders.svg';

const NoOrders = ({ isCurrent,style, onRemoveFiltersPressed }) => {
    return (
      <View style={[styles.nores, style]}> 
          <Svg_img />
          <AppText style={[styles.description, {marginTop: 16}]}>{isCurrent == true ? translate('orders.no_recent_orders') : translate('orders.no_past_orders')}</AppText>
          <AppText style={styles.description}>{translate('orders.no_recent_orders_message')}</AppText>
          {!!onRemoveFiltersPressed && (
            <TouchableOpacity
              onPress={onRemoveFiltersPressed}
              style={{ marginTop: 30, padding: 10 }}
              activeOpacity={0.7}
            >
                <AppText style={{ color: '#61C8D5', fontSize: 16 }}>
                  {translate('search.clearAppliedFilters')}
                </AppText>
            </TouchableOpacity>
          )}
      </View>
    );
};

export default NoOrders;
