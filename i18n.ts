import i18next, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "./langs/en.json";
import es from "./langs/es.json";

//This file detects the browser language that the user is using and uses it as
//default. If not found in our file, it defaults to English.

const resources = {
    en: { translation: en },
    es: { translation: es },
};

const locales = Localization.getLocales();
const deviceLanguage = locales.length > 0 ? locales[0].languageCode : "en";

i18next
    .use(initReactI18next)
    .init({
        resources,
        lng: deviceLanguage,
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    } as InitOptions);

export default i18next;
