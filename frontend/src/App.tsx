import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                    <Route path="/" element={<Home />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
