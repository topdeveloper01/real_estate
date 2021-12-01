import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FastImage from 'react-native-fast-image';
import { width, height } from 'react-native-dimension';
import Gallery from 'react-native-image-gallery';
import Theme from "../../../theme";

const ImgGalleryModal = ({ showModal, images, index, onClose }) => {
    const [visible, SetVisible] = useState(showModal)
    useEffect(() => {
        SetVisible(showModal)
    }, [showModal])

    console.log('ImgGalleryModal')

    return <Modal
        isVisible={visible}
        backdropOpacity={0.33}
        onSwipeComplete={() => onClose()}
        onBackdropPress={() => onClose()}
        style={{ margin: 0 }}
    >
        <View style={[Theme.styles.col_center, styles.modalContent]}>
            <Gallery
                style={styles.gallery}
                imageComponent={(image, dim) =>
                    <FastImage source={image.source} style={[styles.img]} resizeMode={FastImage.resizeMode.contain} />
                }
                images={images}
                initialPage={index}
                onPageSelected={(id) => {
                }}
            />
            <TouchableOpacity onPress={() => onClose()} style={styles.closeBtn}>
                <AntDesign name="close" size={16} color={'#FFFFFF'} />
            </TouchableOpacity>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    modalContent: { width: '100%', height: '100%', backgroundColor: Theme.colors.black, }, 
    closeBtn: { position: 'absolute', top: 40, left: 20, marginRight: 20, width: 30, height: 30, borderRadius: 6, backgroundColor: '#AAA8BF', alignItems: 'center', justifyContent: 'center'}, 
    img: { width: '100%', height: '100%' },
    gallery: { width: '100%', height: '100%', },
});

function arePropsEqual(prevProps, nextProps) {
    if (prevProps.showModal != nextProps.showModal) {
        console.log('ImgGalleryModal item equal 1: ', false)
        return false;
    }
    if (prevProps.images.length != nextProps.images.length || nextProps.images.filter((x) => prevProps.images.indexOf(x) === -1).length > 0) {
        console.log('ImgGalleryModal item equal 2: ', false)
        return false;
    } 
    return true;
}

export default React.memo(ImgGalleryModal, arePropsEqual);