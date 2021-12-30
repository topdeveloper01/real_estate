import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import Theme from "../../../theme";

const LoadingModal = ({ showModal, title }) => {
    const [visible, SetVisible] = useState(showModal)
    useEffect(() => {
        SetVisible(showModal)
    }, [showModal])

    return <Modal
        isVisible={visible}
        backdropOpacity={0.33}
          >
        <View style={[Theme.styles.col_center, styles.modalContent]}>
            <ActivityIndicator size="small" color="#FF7675" />
            <Text style={styles.modalTitle}>{title}</Text>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    modalContent: { width: '100%', paddingHorizontal: 20, paddingBottom: 30, paddingTop: 30, backgroundColor: Theme.colors.white, borderRadius: 15, },
    modalTitle: { marginTop: 20, fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.gray3, },
});

export default LoadingModal;
