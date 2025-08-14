import { Router } from "express";
import { MemberController } from "./controller";
import { MemberService } from "../../services/MemberService";
import { PrismaMemberRepository } from "../../infrastructure/repositories/PrismaMemberRepository";

export class MemberRoutes{

    static  get routes(): Router{

        const router = Router();
        const  memberRepository = new PrismaMemberRepository()
        const memberService = new MemberService(memberRepository);
        const memberController = new MemberController(memberService);

        //Members
        router.get('/', memberController.getAll);
        router.get('/:id', memberController.getById);
        router.post('/', memberController.create);
        router.put('/:id', memberController.update);
        router.delete('/:id', memberController.delete);

        return router;
    }
}