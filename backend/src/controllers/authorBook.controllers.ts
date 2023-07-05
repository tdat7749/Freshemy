import express, { Request, Response } from 'express';

import authorBookService from "../services/authorBook.service"


async function linkAuthorBook(req: Request, res: Response) {
    try {
        res.status(200).json(await authorBookService.linkAuthorBook(
            parseInt(req.params.authorId),
            parseInt(req.params.bookId),
        ));
    } catch (error) {}
};



const authorBookController = {
    linkAuthorBook: linkAuthorBook,
}

export default authorBookController;
