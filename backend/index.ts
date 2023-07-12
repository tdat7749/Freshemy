import express, { Application, Request, Response } from "express";

//////////////////////////////////////////////////////////////////////////
import routers from "./src/routes";
import configs from "./src/configs";
//////////////////////////////////////////////////////////////////////////

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port: number = configs.general.PORT;

app.get("/", (_req, res: Response) => {
    res.send(`Server is running on port 111eafdvrdfhcvrdf1: ${port}`);
});

app.use("/auth", routers.authenRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
