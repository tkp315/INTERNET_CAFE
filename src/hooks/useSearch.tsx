import axios from "axios";
import { useEffect, useState } from "react"
import useApiToast from "./useApiToast";

const useSearch =(url:string|null)=>{
    const [input,setInput] = useState('');
    const [query,setQuery] = useState('');
    const [searchResult,setSearchResult] = useState([]);
    const apiCall = useApiToast();
    function handleInputChange(e){
        setInput(e.target.value);
    }

    useEffect(()=>{
        const timer = setTimeout(()=>{
            if(input){
                setQuery(input);
            }
        },500)

        return ()=>clearTimeout(timer);
    },[input])

   
    useEffect(()=>{
        if (!query ||!url) return;
     async function fetch (){
        const res =await apiCall(url,null,axios.get);
        console.log(res);
        setSearchResult(res);
     }
     fetch()
      
    },[query,url,apiCall])
   

    return {handleInputChange,input,query,searchResult}
}
export default useSearch;