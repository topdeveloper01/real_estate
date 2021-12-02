import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Theme from '../../theme';

const AppDropDownPicker = ({ placeholder, items, setItems, style, onChangeValue}) => {
     
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null); 
 
    return (
        <DropDownPicker
            open={open}
            placeholder={placeholder}
            placeholderStyle={{
                color: Theme.colors.gray3,
            }}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            onChangeValue={onChangeValue}
            setItems={setItems}
            style={[styles.container, style]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        borderColor: Theme.colors.gray3, marginBottom: 12 
    },
});
 

export default AppDropDownPicker;
