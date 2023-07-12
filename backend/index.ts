import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import routers from "./src/routes";
import configs from "./src/configs";
import cors from "cors";

const app: Application = express();

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", routers.authRouter);

const port: number = configs.general.PORT;

app.get("/", (_req, res: Response) => {
    res.send(`Server is running on port 111eafdvrdfhcvrdf1: ${port}`);
});

app.use("/auth", routers.authRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
