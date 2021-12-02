import { FieldValue, channelCollection } from './firebase';
import apiFactory from '../../common/services/apiFactory';
import { translate } from './translate';
  
export const createSingleChannel = async (user, partner) => {

    try {
        let channelId = channelCollection.doc().id;
        await channelCollection.doc(channelId).set({
            id: channelId,
            active: true,
            channel_type: 'single',
            creator: {
                id: user.id,
                full_name: user.full_name,
                photo: user.photo || '',
                phone: user.phone,
                email: user.email
            },
            partner: {
                id: partner.id,
                full_name: partner.full_name,
                photo: partner.photo || '',
                phone: partner.phone,
                email: partner.email
            },
            users: [user.id, partner.id],
            last_msg: {
                createdAt: FieldValue.serverTimestamp()
            },
            unread_cnt: {
            }
        });

        return channelId;
    }
    catch (error) {
        console.log('createSingleChannel ', error)
        return null
    }
};


export const createGroupChannel = async (group_data) => {

    try {
        let channelId = channelCollection.doc().id;
        await channelCollection.doc(channelId).set({
            id: channelId,
            active: true,
            channel_type: 'group',
            ...group_data,
            last_msg: {
                createdAt: FieldValue.serverTimestamp()
            },
            unread_cnt: {
            }
        });

        return channelId;
    }
    catch (error) {
        console.log('create group channel', error)
        return null
    }
};

export const getChannelData = async (channelId) => {
    try {
        let channel_ref = await channelCollection.doc(channelId).get();
        return channel_ref.data()
    }
    catch (error) {
        return null
    }
}

export const findChannel = async (user_id, partner_id) => {
    try {
        let channel_ref = await channelCollection.where('channel_type', '==', 'single')
            .where('users', 'in', [[user_id, partner_id], [partner_id, user_id]])
            .get();
        let found_channel = null
        channel_ref.docs.forEach(doc => {
            if (doc.data() != null) {
                found_channel = doc.data()
            }
        })
        return found_channel
    }
    catch (error) {
        console.log('findChannel', error)
        return null
    }
}

export const seenUnreadCntChannel = async (channelData, user_id) => {
    try {
        if (channelData != null) {
            let users_in_channel = channelData.users || [];
            let cur_unread = channelData.unread_cnt || {};
            users_in_channel.map(item => {
                if (item == user_id) {
                    cur_unread[item] = 0;
                }
            })
            await channelCollection.doc(channelData.id).update('unread_cnt', cur_unread)
        }
    }
    catch (error) {
        return null
    }
}

const getMsgDescription = (msg) => {
    if (msg == null) { return ''; }
    if (msg.map != null) {
        return 'Shpërndau vendndodhjen';
    }
    else if (msg.emoji != null) {
        return 'Dërgoi një emoji';
    }
    else if (msg.images != null) {
        return 'Shpërndau një foto'
    }
    else if (msg.audio != null) {
        return 'Dërgoi një voice'
    }
    else if (msg.text != null) {
        return msg.text;
    }
    return ''
}

export const sendMessage = async (channelId, user_id, message) => {
    try { 
        if (message._id == null) {
            message._id = channelCollection.doc(channelId).collection('messages').doc().id;
        }
        let new_msg = {
            ...message,
            created_time: new Date().getTime(),
            createdAt: FieldValue.serverTimestamp()
        };
        await channelCollection
            .doc(channelId)
            .collection('messages').doc(message._id).set(new_msg);

        let channel_ref = await channelCollection.doc(channelId).get()
        if (channel_ref.data() != null) {
            let unread_cnt = {};
            let member_ids = [];
            let users_in_channel = channel_ref.data().users || [];
            let cur_unread = channel_ref.data().unread_cnt || {};
            users_in_channel.map(item => {
                if (item != user_id) {
                    if (cur_unread[item] != null) {
                        unread_cnt[item] = (cur_unread[item] || 0) + 1
                    }
                    else {
                        unread_cnt[item] = 1
                    }
                    member_ids.push(item);
                }
            })
            await channelCollection.doc(channelId).update('unread_cnt', unread_cnt, 'last_msg', new_msg);

            // // send notification
            // sendChatNotification(
            //     channelId,
            //     channel_ref.data().channel_type,
            //     channel_ref.data().channel_type == 'group' ? channel_ref.data().full_name : null,
            //     user_id,
            //     member_ids,
            //     getMsgDescription(new_msg)
            // );
        }

    } catch (err) {
        console.log(err);
    }
};

export const uploadImage = (base64Image) => {
    return apiFactory.post('chats/upload-image', {
        image: base64Image
    });
};

export const sendGroupChatInviteNotification = (conversation_id, group_name, member_ids) => {
    apiFactory.post('chats/send-groupchat-invite', {
        conversation_id: conversation_id,
        group_name: group_name,
        member_ids: member_ids
    })
        .then(res => { })
        .catch(err => { });
}

export const sendChatNotification = (conversation_id, channel_type, group_name, sender_id, member_ids, message) => {
    apiFactory.post('chats/send-chat-notification', {
        conversation_id: conversation_id,
        channel_type: channel_type,
        group_name: group_name,
        sender_id: sender_id,
        member_ids: member_ids,
        message: message
    })
        .then(res => { })
        .catch(err => { });
}

export const updateChannelUserInfo = async (user) => {
    try {
        let channel_creator_ref = await channelCollection.where('channel_type', '==', 'single')
            .where('creator.id', '==', user.id)
            .get();

        let channel_partner_ref = await channelCollection.where('channel_type', '==', 'single')
            .where('partner.id', '==', user.id)
            .get();


        var batch = FireStore.batch();
        channel_creator_ref.docs.forEach(doc => {
            if (doc.data() != null) {
                let new_creator = {
                    ...doc.data().creator,
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone,
                    photo: user.photo || ''
                };
                let channel_item_ref = channelCollection.doc(doc.data().id);
                batch.update(channel_item_ref, { "creator": new_creator });
            }
        })
        channel_partner_ref.docs.forEach(doc => {
            if (doc.data() != null) {
                let new_partner = {
                    ...doc.data().partner,
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone,
                    photo: user.photo || ''
                };
                let channel_item_ref = channelCollection.doc(doc.data().id);
                batch.update(channel_item_ref, { "partner": new_partner });
            }
        })

        await batch.commit()
    }
    catch (error) {
        console.log('findChannel', error)
        return null
    }
}

export const deleteGroupChannel = async (channelId) => {
    try {
        await channelCollection.doc(channelId).delete()
        return true
    }
    catch (error) {
        return false
    }
}

export const exitGroupChannel = async (channelData, user_id) => {
    try {
        let new_users = channelData.users.filter(i => i != user_id)
        let new_members = channelData.members.filter(i => i.id != user_id)

        if (channelData.admin != null && channelData.admin.id == user_id) {
            await channelCollection.doc(channelData.id).update(
                'admin', new_members[0],
                'members', new_members,
                'users', new_users
            )
        }
        else {
            await channelCollection.doc(channelData.id).update(
                'members', new_members,
                'users', new_users
            )
        }
        return true
    }
    catch (error) {
        return false
    }
}
