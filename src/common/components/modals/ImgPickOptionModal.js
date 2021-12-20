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
            <View style={[Theme.styles.col_center, styles.titleView]}>
                <Text style={styles.modalTitle}>{title ? title : '選擇方式 Options'}</Text>
            </View>
            <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                <TouchableOpacity onPress={onCapture} style={[Theme.styles.row_center, { width: '100%', height: 50 }]}>
                    <Svg_camera />
                    <Text style={styles.modalBtnTxt}>影相機 Camera</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity onPress={onImageUpload} style={[Theme.styles.row_center, { width: '100%', height: 50 }]}>
                    <Svg_image />
                    <Text style={styles.modalBtnTxt}>從相簿上傳 Upload from album</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
};

const styles = StyleSheet.create({
    titleView: { height: 50, width: '100%', backgroundColor: Theme.colors.white, elevation: 4 },
    modalContent: { width: '100%', paddingBottom: 30, backgroundColor: Theme.colors.white, },
    modalTitle: { width: '100%', textAlign: 'center', fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text, },
    modalBtnTxt: { flex: 1, marginLeft: 8, fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
    divider: { width: '100%', height: 1, backgroundColor: Theme.colors.gray9 },
})
export default ImgPickOptionModal;

