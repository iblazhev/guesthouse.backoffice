import {create} from "zustand";
import {createRequestApi} from "../../services/api.ts";
import {handleError} from "../../utils/helpers.ts";
import {BookingRequest} from "../../types/bookingRequest.ts";

export interface CreateBookingRequestState {
    loading: boolean;
    createRequest: (input: BookingRequest) => void;
}

export const createBookingRequestStore = create<CreateBookingRequestState>()(
    (set) => ({
        loading: false,
        createRequest: async (input: BookingRequest) => {
            try {
                set({loading: true});
                await createRequestApi(input);
                set({loading: false});
            } catch (e) {
                handleError(e);
                set({loading: false});
            }
        },
    }),
);
