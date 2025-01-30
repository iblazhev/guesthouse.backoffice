import { create } from "zustand";
import { Payment } from "../../types/payment.ts";
import { createPaymentApi } from "../../services/api.ts";
import { handleError, handleSuccess } from "../../utils/helpers.ts";

export interface CreatePaymentState {
  loading: boolean;
  success: boolean;
  createPayment: (input: Payment) => void;
}

export const createPaymentStore = create<CreatePaymentState>()((set) => ({
  loading: false,
  success: false,
  createPayment: async (input: Payment) => {
    try {
      set({ loading: true });
      await createPaymentApi(input);
      set({ loading: false });
      handleSuccess(`Payment created successfully.`);
    } catch (e: any) {
      handleError("Payment not created.", e);
      set({ loading: false });
    }
  },
}));
