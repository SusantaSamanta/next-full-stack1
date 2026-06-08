import { createSlice } from '@reduxjs/toolkit';

interface Message {
  _id: string;
  content: string;
  createdAt: string;
}

const MessageSlice = createSlice({
  name: "messages",
  initialState: [] as Message[],
  reducers: {
    addMessages(state, action) {
      return action.payload;
    },
    deleteMessage(state, action) {
      let newMessageArr = state.filter((mss, i) => mss._id !== action.payload);
      return newMessageArr;
    }
  }
})

export default MessageSlice.reducer;
export const { addMessages, deleteMessage } = MessageSlice.actions;