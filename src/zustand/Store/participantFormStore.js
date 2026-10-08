import { create } from "zustand";
// import api from "axios";
import axios from "axios";

const participantFormStore = create(() => ({

    registerParticipant: async (formData) => {

        try {

            const res = await axios.post(
                "http://localhost:5000/participants/participateRegister",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );


            return res.data;
        } catch (error) {
            console.error(
                "Participant registration error:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to register participant. Please try again.";

            throw error;
        }
    },

}));

export default participantFormStore;