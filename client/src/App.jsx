import {createContext, useEffect, useState} from 'react'
import './App.css'
import {RouterProvider} from "react-router-dom";
import {router} from "./page/router.jsx";
export const AppContext = createContext(null)
function App() {
  const [page,setPage] = useState("/")
  const [user, setUser] = useState()
  const useStore = localStorage.getItem("userStore")
  useEffect(() => {
    if (useStore) setUser(JSON.parse(useStore))
  }, []);
  return (
    <AppContext.Provider value={{page,setPage, user, setUser}}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  )
}

export default App
