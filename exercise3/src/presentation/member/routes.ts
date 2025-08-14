import { Router } from "express";
import { MemberController } from "./controller";

export class MemberRoutes{

    static  get routes(): Router{

        const router = Router();
        const memberController = new MemberController();

        //Members
        router.get('/', memberController.getAll);
        router.get('/:id', memberController.getById);
        router.post('/', memberController.create);
        router.put('/:id', memberController.update);
        router.delete('/:id', memberController.delete);

        return router;
    }
}