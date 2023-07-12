import {useEffect} from 'react'

import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
 import { authActions } from './redux/slice';
import { useAppDispatch,useAppSelector } from './hooks/hooks';
import Header from './components/Header'

function App() {

  const dispatch = useAppDispatch()

  const isLogin = useAppSelector(state => state?.authSlice?.isLogin) ?? false;

  useEffect(() =>{
    //@ts-ignore
    dispatch(authActions.getMe())
  },[dispatch])

  return (
    <>
      <BrowserRouter>
      <Header isLogin={isLogin}/>  
        <Routes>
          <Route path="/" element={<Home/>}>
          
          </Route>

          <Route path="/login" element={<Login/>}>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
