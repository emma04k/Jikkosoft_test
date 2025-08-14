import { Router } from "express";
import { BookRoutes } from "./book/routes";
import { LibraryRoutes } from "./library/routes";
import { MemberRoutes } from "./member/routes";

export class AppRoutes{

    static  get routes(): Router{

        const router = Router();

        router.use('/api/member',MemberRoutes.routes);

        router.use('/api/book',BookRoutes.routes);

        router.use('/api/library',LibraryRoutes.routes);

        return router;
    }
}