import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateType {
 role:string|string|null,
 isLoggedIn:boolean|string|null
}

const manageLocalStorage = (key: string, value?: object | string | null):  string | null => {
    if (typeof window !== "undefined" && window.localStorage) {
      if (value !== undefined) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
      } else {
        const item = localStorage.getItem(key);
        try {
          return item ? JSON.parse(item) : null;
        } catch (error) {
          console.error("Error parsing localStorage item:", error);
          return null;
        }
      }
    }
    return null;
  };
  

const initialState: InitialStateType = {
  isLoggedIn: manageLocalStorage("isLoggedIn"),
  role:manageLocalStorage('role'),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
   userDetails:(state,action:PayloadAction<object|string>)=>{
     console.log(action.payload)
   }
  },
});

export const { userDetails } = userSlice.actions;
export default userSlice.reducer;
