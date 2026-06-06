import { configureStore } from "@reduxjs/toolkit";
import MessageSlice from "./slices/MessageSlice"
const store = configureStore({
    reducer: {
        messages: MessageSlice,
    }
});

export default store;