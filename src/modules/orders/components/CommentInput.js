import { TextInput, View, Text, StyleSheet } from 'react-native';
import Theme from '../../../theme';
import React, { useState } from 'react';
import { translate } from '../../../common/services/translate'

const MIN_COMMENT_HEIGHT = 80

const CommentInput = ({ placeholder, comments, onChangeText }) => {
    const [comment_height, setCommentHeight] = useState(MIN_COMMENT_HEIGHT)

    return <View style={[Theme.styles.col_center_start, styles.commentView]}>
        <TextInput
            multiline={true}
            value={comments}
            placeholder={placeholder ? placeholder : translate('cart.add_comment')}
            placeholderTextColor={Theme.colors.gray5}
            onChangeText={onChangeText ? onChangeText : (text) => { }}
            onContentSizeChange={(event) => {
                setCommentHeight(event.nativeEvent.contentSize.height)
            }}
            autoCapitalize={'none'}
            autoCorrect={false}
            style={[styles.commentInput, { height: Math.max(MIN_COMMENT_HEIGHT, comment_height) }]}
        />
    </View>
};

const styles = StyleSheet.create({
    commentView: { width: '100%', alignItems: 'flex-start', },
    commentInput: {
        maxHeight: '90%', width: '100%', borderRadius: 12, borderWidth: 1, borderColor: Theme.colors.gray6,
        textAlignVertical: 'top', padding: 15, paddingTop: 15, fontSize: 13, fontFamily: Theme.fonts.medium, color: Theme.colors.text,
    },
})
export default CommentInput;
