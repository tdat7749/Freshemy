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

const port: number = 3000;

app.get("/a", (_req, res: Response) => {
    res.send(`hello`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
