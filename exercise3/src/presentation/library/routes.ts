import { Router } from "express";
import { LibraryController } from "./controller";
import { LibraryService } from "../../services/LibraryService";
import { PrismaLibraryRepository } from "../../infrastructure/repositories/PrismaLibraryRepository";
import { PrismaBookRepository } from "../../infrastructure/repositories/PrismaBookRepository";

export class LibraryRoutes{
    static  get routes(): Router{

        const router = Router();
        const libraryRepository = new PrismaLibraryRepository();
        const bookRepository = new PrismaBookRepository();
        const libraryService = new LibraryService(libraryRepository,bookRepository);
        const libraryController = new LibraryController(libraryService);

        //libraries
        router.get('/', libraryController.getAll);
        router.get('/:id', libraryController.getById);
        router.post('/', libraryController.create);
        router.put('/:id', libraryController.update);
        router.delete('/:id', libraryController.delete);

        return router;
    }
}