import express, { Request, Response } from 'express';

import authorService from "../services/author.service"


async function getAuthors(req: Request, res: Response)  {
    try {
        return res.status(200).json(await authorService.listAuthors());
    } catch (error) {}
};
async function createAuthor(req: Request, res: Response)  {
    try {
        return res.status(200).json(await authorService.createAuthors(
            req.params.firstName, req.params.lastName));
    } catch (error) {}
};

const authorController = {
    getAuthors: getAuthors,
    createAuthor: createAuthor
}

export default authorController;