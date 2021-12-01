import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	PermissionsAndroid,
	SafeAreaView,
	Platform,
	Keyboard,
	Linking,
	ActivityIndicator,
} from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import { useSafeArea } from 'react-native-safe-area-context';
import { GiftedChat } from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import GetLocation from 'react-native-get-location'
import { connect } from 'react-redux';
import { convertTimestamp2Date } from '../../../common/services/utility';
import {
	channel_collection,
	getChannelData,
	sendMessage,
	uploadImage,
	seenUnreadCntChannel,
	deleteGroupChannel,
	exitGroupChannel,
} from '../../../common/services/chat';
import { goActiveScreenFromPush } from '../../../store/actions/app';
import { translate } from '../../../common/services/translate';
import Theme from '../../../theme';
import alerts from '../../../common/services/alerts';
import RouteNames from '../../../routes/names';
import EmojiBoard from '../../../common/components/react-native-emoji-board';
import ConfirmModal from '../../../common/components/modals/ConfirmModal';
import ImgGalleryModal from '../../../common/components/modals/ImgGalleryModal';
import LocationMsgOptionModal from '../../../common/components/modals/LocationMsgOptionModal';
import MessagesHeader from '../components/MessagesHeader';
import AudioInputView from '../components/AudioInputView';
import { renderInputToolbar, renderComposer, renderSend } from '../components/InputToolbar';
import { renderBubble, renderMessage } from '../components/MessageContainer';
import {
	checkLocationPermission,
	requestLocationPermission,
} from '../../../common/services/location';

