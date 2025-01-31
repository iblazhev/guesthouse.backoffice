import {Button, Space} from 'antd';
import {useTranslation} from 'react-i18next';
import BgSvg from "./flags/bgSvg.tsx";
import UsSvg from "./flags/usSvg.tsx";

const LanguageSwitcher = () => {
    const {i18n} = useTranslation();

    // Function to change the language
    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang); // Switches the language
    };

    return (
        <Space>
            <Button type={i18n.language === 'en' ? 'primary' : 'default'} onClick={() => changeLanguage('en')}>
                <UsSvg/>
            </Button>
            <Button type={i18n.language === 'bg' ? 'primary' : 'default'} onClick={() => changeLanguage('bg')}>
                <BgSvg/>
            </Button>
        </Space>
    );
};

export default LanguageSwitcher;
