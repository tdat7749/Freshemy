import express, { Application } from "express";
import cookieParser from "cookie-parser";
import routers from "./src/routes";
import configs from "./src/configs";
import cors from "cors";
import path from "path";

const app: Application = express();

// Sử dụng middleware cookie-parser để xử lý cookie
app.use(cookieParser());

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/public/videos", express.static("./public/videos"));

app.use("/api/auth", routers.authRouter);
app.use("/api/users", routers.userRouter);
app.use("/api/sections", routers.sectionRouter);
app.use("/api/lessons", routers.lessonRouter);
app.use("/api/categories", routers.categoryRouter);
app.use("/api/courses", routers.courseRouter);
app.use("/api/filestorage", routers.fileStorageRouter);

const port: number = configs.general.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
