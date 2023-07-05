import express, { Request, Response } from 'express';
import controllers from '../controllers/controllers';

const authorBookRouter = express.Router();

authorBookRouter.get('/authorId/:authorId/bookId/:bookId', controllers.authorBookController.linkAuthorBook);

export default authorBookRouter;