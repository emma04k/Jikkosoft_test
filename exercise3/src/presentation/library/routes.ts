import { Router } from "express";
import { LibraryController } from "./controller";

export class LibraryRoutes{
    static  get routes(): Router{

        const router = Router();

        const libraryController = new LibraryController();

        //libraries
        router.get('/', libraryController.getAll);
        router.get('/:id', libraryController.getById);
        router.post('/', libraryController.create);
        router.put('/:id', libraryController.update);
        router.delete('/:id', libraryController.delete);

        return router;
    }
}