import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, View, Text, StyleSheet, Image } from 'react-native'; 
import AppText from '../AppText'; 
import Theme from '../../../theme'; 
import FilterModal from '../modals/FilterModal';
import Svg_divider from '../../assets/svgs/cat-divider.svg';

const FilterBar = ({ onChangeArea, onChangeType, onChangePrice, onChangeSize, onChangeRooms }) => {

    const [isTypeFilterModal, setTypeFilterModal] = useState(false)
    const [filter_type, setFilterType] = useState(0)
    const filterTypes = [
        { label: '任何', value: -1 },
        { label: '買樓', value: 0 },
        { label: '租樓', value: 1 }
    ]

    const [isPriceFilterModal, setPriceFilterModal] = useState(false)
    const [filter_price, setFilterPrice] = useState(0)
    const filterPrices = [
        { label: '任何', value: -1 },
        { label: '$3,999,999 以下', value: 0 },
        { label: '$4,000,000 – $9,999,999', value: 1 },
        { label: '$10,000,000 – $49,999,999', value: 2 },
        { label: '$50,000,000 以上', value: 3 }
    ]

    const [isSizeFilterModal, setSizeFilterModal] = useState(false)
    const [filter_size, setFilterSize] = useState(0)
    const filterSizes = [
        { label: '任何', value: -1 },
        { label: '299尺以下', value: 0 },
        { label: '300尺 - 799尺', value: 1 },
        { label: '800尺 – 1,499尺', value: 2 },
        { label: '1,500尺以上 ', value: 3 }
    ]

    const [isRoomsFilterModal, setRoomsFilterModal] = useState(false)
    const [filter_rooms, setFilterRooms] = useState(0)
    const filterRooms = [
        { label: '任何', value: -1 },
        { label: '開放式單位', value: 0 },
        { label: '1房', value: 1 },
        { label: '2房', value: 2 },
        { label: '3房', value: 3 },
        { label: '4房', value: 4 },
        { label: '5房以上', value: 5 }
    ]

    return <View style={[Theme.styles.col_center, styles.filterview]}>
        <ScrollView
            horizontal={true}
            style={{ width: '100%', paddingBottom: 12 }}
        >
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={()=>{ }}>
                    <AppText style={styles.filterLabel}>地區</AppText>
                    <AppText style={styles.filterValue}>任何</AppText>
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 24 }}>
                    <Svg_divider />
                </View>
            </View>
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={()=>{setTypeFilterModal(true)}}>
                    <AppText style={styles.filterLabel}>形式</AppText>
                    <AppText style={styles.filterValue}>{filterTypes[filter_type].label}</AppText>
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 24 }}>
                    <Svg_divider />
                </View>
            </View>
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={()=>{setPriceFilterModal(true)}}>
                    <AppText style={styles.filterLabel}>價格</AppText>
                    <AppText style={styles.filterValue}>{filterPrices[filter_price].label}</AppText>
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 24 }}>
                    <Svg_divider />
                </View>
            </View>
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={()=>{setSizeFilterModal(true)}}>
                    <AppText style={styles.filterLabel}>實用面積</AppText>
                    <AppText style={styles.filterValue}>{filterSizes[filter_size].label}</AppText>
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 24 }}>
                    <Svg_divider />
                </View>
            </View>
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={()=>{setRoomsFilterModal(true)}}>
                    <AppText style={styles.filterLabel}>房數</AppText>
                    <AppText style={styles.filterValue}>{filterRooms[filter_rooms].label}</AppText>
                </TouchableOpacity> 
            </View>
        </ScrollView>
        <View style={styles.scrollviewHider} />
        <FilterModal
            showModal={isTypeFilterModal}
            title='形式'
            items={filterTypes}
            value={filter_type}
            onSave={(value) => {
                setTypeFilterModal(false);
                setFilterType(value + 1);
                onChangeType(value);
            }}
            onClose={()=>{
                setTypeFilterModal(false)
            }}
        />
        <FilterModal
            showModal={isPriceFilterModal}
            title='價格'
            items={filterPrices}
            value={filter_price}
            onSave={(value) => {
                setPriceFilterModal(false);
                setFilterPrice(value + 1);
                onChangePrice(value);
            }}
            onClose={()=>{
                setPriceFilterModal(false)
            }}
        />
        <FilterModal
            showModal={isSizeFilterModal}
            title='實用面積'
            items={filterSizes}
            value={filter_size}
            onSave={(value) => {
                setSizeFilterModal(false);
                setFilterSize(value + 1);
                onChangeSize(value);
            }}
            onClose={()=>{
                setSizeFilterModal(false)
            }}
        />
        <FilterModal
            showModal={isRoomsFilterModal}
            title='房數'
            items={filterRooms}
            value={filter_rooms}
            onSave={(value) => {
                setRoomsFilterModal(false);
                setFilterRooms(value + 1);
                onChangeRooms(value);
            }}
            onClose={()=>{
                setRoomsFilterModal(false)
            }}
        />
    </View>
};

const styles = StyleSheet.create({
    filterview: { marginTop: 16, marginBottom: 16, borderBottomColor: Theme.colors.gray4, borderBottomWidth: 1 },
    filterLabel: { fontSize: 14, fontFamily: Theme.fonts.medium, color: '#344655' },
    filterValue: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: '#344655', marginTop: 4 },
    scrollviewHider: { width: '100%', marginTop: -12, height: 15, backgroundColor: Theme.colors.white },
})

export default FilterBar;
