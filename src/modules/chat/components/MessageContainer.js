import React from 'react';
import { View, Text, Clipboard } from 'react-native';
import { Avatar, Bubble, utils, SystemMessage, Message, MessageText } from 'react-native-gifted-chat';
import Theme from '../../../theme';
import MessageBubble from './MessageBubble';
 
export const renderMessage = (props) => (
  <Message
    {...props}
    containerStyle={{
      left: { backgroundColor: '#fff' },
      right: { backgroundColor: '#fff' },
    }}
    textStyle={{fontSize : 13}}
  />
);

export const renderBubble = (props, isGroup, onLongPress, onPressMsg , onShowGalleryMsgs) => { 
 
  return <MessageBubble
    {...props}
    isGroup={isGroup}
    // renderTime={() => <Text>Time</Text>}
    // renderTicks={() => <Text>Ticks</Text>} 
    containerStyle={{
      left: { paddingLeft: 12, marginTop: 8, },
      right: { paddingRight: 12, marginTop: 8, },
    }}
    bottomContainerStyle={{
      left: { display: 'none' },
      right: { display: 'none' },
    }}
    tickStyle={{}}
    // usernameStyle={{ color: 'tomato', fontWeight: '100' }}
    containerToNextStyle={{
      left: {},
      right: {},
    }}
    containerToPreviousStyle={{
      left: {},
      right: {},
    }}
    onPressMsg={onPressMsg}
    onLongPress={onLongPress} 
    onShowGalleryMsgs={onShowGalleryMsgs}
  /> 
};

export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: 'transparent' }}
    wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
    textStyle={{ color: Theme.colors.gray4, fontFamily: Theme.fonts.medium, }}
  />
);

export const renderCustomView = (props) => {
  return <View></View>
}