import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { authActions } from "./redux/slice";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import Header from "./components/Header";
import ChangePassword from "./pages/ChangePassword";
import Footer from "./components/Footer";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateCourse from "./pages/CreateCourse/CreateCourse";
import Register from "./pages/Register";
import PrivateRoute from "./routes/PrivateRoute";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import MyCourses from "./pages/MyCourses";
import Cookies from "js-cookie";
import EditCourse from "./pages/EditCourse";
import CourseDetail from "./pages/CourseDetail";

function App() {
    const dispatch = useAppDispatch();

    const isLogin = useAppSelector((state) => state?.authSlice?.isLogin) ?? false;

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            //@ts-ignore
            dispatch(authActions.getMe());
        }
    }, [dispatch]);

    return (
        <>
            <BrowserRouter>
                <Header isLogin={isLogin} />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route element={<PrivateRoute />}>
                        <Route path="/change-password" element={<ChangePassword />}></Route>
                        <Route path="/my-courses" element={<MyCourses />}></Route>
                    </Route>
                        <Route path="/create-course" element={<CreateCourse />}></Route>
                        <Route path="/my-courses/edit/:course_id" element={<EditCourse />}></Route>
                    <Route path="/course-detail/:slug" element={<CourseDetail />}></Route>
                    <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                    <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/verify-email/:token" element={<Verify />}></Route>
                    <Route path="/*" element={<NotFound />}></Route>
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;
