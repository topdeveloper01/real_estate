import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native'; 
import Theme from '../../../theme';
import ListingImgItem from '../../../common/components/vendors/ListingImgItem';

const PhotoList = ({ photos, changePhotos, }) => {
  
    return <View style={[Theme.styles.col_center_start, { width: '100%', alignItems: 'flex-start',   }]}>
        <ScrollView
            horizontal={true}
            style={{ width: '100%', marginTop: 16, paddingBottom: 15, }} 
        >
            {
                photos.map((photo, index) => {
                    return <ListingImgItem
                        key={index}
                        image={photo.image}
                        weight={photo.weight}
                        onChangeWeight={(weight) => {
                            let tmp = photos.slice(0, photos.length);
                            tmp[index].weight = weight;
                            changePhotos(tmp);
                        }}
                        onDelete={() => {
                            let tmp = photos.slice(0, photos.length);
                            tmp.splice(index, 1)
                            changePhotos(tmp);
                        }}
                    />
                })
            }
        </ScrollView>
        <View style={styles.scrollviewHider} />
    </View>
};

const styles = StyleSheet.create({ 
    scrollviewHider: { width: '100%', marginTop: -10, height: 15, backgroundColor: Theme.colors.white },
    divider: { width: '100%', height: 1, backgroundColor: '#F6F6F9' },
})
export default PhotoList;
