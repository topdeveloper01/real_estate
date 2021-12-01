import FireStore, { FieldValue } from '../../common/services/firebase';
import { getStorageKey, KEYS } from '../../common/services/storage';
import { APP } from '../types';
import { SNAP_FOOD_SUPPORT } from '../../config/constants';
import store from '../../store';

var channel_collection = FireStore.collection('channels')

export const createSingleChannel = (partner) => async dispatch => {
    try {
        let state = store.getState();
        state = state.app || {};
        const { user } = state;

        let channelId = channel_collection.doc().id;
        await channel_collection.doc(channelId).set({
            id: channelId,
            active: true,
            channel_type : 'single',
            creator: {
               id : user.id,
               full_name: user.full_name,
               photo : user.photo,
               phone : user.phone,
               email : user.email
            },
            partner: {
                id : partner.id,
                full_name: partner.full_name,
                photo : partner.photo,
                phone : partner.phone,
                email : partner.email
            },
            users: [user.id , partner.id], 
            last_msg: {
                msg: '',
                msg_type : 10,
                time: FieldValue.serverTimestamp()
            },
            unread_cnt : { 
            }
        });
        dispatch({
            type: APP.INIT_CHANNEL_SUCCESS,
            payload: channelId,
        });
        // startListeningToChat(dispatch);
    } catch (e) {
        console.log(e);
    }
};
 
export const setAllChannels=(payload)=>{
    return {type : APP.SET_CHANNELS, payload : payload}
}

export const sendMessage = (message) => async dispatch => {
    let state = store.getState();
    state = state.chat || {};
    const { channelId } = state;

    try {
        await channel_collection
            .doc(channelId)
            .collection('messages')
            .add({
                ...message,
                seen: false,
            });
        dispatch({ type: APP.NEW_MESSAGE_ARRIVED, data: message });
    } catch (err) {
        console.log(err);
    }
};

const generateRandom = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

function startListeningToChat(dispatch) {
    let state = store.getState();
    state = state.chat || {};
    const { conversationId } = state;

    const conversation = FireStore.collection('conversations')
        .doc(conversationId).collection('messages')
        .limit(100)
        .orderBy('createdAt', 'desc');

    try {
        conversation.onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().reverse().forEach(change => {
                const data = change.doc.data();
                let message = { ...data, createdAt: new Date(data.createdAt.seconds * 1000) };
                if (change.type === 'added') {
                    dispatch({ type: APP.NEW_MESSAGE_ARRIVED, data: message });
                }
                if (change.type === 'modified') {
                    dispatch({ type: APP.MESSAGE_IS_MODIFIED, data: message });
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
}

export const initiateChatRoom = () => async dispatch => {
    try {
        let state = store.getState();
        state = state.app || {};
        const { user } = state;
        let room = FireStore.collection('rooms').where('users', 'array-contains', user.id.toString());
        let conversationId;
        let querySnapshot = await room.get();

        if (querySnapshot.empty) {
            conversationId = generateRandom();
            await FireStore.collection('rooms').add({
                users: [user.id.toString(), SNAP_FOOD_SUPPORT],
                conversationId,
            });
        } else {
            let firstRoom;
            querySnapshot.forEach(function (doc) {
                firstRoom = doc.data();
            });
            conversationId = firstRoom.conversationId;
        }
        await FireStore.collection('users').doc(user.id.toString()).set(user);
        dispatch({
            type: APP.INIT_CHAT_ROOM_SUCCESS,
            payload: { conversationId, user },
        });
        startListeningToChat(dispatch);
    } catch (e) {
        console.log(e);
    }
};

export const setMessagesSeen = () => async dispatch => {
    try {
        let state = store.getState();
        state = state.chat || {};
        const { messages, conversationId, user } = state;
        const { id } = user;
        const unseenMessages = messages.filter(message => (!message.seen && message.user._id !== id));
        unseenMessages.forEach(message => {
            let databaseObject = FireStore.collection('conversations')
                .doc(conversationId)
                .collection('messages')
                .where('_id', '==', message._id);
            databaseObject.get().then(function (querySnapshot) {
                querySnapshot.forEach(doc => {
                    FireStore.collection('conversations')
                        .doc(conversationId)
                        .collection('messages')
                        .doc(doc.id)
                        .update({ seen: true })
                        .catch(err => console.log(err));
                });
            });
        });
    } catch (e) {
        console.log(e);
    }
};


