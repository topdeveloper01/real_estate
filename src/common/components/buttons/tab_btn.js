import React  from 'react';
import { TouchableOpacity, StyleSheet, Image, Text, View } from 'react-native'; 
import { FOR_RENT, FOR_SELL } from '../../../config/constants';
import Theme from '../../../theme'

const TabsTypeButton =  ({ value, style, onChange }) => {
    return (
        <View style={[Theme.styles.row_center, styles.container, style,]}>
            <TouchableOpacity style={[Theme.styles.col_center, value == FOR_RENT ? styles.activeBtn : styles.inactiveBtn ]} onPress={()=>{
                if(value != FOR_RENT) {
                    onChange(FOR_RENT)
                } 
            }}> 
                <Text style={styles.btnTxt}>租盤 RENT</Text>
            </TouchableOpacity>
            <View style={{ width: 20 }} />
            <TouchableOpacity style={[Theme.styles.col_center, value == FOR_SELL ? styles.activeBtn : styles.inactiveBtn ]} onPress={()=>{
                if (value != FOR_SELL) {
                    onChange(FOR_SELL)
                } 
            }}>
                <Text style={styles.btnTxt}>售盤 BUY</Text>
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 18,
        paddingHorizontal: 20, 
        paddingBottom : 7, 
        backgroundColor: '#fff',
    },
    activeBtn : {flex: 1, height: 40, borderRadius: 10, backgroundColor: Theme.colors.yellow1},
    inactiveBtn : {flex: 1, height: 40, borderRadius: 10, backgroundColor: '#F7F7F7'},
    btnTxt: { fontSize: 16, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text }
});

export default TabsTypeButton;
