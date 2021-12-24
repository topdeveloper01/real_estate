import React  from 'react';
import { TouchableOpacity, StyleSheet, Image, Text, View } from 'react-native';  
import Theme from '../../../theme'

const ImgVideoTab =  ({ value, onChange }) => {
    return (
        <View style={[Theme.styles.row_center, styles.container ]}>
            <TouchableOpacity style={[Theme.styles.col_center,  ]} onPress={()=>{
                if(value != 'img') {
                    onChange('img')
                } 
            }}> 
                <Text style={value == 'img' ? styles.activeBtn : styles.inactiveBtn}>圖片</Text>
            </TouchableOpacity>
            <View style={{ width: 40 }} />
            <TouchableOpacity style={[Theme.styles.col_center,  ]} onPress={()=>{
                if (value != 'video') {
                    onChange('video')
                } 
            }}>
                <Text style={value == 'video' ? styles.activeBtn : styles.inactiveBtn}>視頻</Text>
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 20, 
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    activeBtn : { fontSize: 14, lineHeight: 21,  color: Theme.colors.text, textDecorationLine : 'underline'},
    inactiveBtn : { fontSize: 14, lineHeight: 21, borderRadius: 10, color: '#00000055'},
});

export default React.memo(ImgVideoTab);
