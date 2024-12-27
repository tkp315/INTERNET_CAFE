import { useEffect, useState } from "react"

function useDebounce<T>(value:T,delay:number){
const [debouncedValue,setDebouncedValue] = useState<T>();

useEffect(()=>{
    if(!value)return ;
    const timerId = setTimeout(()=>{
        setDebouncedValue(value)
    },delay)
    return () => {
        clearTimeout(timerId);
      };
},[value,delay])

return debouncedValue
}

export default useDebounce