const PerPage = 12;
const MessagesScreen = (props) => {

	const [imageUploading, setImageUploading] = useState(false);

	const [prevLoading, setPrevLoading] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	const [isMuted, SetMuteGroup] = useState(false);
	const [isLeftGroup, SetLeftGroup] = useState(false);
	const [isDeleteGroupModal, ShowDeleteGroupModal] = useState(false);
	const [isExitGroupModal, ShowExitGroupModal] = useState(false);
	const [showShareLocModal, ShowShareModal] = useState(false);
	const [showEmoji, setShowEMoji] = useState(false);

	const [channelData, setChannelData] = useState(null);

	const [text, setText] = useState('');
	const [isGalleryModal, ShowGalleryModal] = useState(false);
	const [messages, setMessages] = useState([]);
	const [quote_msg, setQuoteMsg] = useState(null);
	const [images, setImages] = useState(null);
	const [isRecording, setRecording] = useState(false);
	const [modal_imgs, setModalImages] = useState([]);

	const emojis = useRef(null);
	const textChanged = useRef(false);

	const isFromPush = props.route.params.fromPush ?? false;
	const pushChatMsgTime = props.route.params.pushChatMsgTime;
	const msgs_unlistener = useRef(null);
	const systemMsg = {
		_id: 1,
		text: '',
		createdAt: new Date(),
		system: true,
	}

	React.useEffect(() => {
		if (msgs_unlistener.current != null) {
			console.log('unsubscribe old messages listener');
			msgs_unlistener.current();
		}
		loadChannelData();
		const messages_coll = channel_collection
			.doc(props.route.params.channelId)
			.collection('messages')
			.limit(PerPage)
			.orderBy('created_time', 'desc');
		msgs_unlistener.current = messages_coll.onSnapshot((querySnapshot) => {
			let msgs = [];
			querySnapshot.docs.forEach((doc) => {
				if (doc.exists) {
					msgs.push({ ...doc.data(), createdAt: convertTimestamp2Date(doc.data().createdAt) });
				}
			});
			setMessages(msgs);
			if (msgs.length >= PerPage) {
				setHasMore(true);
			} else {
				setHasMore(false);
			}
		});

		return () => {
			console.log('messages screen unmount');
			if (msgs_unlistener.current != null) {
				msgs_unlistener.current();
			}
			props.goActiveScreenFromPush({
				isChatVisible: false,
			});
		};
	}, [props.route.params.channelId, isFromPush]);

	const loadChannelData = async () => {
		let channel = await getChannelData(props.route.params.channelId);
		setChannelData(channel);
		await seenUnreadCntChannel(channel, props.user.id);
	};

	const loadPrevMessage = () => {
		if (prevLoading || hasMore == false || messages.length == 0) {
			return;
		}
		let start = messages[messages.length - 1].created_time;
		if (start == null) {
			return;
		}
		console.log('loadPrevMessage');
		const messages_coll = channel_collection
			.doc(props.route.params.channelId)
			.collection('messages')
			.orderBy('created_time', 'desc')
			.limit(PerPage)
			.startAfter(start);

		setPrevLoading(true);
		messages_coll
			.get()
			.then((snaps) => {
				let msgs = [];
				snaps.docs.forEach((doc) => {
					if (doc.exists) {
						msgs.push({ ...doc.data(), createdAt: convertTimestamp2Date(doc.data().createdAt) });
					}
				});
				if (msgs.length > 0) {
					let tmpMsgs = messages.slice(0, messages.length);
					msgs.map((msg) => {
						tmpMsgs.push(msg);
					});
					setMessages(tmpMsgs);
				}
				setPrevLoading(false);
				if (msgs.length > 0) {
					setHasMore(true);
				} else {
					setHasMore(false);
				}
			})
			.catch((error) => {
				setPrevLoading(false);
				setHasMore(false);
				console.log('loadMessage', error);
			});
	};

	const onSend = async (newMessages = []) => {

		let isQuoted = false;
		let isImage = false;
		if (quote_msg != null) {
			newMessages.map((msg, index) => {
				newMessages[index].reply = quote_msg;
			});
			setQuoteMsg(null);
			isQuoted = true;
		}
		if (images != null && images.length > 0) {
			setImageUploading(true);
			console.log('upload started ', images.length)
			let imageUrls = [];
			for (var i = 0; i < images.length; i++) {
				if (images[i] != null && images[i].data != null) {
					try {
						let res = await uploadImage(images[i].data);
						if (res != null && res.data != null && res.data.success == true) {
							imageUrls.push(res.data.url);
						}
					} catch (error) {
						console.log('uploadImage ', error)
					}
				}
			}
			setImages(null);

			if (imageUrls.length == 0) {
				return;
			} else {
				newMessages.map((msg, index) => {
					newMessages[index].images = imageUrls;
				});
			}

			console.log('upload done ', newMessages.length)
			isImage = true;
		}


		console.log('sendMessage start ', newMessages.length)
		for (var i = 0; i < newMessages.length; i++) {
			await sendMessage(channelData.id, props.user.id, newMessages[i]);
		}
		console.log('sendMessage done ', newMessages.length)
		setImageUploading(false);
	};

	const addCurrentLocation = async () => {
		ShowShareModal(false);
		try {
			let hasPermission = await checkLocationPermission();
			if (hasPermission) {
				sendCurrentPosition()
			}
			else {
				requestLocationPermission()
					.catch(() => {
						alerts.error(translate('attention'), translate('locationUnavailable'));
					});
			}
		}
		catch (error) {
			console.log('checkLocationPermission : ', error)
			alerts.error(translate('attention'), translate('locationUnavailable'));
		}

	};

	const sendCurrentPosition = async () => {
		try {
			const location = await GetLocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000, });
			if (location) {
				let newMsg = {
					user: {
						_id: props.user.id,
						full_name: props.user.full_name,
						photo: props.user.photo,
						phone: props.user.phone,
						email: props.user.email,
					},
					map: {
						coords: {
							latitude: location.latitude,
							longitude: location.longitude
						},
						type: 0, // 0 : my location, 1 : a location
					},
				};
				onSend([newMsg]);
			}
		} catch (error) {
			const { code, message } = error;
			console.warn('onLater', code, message);
			alerts.error(translate('attention'), translate('locationUnavailable'));
		}
	}

	const goFindLocation = () => {
		ShowShareModal(false);
		props.navigation.navigate(RouteNames.LocationPickupScreen, { channelId: channelData.id });
	};
	const onPressLocation = () => {
		ShowShareModal(true);
	};

	const onSelectEmoji = (emoji) => {
		setShowEMoji(false);
		setText(text => text.concat(emoji.code));
	};

	const onPressEmoji = () => {
		Keyboard.dismiss();
		setTimeout(() => {
			setShowEMoji(true);
		}, 100);
	};

	const onImageUpload = () => {
		ImagePicker.openPicker({
			mediaType: 'photo',
			multiple: true,
			cropping: false,
			includeBase64: true,
		}).then((images) => {
			setImages(images);
		})
			.catch(error => {
				console.log('image picker ', error);
			});
	};
	const onCapture = () => {
		ImagePicker.openCamera({
			cropping: false,
			includeBase64: true,
		}).then((image) => {
			setImages([image]);
		})
			.catch(error => {
				console.log('image picker ', error);
			});
	};

	const goApplicationSetting=()=>{
		alerts.confirmation(translate('attention'), translate('audioUnavailable'), 'Settings', translate('cancel'))
			.then(
				() => {
					if (Platform.OS === 'android') {
						AndroidOpenSettings.applicationSettings();
					} else {
						Linking.openURL('app-settings:');
					}
				},
				(error) => {
					alerts.error(translate('attention'), translate('audioUnavailable'));
				}
			);
	}
	const onRecord = () => {
		console.log('onRecord');
		if (Platform.OS === 'android') {
			PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then(res => {
				console.log('check ', res)
				if (res != true) {
					PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]).then((result) => {
						console.log('requestMultiple ', result);
						if (result['android.permission.RECORD_AUDIO'] == 'granted') {
							setRecording(true);
						}
						else {
							goApplicationSetting()
						}
					});
				}
				else {
					setRecording(true);
				}
			})
				.catch((error) => {
					console.log('RECORD_AUDIO PERMISSION CHECK ', error)
					goApplicationSetting()
				})
		}
		else {
			setRecording(true);
		}
	};

	const onSendAudio = async (currentTime, fileSize, base64) => {
		try {
			let res = await uploadImage(base64);
			if (res != null && res.data != null && res.data.success == true) {
				console.log('audio url ', res.data.url);
				let newMsg = {
					user: {
						_id: props.user.id,
						full_name: props.user.full_name,
						photo: props.user.photo,
						phone: props.user.phone,
						email: props.user.email,
					},
					audio: {
						url: res.data.url,
						duration: currentTime,
						fileSize: fileSize,
						playing: false,
						position: 0,
					},
				};
				onSend([newMsg]);
			}
		} catch (error) {
			console.log('onSendAudio error', error);
		}
		setRecording(false);
	};

	const onSendData = () => { };

	const onDeleteGroup = async () => {
		let ret = await deleteGroupChannel(channelData.id);
		ShowDeleteGroupModal(true);
		if (ret == true) {
			props.navigation.goBack();
		} else {
			alerts.error(translate('alerts.error'), translate('checkout.something_is_wrong'));
		}
	};

	const onExitGroup = async () => {
		if (channelData.users.length > 1) {
			let ret = await exitGroupChannel(channelData, props.user.id);
			ShowExitGroupModal(false);
			if (ret == true) {
				let channel = await getChannelData(channelData.id);
				setChannelData(channel);
			} else {
				alerts.error(translate('alerts.error'), translate('checkout.something_is_wrong'));
			}
		} else {
			ShowExitGroupModal(false);
			onDeleteGroup();
		}
	};

	const onCancelQuote = () => {
		setQuoteMsg(null);
	};

	const onRemoveImage = (image) => {
		if (images == null) {
			return;
		}
		let tmp_imgs = images.slice(0, images.length);
		let found_index = tmp_imgs.findIndex((i) => i.path == image.path);
		tmp_imgs.splice(found_index, 1);
		setImages(tmp_imgs.length == 0 ? null : tmp_imgs);
	};

	const onLongPressMessage = (currentMessage) => {
		if (currentMessage && currentMessage.text) {
			// const options = ['Copy Text', 'Quote Message', 'Cancel'];;
			setQuoteMsg(currentMessage);
		}
	};

	const onPressMsg = (currentMessage) => {
		Keyboard.dismiss();
		if (
			currentMessage &&
			currentMessage.map &&
			currentMessage.map.coords &&
			currentMessage.map.coords.latitude &&
			currentMessage.map.coords.longitude
		) {
			props.navigation.navigate(RouteNames.LocationMsgScreen, { coords: currentMessage.map.coords });
		}
	};

	const onShowGalleryMsgs = (images) => {
		if (images.length > 0) {
			let tmp = [];
			images.map((image) => {
				tmp.push({
					source: { uri: image },
				});
			});
			setModalImages(tmp);
			ShowGalleryModal(true);
		}
	};

	const renderEmptyInputToolbar = () => (
		<Text style={styles.noMemberTxt}>{translate('social.chat.no_longer_member')}</Text>
	);

	const recordingInputToolbar = () => (
		<AudioInputView
			onRemove={() => {
				setRecording(false);
			}}
			onSend={onSendAudio}
		/>
	);

	const renderBottomInputbar = (giftchat_props) => {
		if (channelData != null && channelData.users.findIndex((i) => i == props.user.id) == -1) {
			return renderEmptyInputToolbar();
		} else if (isRecording) {
			return recordingInputToolbar();
		}

		return renderInputToolbar(giftchat_props, quote_msg, images, onCancelQuote, onRemoveImage);
	};

	const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
		return contentOffset.y == 0;
	};
	const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
		return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
	};

	return (
		<View style={styles.container}>
			<Spinner visible={imageUploading} />
			<GiftedChat
				messages={messages.length == 0 ? [systemMsg] : messages}
				text={text}
				onInputTextChanged={(_text) => {
					setText(_text);
				}}
				onSend={onSend}
				user={{
					_id: props.user.id,
					full_name: props.user.full_name,
					photo: props.user.photo,
					phone: props.user.phone,
					email: props.user.email,
				}}
				minInputToolbarHeight={100}
				alwaysShowSend={true}
				showUserAvatar={false}
				renderUsernameOnMessage={true}
				textInputAutoFocus={false}
				renderLoading={() => (
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<ActivityIndicator size='large' color={Theme.colors.cyan2} style={{ paddingVertical: 12 }} />
					</View>
				)}
				listViewProps={{
					ListFooterComponent: (
						<View style={[Theme.styles.col_center]}>
							<View style={{ height: 100, backgroundColor: '#fff' }} />
							{prevLoading && (
								<View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
									<ActivityIndicator
										size='small'
										color={Theme.colors.cyan2}
										style={{ paddingVertical: 12 }}
									/>
								</View>
							)}
						</View>
					),
					onScroll: ({ nativeEvent }) => {
						if (isCloseToTop(nativeEvent)) {
							console.log('is close to top');
						}
						if (isCloseToBottom(nativeEvent)) {
							loadPrevMessage();
						}
					},
					keyboardShouldPersistTaps: 'handled'
				}}
				renderInputToolbar={renderBottomInputbar}
				renderSend={(props) =>
					renderSend(
						props,
						(text != null && text.length > 0) || (images != null && images.length > 0),
						onRecord,
						onSendData
					)
				}
				renderComposer={(props) =>
					renderComposer(props, onPressEmoji, onPressLocation, onImageUpload, onCapture)
				}
				renderMessage={renderMessage}
				renderBubble={(props) =>
					renderBubble(
						props,
						channelData != null && channelData.channel_type != 'single',
						onLongPressMessage,
						onPressMsg,
						onShowGalleryMsgs
					)
				}
				renderAvatar={null}
				// alignTop
				// scrollToBottom={260}
				bottomOffset={useSafeArea().bottom}
				renderSystemMessage={() => null}
				// renderAvatarOnTop
				// renderActions={renderActions}
				// renderMessageImage
				// renderCustomView={renderCustomView}
				// isCustomViewBottom
				renderFooter={() => (
					<View>
						<Text></Text>
					</View>
				)}
				parsePatterns={(linkStyle) => [
					{
						pattern: /#(\w+)/,
						style: linkStyle,
						onPress: (tag) => console.log(`Pressed on hashtag: ${tag}`),
					},
				]}
			/>
			<MessagesHeader
				style={{ position: 'absolute', top: 0, left: 0 }}
				isMuted={isMuted}
				channel_id={channelData == null ? null : channelData.id}
				data={channelData}
				user_id={props.user.id}
				onBack={() => {
					props.navigation.goBack();
				}}
				onCall={() => {
					if (channelData != null) {
						props.navigation.navigate(RouteNames.CallScreen, { user: channelData.partner });
					}
				}}
				onDelete={() => {
					ShowDeleteGroupModal(true);
				}}
				onExit={() => {
					ShowExitGroupModal(true);
				}}
				onMute={() => {
					SetMuteGroup(!isMuted);
				}}
				onGallery={() => {
					props.navigation.goBack();
				}}
				onPressName={() => {
					if (channelData == null) {
						return;
					}
					let user_id = props.user.id;
					if (channelData.channel_type == 'single') {
						if (user_id == channelData.creator.id) {
							props.navigation.navigate(RouteNames.SnapfooderScreen, {
								user: channelData.partner,
							});
						} else if (user_id == channelData.partner.id) {
							props.navigation.navigate(RouteNames.SnapfooderScreen, {
								user: channelData.creator,
							});
						}
					} else {
						// group
					}
				}}
			/>
			<EmojiBoard
				showBoard={showEmoji}
				tabBarPosition='top'
				tabBarStyle={{ height: 50, paddingTop: 12 }}
				onRemove={() => setShowEMoji(false)}
				onClick={onSelectEmoji}
			/>
			<LocationMsgOptionModal
				showModal={showShareLocModal}
				addCurrentLocation={addCurrentLocation}
				goFindLocation={goFindLocation}
				onClose={() => ShowShareModal(false)}
			/>
			<ConfirmModal
				showModal={isDeleteGroupModal}
				title={translate('group_related.confirm_del_group')}
				yes={translate('group_related.confirm_del_group_yes')}
				no={translate('group_related.confirm_del_group_no')}
				onYes={onDeleteGroup}
				onClose={() => ShowDeleteGroupModal(false)}
			/>
			<ConfirmModal
				showModal={isExitGroupModal}
				title={translate('group_related.confirm_exit_group')}
				yes={translate('group_related.confirm_exit_group_yes')}
				no={translate('group_related.confirm_exit_group_no')}
				onYes={onExitGroup}
				onClose={() => ShowExitGroupModal(false)}
			/>
			<ImgGalleryModal
				index={0}
				images={modal_imgs}
				showModal={isGalleryModal}
				onClose={() => ShowGalleryModal(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		backgroundColor: '#ffffff',
	},
	formView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
	},
	subjectTitle: { fontSize: 14, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text },
	sectionView: {
		width: '100%',
		alignItems: 'flex-start',
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: Theme.colors.gray9,
	},
	modalContent: {
		width: '100%',
		paddingHorizontal: 20,
		paddingBottom: 30,
		paddingTop: 20,
		backgroundColor: Theme.colors.white,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	modalTitle: {
		width: '100%',
		textAlign: 'left',
		fontSize: 16,
		fontFamily: Theme.fonts.bold,
		color: Theme.colors.text,
		marginBottom: 12,
	},
	modalBtnTxt: { flex: 1, marginLeft: 8, fontSize: 14, fontFamily: Theme.fonts.medium, color: Theme.colors.text },
	divider: { width: '100%', height: 1, backgroundColor: Theme.colors.gray9 },
	NoMemberView: {},
	noMemberTxt: {
		marginHorizontal: 30,
		marginTop: 30,
		textAlign: 'center',
		fontSize: 16,
		fontFamily: Theme.fonts.semiBold,
		color: Theme.colors.gray7,
	},
});

const mapStateToProps = ({ app, shop }) => ({
	coordinates: app.coordinates,
	user: app.user,
});

export default connect(mapStateToProps, {
	goActiveScreenFromPush,
})(MessagesScreen);
