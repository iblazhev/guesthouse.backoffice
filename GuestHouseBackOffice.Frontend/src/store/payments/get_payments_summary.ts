import {create} from "zustand";
import {getPaymentsSummaryApi} from "../../services/api.ts";
import {handleError} from "../../utils/helpers.ts";

export interface PaymentsSummaryState {
    income: number;
    expenses: number;
    loading: boolean;
    getPaymentsSummary: () => void;
}

export const usePaymentSummaryStore = create<PaymentsSummaryState>()((set) => ({
    income: 0,
    expenses: 0,
    loading: false,
    getPaymentsSummary: async () => {
        try {
            set({loading: true});
            const response = await getPaymentsSummaryApi();
            if (response) {
                set({
                    income: response.income,
                    expenses: response.expenses,
                    loading: false,
                });
                return;
            }
            set({loading: false});
        } catch (e) {
            handleError(e);

            set({loading: false});
        }
    },
}));
