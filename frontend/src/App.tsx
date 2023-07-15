import {useEffect} from 'react'

import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
 import { authActions } from './redux/slice';
import { useAppDispatch,useAppSelector } from './hooks/hooks';
import Header from './components/Header'
import ChangePassword from './pages/ChangePassword';
import Footer from './components/Footer';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from './pages/Register';
import PrivateRoute from "./routes/PrivateRoute";


function App() {
    const dispatch = useAppDispatch();

    const isLogin = useAppSelector((state) => state?.authSlice?.isLogin) ?? false;

    useEffect(() => {
        //@ts-ignore
        dispatch(authActions.getMe());
    }, [dispatch]);

    return (
        <>
            <BrowserRouter>
                <Header isLogin={isLogin} />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route element={<PrivateRoute isLogin={isLogin}/>}>
                    <Route path="/change-password" element={<ChangePassword/>}></Route>
                    </Route>
                    <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                    <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                </Routes>
                <Footer/>
            </BrowserRouter>
        </>
    );
}



export default App;
