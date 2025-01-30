import {ThemeConfig} from "antd";

export const theme: ThemeConfig = {
    components: {
        Calendar: {
            fontSize: 22
        }
    },
    token: {
        "colorPrimary": "#13c2c2",
        "colorInfo": "#13c2c2",
        "colorSuccess": "#a0d911",
        "colorError": "#fa541c",
        "colorTextBase": "#000000",
        "sizeStep": 6,
        "sizeUnit": 3,
        "borderRadius": 4,
        "wireframe": true
    },
};
