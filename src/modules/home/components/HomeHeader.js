import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { width } from 'react-native-dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import { getImageFullURL } from '../../../common/services/utility';
import Theme from '../../../theme';
import { AppBadge, RoundIconBtn } from '../../../common/components';
import Switch from '../components/Switch';

const MIN_W = 386
const HomeHeader = ({ curTab, coordinates, isLoggedIn, cashback_amount, photo, onLocationSetup, onGoWallet, onGoProfile, onTabChange }) => {

    console.log('--- HomeHeader ---')
    return <View style={[Theme.styles.row_center, styles.header]}>
        <Switch
            items={['Vendors', 'Grocery']}
            cur_item={curTab}
            onSelect={(item) => {
                onTabChange(item)
            }}
        />
        <View style={[Theme.styles.row_center_end, { flex: 1, alignItems: 'flex-end' }]}>
            <RoundIconBtn style={{ width: 40, height: 40 }} icon={<Entypo name='location-pin' size={26} color={Theme.colors.cyan2} />}
                onPress={() => onLocationSetup(coordinates)} />
            {
                isLoggedIn && width(100) >= MIN_W  &&
                <View style={{ width: 48, height: 48, marginLeft: 10, justifyContent: 'flex-end' }}>
                    <RoundIconBtn style={{ width: 40, height: 40 }}
                        icon={<Entypo name='wallet' size={26} color={Theme.colors.cyan2} />}
                        onPress={() => {
                            onGoWallet()
                        }} />
                    <AppBadge value={cashback_amount || 0} style={{ position: 'absolute', top: 0, right: 0 }} />
                </View>
            }
            {
                isLoggedIn &&
                <TouchableOpacity style={[Theme.styles.col_center, styles.profileBtn]}
                    onPress={() => onGoProfile()}
                >
                    <FastImage
                        source={{ uri: getImageFullURL(photo) }}
                        style={{
                            borderRadius: 20,
                            width: 38,
                            height: 38,
                            resizeMode: 'contain',
                        }}
                    />
                </TouchableOpacity>
            }
        </View>
    </View>
};

const styles = StyleSheet.create({
    header: { height: 50, width: '100%', paddingHorizontal: 20, marginTop: 40, alignItems: 'flex-end' },
    profileBtn: { marginLeft: 10, marginBottom: 2, },
})

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.isLoggedIn != nextProps.isLoggedIn ||
        prevProps.photo != nextProps.photo || 
        prevProps.curTab != nextProps.curTab || 
        prevProps.coordinates.latitude != nextProps.coordinates.latitude ||
        prevProps.coordinates.longitude != nextProps.coordinates.longitude
    ) {
        return false;
    }
    return true;
}

export default React.memo(HomeHeader, arePropsEqual);
