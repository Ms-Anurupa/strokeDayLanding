import { create } from "zustand";
import api from "axios";

const attendFormStore = create((set) => ({
    loading: false,
    error: null,
    attendee: null,

    registerAttendee: async (payload) => {
        set({
            loading: true,
            error: null,
        });

        try {
            const response = await api.post(
                `http://localhost:5000/attendees/register`,
                payload
            );

            set({
                loading: false,
                attendee: response.data?.data || null,
            });

            return response.data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Failed to register attendee";

            set({
                loading: false,
                error: message,
            });

            throw error;
        }
    },
}));

export default attendFormStore;