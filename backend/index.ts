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

app.get("/", (_req, res: Response) => {
    res.send(`Servs rasfasfunning on port: ${port}`);
});

app.get("/api/todos", async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const allUsers = await prisma.course.findMany();
        return res.json({
            success: "huhuaaaa",
            data: allUsers,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
