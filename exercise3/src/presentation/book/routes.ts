import { Router } from "express";
import { BookController } from "./controller";
import { BookService } from "../../services/BookService";
import { PrismaBookRepository } from "../../infrastructure/repositories/PrismaBookRepository";
import { PrismaLoanRepository } from "../../infrastructure/repositories/PrismaLoanRepository";

export class BookRoutes{
    static  get routes(): Router{

        const router = Router();
        const bookRepository = new PrismaBookRepository()
        const loanRepository = new PrismaLoanRepository()
        const bookService = new BookService(bookRepository,loanRepository);
        const bookController = new BookController(bookService);

        //Books
        router.get('/full', bookController.getBooksWithLoanInfo);
        router.get('/', bookController.getAll);
        router.get('/:id', bookController.getById);
        router.post('/', bookController.create);
        router.put('/:id', bookController.update);
        router.delete('/:id', bookController.delete);



        return router;
    }
}