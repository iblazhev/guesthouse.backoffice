import {useEffect, useState} from "react";
import {
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoneyCollectOutlined,
    TableOutlined,
} from "@ant-design/icons";
import {Button, ConfigProvider, Layout, Menu, theme} from "antd";
import {Link, Outlet, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "../components/language_switcher/language_switcher.tsx";
import antdLocales from "../antdLocales.tsx";

const {Header, Sider, Content} = Layout;

export default function Home() {
    const {i18n} = useTranslation();
    const [antdLocale, setAntdLocale] = useState(antdLocales[i18n.language as keyof typeof antdLocales] || antdLocales.en);

    // Update Ant Design locale when i18n language changes
    useEffect(() => {
        setAntdLocale(antdLocales[i18n.language as keyof typeof antdLocales] || antdLocales.en);
    }, [i18n.language]);

    const [collapsed, setCollapsed] = useState(true);
    const {t} = useTranslation();
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const location = useLocation();

    enum Paths {
        Home = "/",
        Requests = "/requests",
        Payments = "/payments",
    }

    return (
        <ConfigProvider locale={antdLocale}>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical"/>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[location.pathname]}
                        items={[
                            {
                                key: Paths.Home,
                                icon: (
                                    <Link to={"/"}>
                                        <HomeOutlined/>
                                    </Link>
                                ),
                                label: t('home'),
                            },
                            {
                                key: Paths.Requests,
                                icon: (
                                    <Link to={Paths.Requests}>
                                        <TableOutlined/>
                                    </Link>
                                ),
                                label: t('requests'),
                            },
                            {
                                key: Paths.Payments,
                                icon: (
                                    <Link to={Paths.Payments}>
                                        <MoneyCollectOutlined/>
                                    </Link>
                                ),
                                label: t('finances'),
                            },
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header style={{padding: 0, background: colorBgContainer}}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: "16px",
                                width: 64,
                                height: 64,
                            }}
                        />
                        <LanguageSwitcher/>
                    </Header>
                    <Content
                        style={{
                            height: "calc(100vh - 80px)",
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet/>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
