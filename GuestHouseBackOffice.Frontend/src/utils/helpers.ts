import axios from "axios";
import {Log} from "./log.ts";
import {notification} from "antd";

export const handleSuccess = (message: string) => {
    notification.success({
        message,
        showProgress: true,
    });
};

export const handleError = (error: any, errorMessage?: string) => {
    if (axios.isAxiosError(error)) {
        if (errorMessage) {
            notification.error({
                message: errorMessage,
                showProgress: true,
            });
        }
        Log.error("error message: ", error.message);
        return error.message;
    } else {
        Log.error("unexpected error: ", error);
        return error;
    }
};

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let [r, g, b] = [0, 0, 0];

    if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
    else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
    else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
    else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
    else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
    else if (h >= 300 && h < 360) [r, g, b] = [c, 0, x];

    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255),
    ];
}

function rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b)
        .toString(16)
        .slice(1)}`;
}

export function numberToLightColor(num: number): string {
    const hue = (num * 137) % 360; // Spread across the color wheel
    const saturation = 0.4; // Low saturation for light colors
    const value = 0.9; // High brightness

    const [r, g, b] = hsvToRgb(hue, saturation, value);
    return rgbToHex(r, g, b);
}
