import express, { Application, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

//////////////////////////////////////////////////////////////////////////
import routers from "./src/routes";
import configs from "./src/configs";

//////////////////////////////////////////////////////////////////////////

const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: number = configs.general.PORT;

app.get("/", (_req, res: Response) => {
    res.send(`Server is running on port 11111111111111: ${port}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
