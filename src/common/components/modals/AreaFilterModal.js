import React, { useEffect, useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import Theme from "../../../theme";
import RadioBtn from '../../components/buttons/radiobtn';
import { MainBtn } from '../../../common/components';

const AreaFilterModal = (props) => {
    const { showModal, _city1, _city2, _city3, title, onSave, onClose } = props;

    const [visible, SetVisible] = useState(showModal)

    const [value1, setValue1] = useState(_city1);
    const [value2, setValue2] = useState(_city2);
    const [value3, setValue3] = useState(_city3);

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    const onOpen1 = useCallback(() => {
        setOpen2(false);
        setOpen3(false);
    }, []);
    const onOpen2 = useCallback(() => {
        setOpen1(false);
        setOpen3(false);
    }, []);
    const onOpen3 = useCallback(() => {
        setOpen1(false);
        setOpen2(false);
    }, []);

    const [cities1, setCities1] = useState([]);
    const [cities2, setCities2] = useState([]);
    const [cities3, setCities3] = useState([]);

    const [city1, setCity1] = useState(_city1);
    const [city2, setCity2] = useState(_city2);
    const [city3, setCity3] = useState(_city3);

    useEffect(() => {
        SetVisible(showModal)
    }, [showModal])

    useEffect(() => {
        let tmp = [{ label: '任何', value: null }];
        props.city1_list.map(item => {
            tmp.push({ label: item.name, value: item.name },)
        })
        setCities1(tmp);

        if (tmp.length > 0) {
            setValue1(tmp[0].value)
            onChangeCity1(tmp[0].value)
        }
        else {
            setCities2([])
            setCities3([])
            setValue1(null)
            setValue2(null)
            setValue3(null)
        }

    }, [props.city1_list, props.city2_list, props.city3_list])

    useEffect(() => {
        onChangeCity1(city1)
    }, [city1])

    useEffect(() => {
        onChangeCity2(city2)
    }, [city2])


    const onChangeCity1 = (_city_1) => {
        let index = props.city1_list.findIndex(item => item.name == _city_1)
        if (index != -1) {
            let tmp = [{ label: '任何', value: null }];
            props.city2_list.filter(item => item.city_1 == props.city1_list[index].id).map(item => {
                tmp.push({ label: item.name, value: item.name })
            })
            setCities2(tmp)
            if (tmp.length > 0) {
                setValue2(tmp[0].value)
                onChangeCity2(tmp[0].value)
            }
            else {
                setCities3([])
                setValue2(null)
                setValue3(null)
            }
        }
        else {
            setCities2([])
            setCities3([])
            setValue1(null)
            setValue2(null)
            setValue3(null)
        }
    }

    const onChangeCity2 = (_city_2) => {
        let index = props.city2_list.findIndex(item => item.name == _city_2)
        if (index != -1) {
            let tmp = [{ label: '任何', value: null }];
            props.city3_list.filter(item => item.city_2 == props.city2_list[index].id).map(item => {
                tmp.push({ label: item.name, value: item.name })
            })
            setCities3(tmp)
            if (tmp.length > 0) {
                setValue3(tmp[0].value)
            }
            else {
                setValue3(null)
            }
        }
        else {
            setCities3([])
            setValue2(null)
            setValue3(null)
        }
    }

    return <Modal
        isVisible={visible}
        backdropOpacity={0.33}
        onSwipeComplete={() => onClose()}
        onBackdropPress={() => onClose()}  >
        <View style={[Theme.styles.col_center, styles.modalContent]}>
            <Text style={styles.modalTitle}>{title}</Text>
            {
                Platform.OS == 'android' ?
                    <React.Fragment>
                        <Text style={styles.subjectTitle}>地區 </Text>
                        <DropDownPicker
                            open={open1}
                            setOpen={setOpen1}
                            onOpen={onOpen1}
                            value={value1}
                            setValue={setValue1}
                            placeholder={'任何'}
                            items={cities1}
                            setItems={setCities1}
                            onChangeValue={(value) => {
                                setCity1(value)
                            }}
                            style={{
                                borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 97
                            }}
                            onPress={() => {
                            }}
                            dropDownDirection="BOTTOM"
                            ListEmptyComponent={() => <View />}
                        />
                        <Text style={styles.subjectTitle}>街道</Text>
                        <DropDownPicker
                            open={open2}
                            setOpen={setOpen2}
                            onOpen={onOpen2}
                            value={value2}
                            setValue={setValue2}
                            placeholder={'任何'}
                            items={cities2}
                            setItems={setCities2}
                            onChangeValue={(value) => {
                                setCity2(value)
                            }}
                            style={{
                                borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 99
                            }}
                            onPress={() => {
                            }}
                            dropDownDirection="BOTTOM"
                            ListEmptyComponent={() => <View />}
                        />
                        <Text style={styles.subjectTitle}>大廈 / 屋苑 </Text>
                        <DropDownPicker
                            open={open3}
                            setOpen={setOpen3}
                            onOpen={onOpen3}
                            value={value3}
                            setValue={setValue3}
                            placeholder={'任何'}
                            items={cities3}
                            setItems={setCities3}
                            onChangeValue={(value) => {
                                setCity3(value)
                            }}
                            style={{
                                borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 98
                            }}
                            onPress={() => {
                            }}
                            dropDownDirection="BOTTOM"
                            ListEmptyComponent={() => <View />}
                        />
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <View style={{ zIndex: 99 }}>
                            <Text style={styles.subjectTitle}>地區 </Text>
                            <DropDownPicker
                                open={open1}
                                setOpen={setOpen1}
                                onOpen={onOpen1}
                                value={value1}
                                setValue={setValue1}
                                placeholder={'任何'}
                                items={cities1}
                                setItems={setCities1}
                                onChangeValue={(value) => {
                                    setCity1(value)
                                }}
                                style={{
                                    borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 97
                                }}
                                onPress={() => {
                                }}
                                dropDownDirection="BOTTOM"
                                ListEmptyComponent={() => <View />}
                            />
                        </View>
                        <View style={{ zIndex: 98 }}>
                            <Text style={styles.subjectTitle}>街道</Text>
                            <DropDownPicker
                                open={open2}
                                setOpen={setOpen2}
                                onOpen={onOpen2}
                                value={value2}
                                setValue={setValue2}
                                placeholder={'任何'}
                                items={cities2}
                                setItems={setCities2}
                                onChangeValue={(value) => {
                                    setCity2(value)
                                }}
                                style={{
                                    borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 99
                                }}
                                onPress={() => {
                                }}
                                dropDownDirection="BOTTOM"
                                ListEmptyComponent={() => <View />}
                            />
                        </View>
                        <View style={{ zIndex: 97 }}>
                            <Text style={styles.subjectTitle}>大廈 / 屋苑 </Text>
                            <DropDownPicker
                                open={open3}
                                setOpen={setOpen3}
                                onOpen={onOpen3}
                                value={value3}
                                setValue={setValue3}
                                placeholder={'任何'}
                                items={cities3}
                                setItems={setCities3}
                                onChangeValue={(value) => {
                                    setCity3(value)
                                }}
                                style={{
                                    borderColor: Theme.colors.gray3, marginBottom: 12, zIndex: 98
                                }}
                                onPress={() => {
                                }}
                                dropDownDirection="BOTTOM"
                                ListEmptyComponent={() => <View />}
                            />
                        </View>
                    </React.Fragment>
            }

            <MainBtn
                title={'確認'}
                onPress={() => {
                    onSave({ city1, city2, city3 });
                }}
                style={{ marginTop: 20, width: '100%' }}
            />
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    modalContent: { width: '100%', paddingHorizontal: 20, paddingBottom: 30, paddingTop: 30, backgroundColor: Theme.colors.white, borderRadius: 15, },
    modalTitle: { fontSize: 16, fontFamily: Theme.fonts.bold, color: Theme.colors.text, marginBottom: 12 },
    subjectTitle: { width: '100%', textAlign: 'left', marginBottom: 8, fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text, },
});



const mapStateToProps = ({ app }) => ({
    user: app.user || {},
    city1_list: app.city1_list,
    city2_list: app.city2_list,
    city3_list: app.city3_list,
});

export default connect(mapStateToProps, {})(AreaFilterModal);