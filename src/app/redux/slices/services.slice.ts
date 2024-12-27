import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateType {
  selectedService: object | string | null;
  processingServiceData:object|string|null;
}

const manageLocalStorage = (key: string, value?: object | string | null): object | string | null => {
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
  selectedService: manageLocalStorage("selectedService"),
  processingServiceData:manageLocalStorage('processingServiceData'),
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    selectedServiceData: (state, action: PayloadAction<object | string>) => {
        state.processingServiceData= action.payload;
    manageLocalStorage('processingServiceData',action.payload)
    console.log(action.payload)
    },
    removeProcessingData:(state)=>{
     state.processingServiceData={};
     manageLocalStorage('processingServiceData',null);
     
    },
    removeSelectedService:(state)=>{
     state.selectedService={}
     manageLocalStorage('selectedService',null)
    },
    selectedServiceFun:(state,action:PayloadAction<object|string>)=>{
      state.selectedService = action.payload;
        console.log(action.payload);
        manageLocalStorage("selectedService",action.payload)
    }
  },
});

export const { selectedServiceFun,selectedServiceData,removeProcessingData,removeSelectedService } = serviceSlice.actions;
export default serviceSlice.reducer;
