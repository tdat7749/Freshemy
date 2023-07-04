import express, { Request, Response } from "express";

import bookService from "../services/book.service";

async function getBooks(req: Request, res: Response) {
  try {
    return res.status(200).json(await bookService.listBooks());
  } catch (error) {}
}
async function createBook(req: Request, res: Response) {
  try {
    return res
      .status(200)
      .json(
        await bookService.createBooks(
          req.params.title,
          req.params.dataPublished,
          parseInt(req.params.isFiction) == 1 ? true : false,
          parseInt(req.params.authorId)
        )
      );
  } catch (error) {}
}


const bookController = {
    getBooks: getBooks,
    createBook: createBook
}
export default bookController;
