import express, { Request, Response } from 'express';

import controllers from '../controllers/controllers';

const bookRouter = express.Router();

bookRouter.get('/', controllers.bookController.getBooks);
bookRouter.post('/create/title/:title/dataPublished/:dataPublished/isFiction/:isFiction/authorId/:authorId',controllers.bookController.createBook );

export default bookRouter;


