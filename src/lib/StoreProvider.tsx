"use client"
import { store } from '@/app/redux/store';

import { Provider } from "react-redux";

function StoreProvider({children}) {
  return (
    <div>
      <Provider store={store}>
        {children}
      </Provider>
    </div>
  )
}


export default StoreProvider
