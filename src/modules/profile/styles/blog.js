import { StyleSheet } from 'react-native';
import { width, height } from 'react-native-dimension';
import Theme from '../../../theme';

const itemHeight = 150;
const itemRadius = 5;

const styles = StyleSheet.create({
	container: {
		width: '100%', borderRadius: 15,
		backgroundColor: Theme.colors.gray8, 
		marginBottom: 15,
	},
	image: {
		width: '100%', height: 130, borderTopRightRadius: 15, borderTopLeftRadius: 15, 
	},
	content: {
		paddingHorizontal: 15, paddingVertical: 10, 
		width: '100%',
	},
	category: {
		width: '100%', fontSize: 10, fontFamily: Theme.fonts.semiBold, color: Theme.colors.cyan2, textTransform: 'capitalize', 
	},
	title: {
		width: '100%', fontSize: 14, marginVertical: 4, lineHeight: 16, fontFamily: Theme.fonts.semiBold, color: Theme.colors.text
	},
	author: {fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.cyan2},
	date: {
		fontSize: 12, fontFamily: Theme.fonts.medium, color: Theme.colors.gray7
	},
	header: {  position: 'absolute', top: 40, left: 20, right: 20, height: 50, width: width(100) - 40, },
	headerBtn: { width: 33, height: 33, borderRadius: 8, backgroundColor: Theme.colors.white, },
	detail_image : {width: '100%', height: 220, },
	rowFlex: {
		flexDirection: 'row',
		paddingVertical: 5,
	},
	hr: {
		borderBottomWidth: 1,
		borderBottomColor: Theme.colors.backgroundTransparent5,
		marginVertical: 5,
	},
	categoryDetails: {
		flex: 1, fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.cyan2, textTransform: 'capitalize', 
	}, 
	titleDetails: {
		fontSize: 16, marginVertical: 10, lineHeight: 20, fontFamily: Theme.fonts.bold, color: Theme.colors.text
	}, 
	authorDetails: {marginLeft: 3, fontSize: 12, fontFamily: Theme.fonts.semiBold, color: Theme.colors.red1},
});
export default styles;
