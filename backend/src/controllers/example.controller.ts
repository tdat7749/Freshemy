import services from "src/services";
import express, { Request, Response } from "express";

async function getExamples(req: Request, res: Response) {
    try {
        return res.status(200).json(await services.exampleService.exampleGet());
    } catch (error) {}
}

async function creatExamples(req: Request, res: Response) {
    try {
        return res.status(200).json(await services.exampleService.exampleCreate());
    } catch (error) {}
}

const exampleController = {
    getExamples: getExamples,
    creatExamples: creatExamples,
};

export default exampleController;
