import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import MapView, { Callout, PROVIDER_GOOGLE, Point } from "react-native-maps";
import Theme from "../../../theme";
import { translate } from '../../../common/services/translate';

const UserMarkers = ({ latitude, longitude }) => {
    console.log('UserMarkers');
    return (
        <MapView.Marker
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={{ latitude: latitude, longitude: longitude }}
        >
            <View style={styles.markerOutter}>
                <View style={styles.markerInner} />
            </View>
            <Callout tooltip={true} onPress={() => { }}>
                <View>
                    <View style={{ width: 80, height: 40, backgroundColor: 'white', borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1, flexDirection: 'row', paddingHorizontal: 20 }}>
                        <Text style={{ color: Theme.colors.text, fontSize: 18, fontFamily: Theme.fonts.bold }}>{translate('you')}</Text>
                    </View>
                    <View style={{ width: 20, height: 20, backgroundColor: 'white', transform: [{ rotate: '45deg' }], marginTop: -8, marginLeft: 30, zIndex: 0 }} />
                </View>
            </Callout>
        </MapView.Marker>
    );
}

const styles = StyleSheet.create({
    markerOutter: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#25DEE240', alignItems: 'center', justifyContent: 'center' },
    markerInner: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#23CBD8' },
});

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.latitude != nextProps.latitude ||
        prevProps.longitude != nextProps.longitude
    ) {
        console.log('UserMarker item equal : ', false)
        return false;
    }
    return true;
}

export default React.memo(UserMarkers, arePropsEqual);
