import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { authActions } from "./redux/slice";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
                    <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                    <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;
