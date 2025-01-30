import {create} from "zustand";
import {Payment} from "../../types/payment.ts";
import {getPaymentsApi} from "../../services/api.ts";
import {handleError} from "../../utils/helpers.ts";
import {PaymentSearchParams} from "../../types/paymentSearchParams.ts";

export interface PaymentsState {
    payments: Payment[];
    loading: boolean;
    getPayments: (input: PaymentSearchParams) => void;
}

export const usePaymentStore = create<PaymentsState>()((set) => ({
    payments: [],
    loading: false,
    getPayments: async (input: PaymentSearchParams) => {
        try {
            set({loading: true});
            const response = await getPaymentsApi(input);
            if (response) {
                set({payments: response, loading: false});
                return;
            }
            set({loading: false});
        } catch (e) {
            handleError(e);

            set({loading: false});
        }
    },
}));
