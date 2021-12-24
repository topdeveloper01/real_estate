import React from 'react';
import { TouchableOpacity,Text, View, TextInput, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign'  
import Theme from '../../../theme';

const ListingImgItem = ({ image, weight, onChangeWeight, onDelete }) => {  
    
    return <View style={[Theme.styles.col_center, styles.container,]}>
        <View style={[Theme.styles.col_center, styles.imgView]}>
            <FastImage
                source={{ uri: image.path == null ? image : image.path }}
                style={styles.img}
                resizeMode={FastImage.resizeMode.cover}
            />
            <TouchableOpacity style={[Theme.styles.col_center, styles.closeBtn]} onPress={onDelete}>
                <AntDesign name='close' size={22} color={Theme.colors.text} />
            </TouchableOpacity>
        </View> 
        <TextInput 
            style={styles.input} 
            placeholderTextColor={  Theme.colors.gray3} 
            keyboardType='decimal-pad'
            value={'' + weight}
            onChangeText={(value) => onChangeWeight(value)}
        />
    </View>;
};

const styles = StyleSheet.create({
    container: {
        width: 120, height: 160, backgroundColor: Theme.colors.white, marginRight: 10,  
    },
    closeBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: Theme.colors.white, position: 'absolute', top: 2, right: 2 },
    imgView: { width: '100%', height: 120, },
    img: { width: 120, height: 120, borderRadius: 12, },
    input: {
        fontSize: 14,
        fontFamily: Theme.fonts.medium, 
        flex: 1, 
        color: Theme.colors.text,  
        textAlign: 'center',
        padding: 0,
        borderRadius: 2, marginTop: 10, height: 36, width: '100%', backgroundColor: '#f7f7f7', borderWidth: 0 }
})
 
 
export default ListingImgItem;
