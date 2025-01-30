import axios, {AxiosInstance} from "axios";
import {useUserState} from "../store/user.ts";
import {Payment} from "../types/payment.ts";
import {Log} from "../utils/log.ts";
import {handleError} from "../utils/helpers.ts";
import {LoginData} from "../types/loginData.ts";
import {BookingRequest} from "../types/bookingRequest.ts";
import {BookingRequestsSearchParams} from "../types/bookingRequestsSearchParams.ts";
import {PaymentSearchParams} from "../types/paymentSearchParams.ts";


let API: AxiosInstance;

function getServerURL() {
    return import.meta.env.VITE_BE_API_PATH;
}

export function getAccessToken() {
    return useUserState.getState().accessToken;
}

export function createAxios() {
    API = axios.create({
        baseURL: getServerURL(),
        timeout: 60000,
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    //Add interceptors to instance
    // API.interceptors.response.use(
    //   response => response,
    //   error => {
    //     if (!error.response) {
    //       //store.commit('setServiceAvailable', false);
    //     }
    //     else if (error.response.status === 401) {
    //       //store.commit('setUserAuthorised', false);
    //     }
    //     return error;
    //   });
}

export const createRequestApi = async (data: BookingRequest) => {
    try {
        await API.post("/requests", data);
        Log.info("Successful create booking requests");
    } catch (e) {
        handleError(e);
    }
};

export const createPaymentApi = async (data: Payment) => {
    try {
        await API.post("/payments", data);
        Log.info("Successful create payment");
    } catch (e) {
        handleError(e);
    }
};

export const getRequestsApi = async (data: BookingRequestsSearchParams) => {
    try {
        const res = await API.get("/requests", data);
        Log.info("Successful get booking requests");
        return res.data;
    } catch (e) {
        handleError(e);
    }
};

export const getPaymentsApi = async (data: PaymentSearchParams) => {
    try {
        const res = await API.get("/payments", data);
        Log.info("Successful get payments");
        return res.data;
    } catch (e) {
        handleError(e);
    }
};

export const getPaymentsSummaryApi = async () => {
    try {
        const res = await API.get("/payments/summary");
        Log.info("Successful get payments summary");
        return res.data;
    } catch (e) {
        handleError(e);
    }
};

export const loginApi = async (data: LoginData) => {
    try {
        const res = await API.post("/login", data);
        if (res.status == 401) {
            return "Wrong username or password";
        } else {
            Log.info("Successful login.");
            return res.data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            Log.error("error message: ", error.message);
            return "Wrong username or password";
        } else {
            Log.error("unexpected error: ", error);
            return "Wrong username or password";
        }
    }
};
