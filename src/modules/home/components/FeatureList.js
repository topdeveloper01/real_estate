import React, {useEffect, useState} from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { width } from 'react-native-dimension';
import { AppText } from '../../../common/components';
import Theme from '../../../theme';
import { VendorItem } from '../../../common/components';

const FeatureList = ({ label, items, goVendorDetail, onFavChange }) => {

    const [showAll, setShowAll] = useState(false);
    
    return <View style={[Theme.styles.col_center_start, { width: '100%', alignItems: 'flex-start', marginBottom: 16 }]}>
        <AppText style={styles.subjectTitle}>{label}</AppText>
        <ScrollView
            horizontal={true}
            style={{ width: '100%', marginTop: 16, paddingBottom: 15, }}
            onScroll={() => {
                setShowAll(true);
            }}
        >
            {
                items.slice(0, (showAll == true ? items.length : 2 )).map((vendor, index) =>
                    <VendorItem
                        key={vendor.id}
                        data={vendor}
                        vendor_id={vendor.id}
                        isFav={vendor.isFav}
                        is_open={vendor.is_open}
                        style={items.length == 1 ? { width: width(100) - 40, marginRight: 0, } : null}
                        onFavChange={onFavChange}
                        onSelect={() => goVendorDetail(vendor)}
                    />
                )
            }
        </ScrollView>
        <View style={styles.scrollviewHider} />
        <View style={styles.divider} />
    </View>
};

const styles = StyleSheet.create({
    subjectTitle: { fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
    scrollviewHider: { width: '100%', marginTop: -12, height: 15, backgroundColor: Theme.colors.white },
    divider: { width: '100%', height: 1, backgroundColor: '#F6F6F9' },
})
export default FeatureList;
