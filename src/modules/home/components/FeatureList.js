import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { width } from 'react-native-dimension';
import { AppText } from '../../../common/components';
import Theme from '../../../theme';
import FeaturedVendorItem from '../../../common/components/vendors/FeaturedVendorItem';

const FeatureList = ({ label, items, goVendorDetail, }) => {

    const [showAll, setShowAll] = useState(false);

    return <View style={[Theme.styles.col_center_start, { width: '100%', alignItems: 'flex-start', marginBottom: 16 }]}>
        <AppText style={styles.subjectTitle}>{label}</AppText>
        <ScrollView
            horizontal={true}
            style={{ width: '100%', marginTop: 16, paddingBottom: 15,  }}
            onScroll={() => {
                setShowAll(true);
            }}
        >
            {
                items.slice(0, (showAll == true ? items.length : 2)).map((vendor, index) =>
                    <FeaturedVendorItem
                        key={vendor.id}
                        data={vendor}
                        vendor_id={vendor.id}
                        onSelect={() => goVendorDetail(vendor)}
                    />
                )
            }
        </ScrollView>
        <View style={styles.scrollviewHider} />
    </View>
};

const styles = StyleSheet.create({
    subjectTitle: { fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text },
    scrollviewHider: { width: '100%', marginTop: -10, height: 15, backgroundColor: Theme.colors.white },
    divider: { width: '100%', height: 1, backgroundColor: '#F6F6F9' },
})
export default FeatureList;
