import React from 'react';
import { Text, View, StyleSheet } from 'react-native'; 
import AntDesign from 'react-native-vector-icons/AntDesign' 
import Theme from '../../../theme';

const StateText = ({ active, text}) => {
    return <View style={[Theme.styles.row_center, styles.container, {opacity : active == true ? 1 : 0.4 }]}>
        <AntDesign name='checkcircle' size={18} color={'#FF7675'} />
        <Text style={styles.text}>{text}</Text>
    </View>;
};

const styles = StyleSheet.create({
    container: {  marginRight: 14, marginBottom: 14, },
    text : {marginLeft: 6, fontSize: 14, color: Theme.colors.text, fontFamily: Theme.fonts.medium},
})


function arePropsEqual(prevProps, nextProps) {
    return prevProps.active == nextProps.active && prevProps.text == nextProps.text
}

export default React.memo(StateText, arePropsEqual);
