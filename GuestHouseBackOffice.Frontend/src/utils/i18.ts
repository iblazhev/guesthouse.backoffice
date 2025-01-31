import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend) // Load translations using HTTP backend
    .use(LanguageDetector) // Detect user's language
    .use(initReactI18next) // Bind with React
    .init({
        fallbackLng: 'en', // Default language if detection fails
        debug: true, // Enable debug mode during development
        interpolation: {
            escapeValue: false, // React already escapes values by default
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
        },
    });

export default i18n;
