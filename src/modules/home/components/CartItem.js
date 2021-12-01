import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Counter from '../../../common/components/buttons/counter';
import Theme from '../../../theme';
import Svg_delete from '../../../common/assets/svgs/ic_delete.svg'

const CartItem = ({ data, onPlus, onMinus, onDelete, style }) => {
    return <View style={[Theme.styles.row_center, styles.container, style]}> 
        <View style={[Theme.styles.col_center, styles.infoView]}>
            <Text style={[styles.title]}>{data.title}</Text>
            <Text style={[styles.price]}>{parseInt(data.price)} L</Text>
        </View>
        <TouchableOpacity style={{ marginRight: 15}} onPress={onDelete ? ()=>onDelete(data.id) : () => { }} > 
            <Svg_delete/>
        </TouchableOpacity>
        <View style={styles.divider} /> 
        <Counter value={data.quantity}
                onPlus={() => onPlus(data.id)}
                onMinus={() => {
                    if(data.quantity > 1) {
                        onMinus(data.id)
                    } 
                    else {
                        onDelete(data.id)
                    }
                }} 
                btnSize={18}
                value_style={{fontSize: 14, paddingBottom : 1}}
                style={{
                    backgroundColor: Theme.colors.gray8,
                    width : 90,
                    height: 40,
                    marginLeft: 6,
                }}
                />
    </View>;
};

const styles = StyleSheet.create({
    container: { width: '100%', },
    divider: { width: 1, height: 15, backgroundColor: Theme.colors.gray6 },
    qty : { marginLeft: 12, marginRight: 12, fontSize: 13, color: Theme.colors.red1, fontFamily: Theme.fonts.semiBold, },
    title: { marginTop: 8, fontSize: 13, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold, },
    price: { marginTop: 2, marginBottom: 13, fontSize: 14, color: Theme.colors.red1, fontFamily: Theme.fonts.bold, },
    infoView: { flex: 1, alignItems: 'stretch', marginLeft: 12, },
})
export default CartItem;
