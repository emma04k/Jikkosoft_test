import { Router } from "express";
import { BookController } from "./controller";

export class BookRoutes{
    static  get routes(): Router{

        const router = Router();

        const bookController = new BookController();

        //Books
        router.get('/', bookController.getAll);
        router.get('/:id', bookController.getById);
        router.post('/', bookController.create);
        router.put('/:id', bookController.update);
        router.delete('/:id', bookController.delete);



        return router;
    }
}