import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import Theme from "../../../theme"; 
import AuthInput from '../AuthInput';
import { MainBtn } from '../../../common/components';

const AddCityModal = ({ title, showModal, onSave, onClose }) => {
    const [curValue, setCurValue] = useState('');
    const [visible, SetVisible] = useState(showModal)

    useEffect(() => {
        SetVisible(showModal)
        setCurValue('')
    }, [showModal])

    return <Modal
        isVisible={visible}
        backdropOpacity={0.33}
        onSwipeComplete={() => onClose()}
        onBackdropPress={() => onClose()}  >
        <View style={[Theme.styles.col_center, styles.modalContent]}>
            <Text style={styles.modalTitle}>{title}</Text>
            <View style={[{ width: '100%', marginTop: 20, justifyContent: 'space-between', }]}>
                <AuthInput
                    placeholder={''}
                    underlineColorAndroid={'transparent'}
                    onChangeText={text => setCurValue(text)}
                    returnKeyType={'next'}
                    autoCapitalize={'none'}
                    value={curValue}
                    secure={false}
                    fontSize={14}
                    textAlign='center'
                    selectionColor={Theme.colors.cyan2}
                    placeholderTextColor={Theme.colors.text}
                    backgroundColor={Theme.colors.gray4}
                    style={{  backgroundColor: Theme.colors.gray4 }}
                />
            </View> 
            <MainBtn
                title={'確認'}
                onPress={() => {
                    onSave(curValue);
                }}
                style={{ marginTop: 20, width: '100%' }}
            />
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    modalContent: { width: '100%', paddingHorizontal: 20, paddingBottom: 30, paddingTop: 30, backgroundColor: Theme.colors.white, borderRadius: 15, },
    modalTitle: { fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text, marginBottom: 12 }, 
});

export default AddCityModal;
