import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import Theme from '../../../theme'; 
import Svg_image from '../../../common/assets/svgs/msg/image.svg'
import Svg_camera from '../../../common/assets/svgs/msg/camera.svg'

const ImgPickOptionModal = ({ title, showModal, onCapture, onImageUpload, onClose }) => {
    const [visible, SetVisible] = useState(showModal)

    useEffect(() => {
        SetVisible(showModal)
    }, [showModal])

    return <Modal
        isVisible={visible}
        backdropOpacity={0.33}
        onSwipeComplete={onClose}
        onBackdropPress={onClose}
        swipeDirection={['down']}
        style={{ justifyContent: 'flex-end', margin: 0 }}>
        <View style={[Theme.styles.col_center, styles.modalContent]}>
            <Text style={styles.modalTitle}>{title ? title : 'Update Photo'}</Text>
            <TouchableOpacity onPress={onCapture} style={[Theme.styles.row_center, { width: '100%', height: 50 }]}>
                <Svg_camera />
                <Text style={styles.modalBtnTxt}>Take a picture</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity onPress={onImageUpload} style={[Theme.styles.row_center, { width: '100%', height: 50 }]}>
                <Svg_image />
                <Text style={styles.modalBtnTxt}>From Photo Gallery</Text>
            </TouchableOpacity>
        </View>
    </Modal>
};

const styles = StyleSheet.create({
    modalContent: { width: '100%', paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20, backgroundColor: Theme.colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    modalTitle: { width: '100%', textAlign: 'center', fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text, marginBottom: 12 },
    modalBtnTxt: { flex: 1, marginLeft: 8, fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
    divider: { width: '100%', height: 1, backgroundColor: Theme.colors.gray9 },
})
export default ImgPickOptionModal;

