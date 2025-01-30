import {create} from "zustand";
import {getRequestsApi} from "../../services/api.ts";
import {handleError} from "../../utils/helpers.ts";
import {BookingRequest} from "../../types/bookingRequest.ts";
import {BookingRequestsSearchParams} from "../../types/bookingRequestsSearchParams.ts";

export interface BookingRequestsState {
    requests: BookingRequest[];
    loading: boolean;
    getRequests: (input: BookingRequestsSearchParams) => void;
}

export const useBookingRequestStore = create<BookingRequestsState>()((set) => ({
    requests: [],
    loading: false,
    getRequests: async (input: BookingRequestsSearchParams) => {
        try {
            set({loading: true});
            const response = await getRequestsApi(input);
            if (response) {
                set({requests: response, loading: false});
                return;
            }
            set({loading: false});
        } catch (e) {
            handleError(e);

            set({loading: false});
        }
    },
}));
