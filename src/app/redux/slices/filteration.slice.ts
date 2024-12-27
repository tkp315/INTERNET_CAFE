import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import paymentLink from "razorpay/dist/types/paymentLink";

export type CategoryParameterType = {
  limit?: number;
  name?: string;
  availability?: string;

  dateInterval?: string | null;
  page?: number;
};
export type CategoryResultType = {
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
};
// ********** Service Request Type ***********
export type unskippableDialogType={
  isOpen:boolean,
  length:number,
  isAllPaid:boolean
}
export type RequestParameterType = {
  limit: number;
  page: number;
};
export type CompletionRequestParameterType = {
  limit: number;
  page: number;
};
export type CustomRequestParameterType = {
  limit: number;
  page: number;
};
// ************* Orders*************
export type OrderFilteration = {
  page?: number;
  ongoing?: boolean;
  completed?: boolean;
  pending?: boolean;
  paid?: boolean;
  unpaid?: boolean;
};

interface InitialStateType {
  categoryParameter: CategoryParameterType;
  categoryResult: CategoryResultType;
  requestParameter: RequestParameterType;
  completionRequestParameter: CompletionRequestParameterType;
  customRequestParameter: CustomRequestParameterType;
  customOrderParameter: OrderFilteration;
  serviceOrderParameter: OrderFilteration;
  unskippableDialog:unskippableDialogType;
}

const manageLocalStorage = (
  key: string,
  value?: object | string | null|number
): string | null => {
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
  categoryParameter: {
    availability: "",
    dateInterval: null,
    limit: 5,
    page: 1,
    name: "",
  },
  categoryResult: {},
  requestParameter: {
    limit: 10,
    page: 1,
  },
  completionRequestParameter: {
    limit: 10,
    page: 1,
  },
  customRequestParameter: {
  page:1,
  limit:10
  },
  customOrderParameter: {
    page:1,
    // completed:true,
    // ongoing:true,
    // paid:true,
    // unpaid:true,
    // pending:true
  },
  serviceOrderParameter: {},
  unskippableDialog:{
    isAllPaid:JSON.parse(manageLocalStorage('isAllPaid')||"false")||false,
    isOpen:JSON.parse(manageLocalStorage('isOpen')||"false")||false,
    length:parseInt(manageLocalStorage('length')||'0'),
  }
};

const filterationSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateCategoryParameter: (
      state,
      action: PayloadAction<CategoryParameterType>
    ) => {
      const data = action.payload;
      state.categoryParameter.availability = data.availability;
      state.categoryParameter.limit = data.limit;

      state.categoryParameter.page = data.page;
      state.categoryParameter.name = data.name;

      state.categoryParameter.dateInterval = data.dateInterval;
      // state.categoryParameter = {
      //     ...state.categoryParameter,
      //     ...action.payload,
      //   };
    },
    updateCategoryResult: (
      state,
      action: PayloadAction<CategoryResultType>
    ) => {
      //  state.categoryResult= {
      //     ...state.categoryResult,
      //     ...action.payload
      //  }
      const data = action.payload;

      state.categoryResult.totalPages = data.totalPages;
      state.categoryResult.hasNextPage = data.hasNextPage;
      state.categoryResult.hasPreviousPage = data.hasPreviousPage;
    },
    updateRequestParameter: (
      state,
      action: PayloadAction<RequestParameterType>
    ) => {
      console.log(action.payload);

      const data = action.payload;
      state.requestParameter.limit = data.limit;
      state.requestParameter.page = data.page;
    },
    updateCompletionParameter: (
      state,
      action: PayloadAction<RequestParameterType>
    ) => {
      console.log(action.payload);

      const data = action.payload;
      state.completionRequestParameter.limit = data.limit;
      state.completionRequestParameter.page = data.page;
    },
    updateCustomParameter: (
      state,
      action: PayloadAction<RequestParameterType>
    ) => {
      console.log(action.payload);

      const data = action.payload;
      state.customRequestParameter.limit = data.limit;
      state.customRequestParameter.page = data.page;
    },
    updateCustomOrder: (state, action: PayloadAction<OrderFilteration>) => {
      const data = action.payload;

      state.customOrderParameter.page = data.page;
      state.customOrderParameter.completed = data.completed;
      state.customOrderParameter.ongoing = data.ongoing;
      state.customOrderParameter.paid = data.paid;
      state.customOrderParameter.unpaid = data.unpaid;
      state.customOrderParameter.pending = data.pending;
    },
    updateServiceOrder: (state, action: PayloadAction<OrderFilteration>) => {
      const data = action.payload;
      state.customOrderParameter.page = data.page;
      state.customOrderParameter.completed = data.completed;
      state.customOrderParameter.ongoing = data.ongoing;
      state.customOrderParameter.paid = data.paid;
      state.customOrderParameter.unpaid = data.unpaid;
      state.customOrderParameter.pending = data.pending;
    },
    updateDialog:(state,action:PayloadAction<unskippableDialogType>)=>{
      const data = action.payload;
      manageLocalStorage('length',data.length)
      if(data.length>0){
        state.unskippableDialog.isOpen=true
        manageLocalStorage('isOpen',JSON.stringify('true'))
      }
       if(data.isAllPaid){
        state.unskippableDialog.isOpen=false;
        manageLocalStorage('isAllPaid',JSON.stringify('false'))
       }
    }
  },
});

export const {
  updateCategoryParameter,
  updateCompletionParameter,
  updateCustomParameter,
  updateCategoryResult,
  updateRequestParameter,
  updateCustomOrder,
  updateServiceOrder,
  updateDialog
} = filterationSlice.actions;
export default filterationSlice.reducer;
