import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { translate } from '../../common/services/translate';
import Theme from '../../theme';
import RadioBtn from '../../common/components/buttons/radiobtn';


const AddressItem = ({ data, editable, isPrimary, user, edit_text, outOfDeliveryArea, showNotes, onEdit, onSelect, textSize, style }) => {
    return <TouchableOpacity activeOpacity={1} onPress={onSelect ? onSelect : () => { }} style={[Theme.styles.col_center, styles.container, style]}>
        {
            editable != false && <View style={[Theme.styles.row_center, { width: '100%', marginBottom: 6, }]}>
                <View style={[styles.typeView]}>
                    <Text style={[styles.type, textSize && { fontSize: textSize }]}>{translate(data.address_type || 'Home')}</Text>
                </View>
                {data.favourite == 1 && <Text style={[styles.primarytxt,  textSize && { fontSize: textSize }]}>{translate('primary')}</Text>}
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={onEdit ? onEdit : () => { }}>
                    <Text style={[styles.editBtn,  textSize && { fontSize: textSize }]}>{edit_text ? edit_text : translate('address_list.edit')}</Text>
                </TouchableOpacity>
                {
                    onSelect && <RadioBtn onPress={onSelect} checked={data.favourite == 1} style={{ marginLeft: 20 }} />
                }
            </View>
        }
        {/* <Text style={styles.name}>{data.full_name}</Text> */}
        <Text style={[styles.phone, textSize && { fontSize: textSize }, { marginBottom: 4 }]}>{user.phone}</Text>
        <Text style={[styles.phone, textSize && { fontSize: textSize },]}>{data.street} {data.city}, {data.country}</Text>
        {
            outOfDeliveryArea == true && 
            <Text style={styles.out_delivery_area_txt}>{translate('cart.out_of_range_address')}</Text>
        }
        {
            showNotes == true && data.notes != null && data.notes != '' &&
            <Text style={[styles.phone, {marginTop: 4,}, textSize && { fontSize: textSize },]}>{data.notes}</Text>
        }
    </TouchableOpacity>;
};

const styles = StyleSheet.create({
    container: { width: '100%', alignItems: 'flex-start', borderRadius: 15, backgroundColor: Theme.colors.gray8, paddingVertical: 12, paddingHorizontal: 15, },
    typeView: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, backgroundColor: '#23cbd838' },
    type: { fontSize: 11, color: Theme.colors.cyan2, fontFamily: Theme.fonts.semiBold, },
    editBtn: { fontSize: 13, color: Theme.colors.gray7, fontFamily: Theme.fonts.semiBold, },
    name: { marginBottom: 6, fontSize: 15, color: Theme.colors.text, fontFamily: Theme.fonts.semiBold, },
    phone: { fontSize: 13, color: Theme.colors.text, fontFamily: Theme.fonts.medium, },
    primarytxt: { marginLeft: 8, fontSize: 13, color: Theme.colors.red1, fontFamily: Theme.fonts.bold, },
    out_delivery_area_txt: { marginTop: 4, width: '100%', textAlign: 'center', fontSize: 15, fontFamily: Theme.fonts.semiBold, color: Theme.colors.danger },
})

function mapStateToProps({ app }) {
    return {
        user: app.user,
    };
}

export default connect(mapStateToProps, {
})(AddressItem);
