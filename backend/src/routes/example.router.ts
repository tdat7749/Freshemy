import express, { Request, Response } from "express";

import controllers from "../controllers";

const exampleRouter = express.Router();
exampleRouter.get("/a", (req, res) => {
    res.send("Hello World");
});
exampleRouter.get("/get", controllers.exampleController.getExamples);
exampleRouter.post("/create", controllers.exampleController.creatExamples);

export default exampleRouter;
