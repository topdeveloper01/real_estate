import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import AppText from '../AppText';
import Theme from '../../../theme';
import FilterModal from '../modals/FilterModal';
import Svg_divider from '../../assets/svgs/cat-divider.svg';
import AreaFilterModal from '../modals/AreaFilterModal';
import { FOR_RESIDENTIAL, FOR_OFFICE, FOR_SHOP, FOR_INDUSTRIAL } from '../../../config/constants';

const FilterBar = ({ isSell, onChangeArea, onChangeType, onChangePrice, onChangeSize, onChangeRooms, onChangeOuter }) => {

    const [isAreaFilterModal, setAreaFilterModal] = useState(false)
    const [filter_area, setFilterArea] = useState({
        city1 : null,
        city2 : null,
        city3 : null
    })

    const [isTypeFilterModal, setTypeFilterModal] = useState(false)
    const [filter_type, setFilterType] = useState(0)
    const filterTypes = [
        { label: '任何 Any', value: -1 }, 
        { label: '住宅 Residential', value: FOR_RESIDENTIAL },
		{ label: '寫字樓 Office building', value: FOR_OFFICE },
		{ label: '商鋪 Shop', value: FOR_SHOP },
		{ label: '工業大廈 Industrial building', value: FOR_INDUSTRIAL },
    ]

    const [isPriceFilterModal, setPriceFilterModal] = useState(false)
    const [filter_price, setFilterPrice] = useState(0)
    const filterPrices = [
        { label: '任何 Any', value: -1 },
        { label: '$3,999,999 以下 Below', value: 0 },
        { label: '$4,000,000 – $9,999,999', value: 1 },
        { label: '$10,000,000 – $49,999,999', value: 2 },
        { label: '$50,000,000 以上 Above ', value: 3 }
    ]

    const filterRentPrices = [
        { label: '任何 Any', value: -1 },
        { label: '$9,999 以下 below', value: 0 },
        { label: '$10,000 – $44,999', value: 1 },
        { label: '$45,000 – $99,999', value: 2 },
        { label: '$100,000 以上 above ', value: 3 }
    ]
  
    const [isSizeFilterModal, setSizeFilterModal] = useState(false)
    const [filter_size, setFilterSize] = useState(0)
    const filterSizes = [
        { label: '任何 Any', value: -1 },
        { label: '299尺以下 Below  ', value: 0 },
        { label: '300尺 - 799尺', value: 1 },
        { label: '800尺 – 1,499尺', value: 2 },
        { label: '1,500尺以上 Above', value: 3 }
    ]

    const [isRoomsFilterModal, setRoomsFilterModal] = useState(false)
    const [filter_rooms, setFilterRooms] = useState(0)
    const filterRooms = [
        { label: '任何 Any', value: -1 },
        { label: '開放式 Open Type', value: 0 },
        { label: '1房 Room', value: 1 },
        { label: '2房 Room', value: 2 },
        { label: '3房或以上 Or Above ', value: 3 }
    ]

    const [isOuterFilterModal, setOuterFilterModal] = useState(false)
    const [filter_outer, setFilterOuter] = useState(0)
    const filterOuters = [
        { label: '任何 Any', value: -1 },
        { label: '天台 Rooftop', value: 0 },
        { label: '露台 Terrace', value: 1 }, 
    ]

    const filterAreaDesc=()=>{
        if(filter_area.city1 == null && filter_area.city2 == null && filter_area.city3 == null) {
            return '任何 Any';
        }
        let desc = filter_area.city1;
        if (filter_area.city2 != null ) {
            desc = desc + ', ' + filter_area.city2;
        }
        if (filter_area.city3 != null ) {
            desc = desc + ', ' + filter_area.city3;
        }
        return desc;
    }

    return <View style={[Theme.styles.col_center, styles.filterview]}>
        <ScrollView
            horizontal={true}
            style={{ width: '100%', paddingBottom: 12 }}
        >
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={() => { setAreaFilterModal(true) }}>
                    <AppText style={styles.filterLabel}>地區</AppText>
                    <AppText style={styles.filterSubLabel}>AREA</AppText>
                    <AppText style={styles.filterValue}>
                        {filterAreaDesc()}
                    </AppText>
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 24 }}>
                    <Svg_divider />
                </View>
            </View>
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={() => { setTypeFilterModal(true) }}>
                    <AppText style={styles.filterLabel}>形式</AppText>
                    <AppText style={styles.filterSubLabel}>TYPE</AppText>
                    <AppText style={styles.filterValue}>{filterTypes[filter_type].label}</AppText>
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 24 }}>
                    <Svg_divider />
                </View>
            </View>
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={() => { setPriceFilterModal(true) }}>
                    <AppText style={styles.filterLabel}>價格</AppText>
                    <AppText style={styles.filterSubLabel}>PRICE</AppText>
                    <AppText style={styles.filterValue}>
                        { isSell == true ? 
                            filterPrices[filter_price].label : 
                            filterRentPrices[filter_price].label
                        }
                    </AppText>
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 24 }}>
                    <Svg_divider />
                </View>
            </View>
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={() => { setSizeFilterModal(true) }}>
                    <AppText style={styles.filterLabel}>面積</AppText>
                    <AppText style={styles.filterSubLabel}>SIZE</AppText>
                    <AppText style={styles.filterValue}>{filterSizes[filter_size].label}</AppText>
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 24 }}>
                    <Svg_divider />
                </View>
            </View>
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={() => { setRoomsFilterModal(true) }}>
                    <AppText style={styles.filterLabel}>房數</AppText>
                    <AppText style={styles.filterSubLabel}>ROOM</AppText>
                    <AppText style={styles.filterValue}>{filterRooms[filter_rooms].label}</AppText>
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 24 }}>
                    <Svg_divider />
                </View>
            </View>
            <View style={[Theme.styles.row_center]}>
                <TouchableOpacity style={[Theme.styles.col_center]} onPress={() => { setOuterFilterModal(true) }}>
                    <AppText style={styles.filterLabel}>外面</AppText>
                    <AppText style={styles.filterSubLabel}>OUTER</AppText>
                    <AppText style={styles.filterValue}>{filterOuters[filter_outer].label}</AppText>
                </TouchableOpacity>
            </View>
        </ScrollView>
        <View style={styles.scrollviewHider} />
        <AreaFilterModal
            showModal={isAreaFilterModal}
            title='地區 Area'
            _city1={filter_area.city1}
            _city2={filter_area.city2}
            _city3={filter_area.city3}
            onSave={(value) => {
                setAreaFilterModal(false);
                setFilterArea(value);
                onChangeArea(value);
            }}
            onClose={() => {
                setAreaFilterModal(false)
            }}
        />
        <FilterModal
            showModal={isTypeFilterModal}
            title='形式 Type'
            items={filterTypes}
            value={filter_type}
            onSave={(value) => {
                setTypeFilterModal(false);
                setFilterType(value + 1);
                onChangeType(value);
            }}
            onClose={() => {
                setTypeFilterModal(false)
            }}
        />
        <FilterModal
            showModal={isPriceFilterModal}
            title='價格 Price'
            items={isSell == true ? filterPrices : filterRentPrices}
            value={filter_price}
            onSave={(value) => {
                setPriceFilterModal(false);
                setFilterPrice(value + 1);
                onChangePrice(value);
            }}
            onClose={() => {
                setPriceFilterModal(false)
            }}
        />
        <FilterModal
            showModal={isSizeFilterModal}
            title='實用面積 Size'
            items={filterSizes}
            value={filter_size}
            onSave={(value) => {
                setSizeFilterModal(false);
                setFilterSize(value + 1);
                onChangeSize(value);
            }}
            onClose={() => {
                setSizeFilterModal(false)
            }}
        />
        <FilterModal
            showModal={isRoomsFilterModal}
            title='房數 Room'
            items={filterRooms}
            value={filter_rooms}
            onSave={(value) => {
                setRoomsFilterModal(false);
                setFilterRooms(value + 1);
                onChangeRooms(value);
            }}
            onClose={() => {
                setRoomsFilterModal(false)
            }}
        />
        <FilterModal
            showModal={isOuterFilterModal}
            title='外面 Outer'
            items={filterOuters}
            value={filter_outer}
            onSave={(value) => {
                setOuterFilterModal(false);
                setFilterOuter(value + 1);
                onChangeOuter(value);
            }}
            onClose={() => {
                setOuterFilterModal(false)
            }}
        />
    </View>
};
 

const styles = StyleSheet.create({
    filterview: { marginTop: 16, marginBottom: 16, borderBottomColor: Theme.colors.gray4, borderBottomWidth: 1 },
    filterLabel: { fontSize: 14, fontFamily: Theme.fonts.medium, color: '#344655' },
    filterSubLabel: { fontSize: 11, fontFamily: Theme.fonts.medium, color: '#344655' },
    filterValue: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: '#344655', marginTop: 4 },
    scrollviewHider: { width: '100%', marginTop: -12, height: 15, backgroundColor: Theme.colors.white },
})

export default FilterBar;