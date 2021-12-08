import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import Theme from "../../../theme";
import RadioBtn from '../../components/buttons/radiobtn'; 
import { MainBtn } from '../../../common/components';

const FilterModal = ({ showModal, items, value, title, onSave, onClose }) => {
    const [curValue, setCurValue] = useState(value - 1);
    const [visible, SetVisible] = useState(showModal)

    useEffect(() => {
        SetVisible(showModal)
    }, [showModal])

    return <Modal
        isVisible={visible}
        backdropOpacity={0.33}
        onSwipeComplete={() => onClose()}
        onBackdropPress={() => onClose()}  >
        <View style={[Theme.styles.col_center, styles.modalContent]}>
            <Text style={styles.modalTitle}>{title}</Text>
            {
                items.map(item =>
                    <TouchableOpacity key={item.value} style={[Theme.styles.row_center, {width: '100%', paddingVertical: 12}]}
                        onPress={() => {
                            setCurValue(item.value)
                        }}>
                        <Text style={styles.itemTxt}>{item.label}</Text>
                        <RadioBtn
                            checked={item.value == curValue}
                            onPress={() => {
                                setCurValue(item.value)
                            }}
                        />
                    </TouchableOpacity>
                )
            }

            <MainBtn
                title={'確認'}
                onPress={() => {
                    onSave(curValue);
                }}
                style={{ marginTop: 20,  width: '100%'}}
            />
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    modalContent: { width: '100%', paddingHorizontal: 20, paddingBottom: 30, paddingTop: 30, backgroundColor: Theme.colors.white, borderRadius: 15, },
    modalTitle: { fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text, marginBottom: 12},
    itemTxt: {flex: 1, fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text, },
});

export default FilterModal;
