import { Router } from "express";
import { BookController } from "./controller";
import { BookService } from "../../services/BookService";
import { PrismaBookRepository } from "../../infrastructure/repositories/PrismaBookRepository";

export class BookRoutes{
    static  get routes(): Router{

        const router = Router();
        const bookRepository = new PrismaBookRepository()
        const bookService = new BookService(bookRepository);
        const bookController = new BookController(bookService);

        //Books
        router.get('/', bookController.getAll);
        router.get('/:id', bookController.getById);
        router.post('/', bookController.create);
        router.put('/:id', bookController.update);
        router.delete('/:id', bookController.delete);



        return router;
    }
}