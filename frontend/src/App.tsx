import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChangePassword from "./pages/ChangePassword";



function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/change-password" element={<ChangePassword />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
