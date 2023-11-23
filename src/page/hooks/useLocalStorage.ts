import { useEffect, useState } from "react"

export default function useLocalStorage<T>(key:string, initialValue:any):[value:T, setValue: React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
      const jsonValue = localStorage.getItem(key)
      if (jsonValue != null) return JSON.parse(jsonValue) || jsonValue;
      return initialValue;
    })
  
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])
  
    return [value, setValue]
  }