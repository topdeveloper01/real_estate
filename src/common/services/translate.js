import moment from 'moment/min/moment-with-locales';
import {getStorageKey, KEYS, setStorageKey} from './storage';
import en from '../../translations/en';
import sq from '../../translations/sq';
import i18n from 'i18next';
// import 'moment/src/locale/en-gb'
import 'moment/src/locale/sq';

const resources = {
    en: {
        translation: en,
    },
    sq: {
        translation: sq,
    },
};

export const translate = (key, config) => {
    return i18n.t(key, config);
};

export const getLanguage = () => {
    return i18n.language;
};

export const setLanguage = async (language) => {
    moment.locale(language);
    await i18n.changeLanguage(language);
    await setStorageKey(KEYS.LANGUAGE, language);
};

export const setI18nConfig = () => {
    return new Promise(async resolve => { 
        const fallback = {languageTag: 'sq', isRTL: false};

        console.log('setI18nConfig' )

        let languageTag;
        try {
            languageTag = await getStorageKey(KEYS.LANGUAGE);
            console.log('getStorageKey language : ', languageTag)
        } catch (e) {
            console.log('Error getStorageKey(KEYS.LANGUAGE)', e)
            await setLanguage(fallback.languageTag);
        }
        if (!languageTag) {
            await setLanguage(fallback.languageTag);
        }
        else {
            await setLanguage(languageTag);
        }
        moment.locale(languageTag);
        resolve();
    });
};

i18n.init({
    resources,
    lng: 'sq', // 'en',
    fallbackLng: 'sq',// 'en',
    interpolation: {
        escapeValue: false,
    },
    cleanCode: true,
});

export default i18n;

export const appMoment = moment;
