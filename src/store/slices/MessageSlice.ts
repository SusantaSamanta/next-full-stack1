import { createSlice } from '@reduxjs/toolkit';


const MessageSlice = createSlice({
  name: "messages",
  initialState: [],
  reducers: {
    addMessages(state, action) {
      return action.payload;
    },
    deleteMessage(state, action) {

    }
  }
})

export default MessageSlice.reducer;
export const { addMessages, deleteMessage } = MessageSlice.actions;