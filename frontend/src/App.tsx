import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Login from "./pages/Login";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                    <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
                    <Route path="/login" element={<Login isLogin={true} />}></Route>
                    <Route path="/" element={<Home />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
