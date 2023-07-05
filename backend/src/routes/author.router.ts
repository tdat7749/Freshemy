import express, { Request, Response } from 'express';

import controllers from '../controllers/controllers';

const authorRouter = express.Router();


authorRouter.get('/', controllers.authorController.getAuthors);
authorRouter.post('/create/firstName/:firstName/lastName/:lastName', controllers.authorController.createAuthor);

export default authorRouter;