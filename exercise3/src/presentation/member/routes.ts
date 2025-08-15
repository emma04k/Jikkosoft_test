import { Router } from "express";
import { MemberController } from "./controller";
import { MemberService } from "../../services/MemberService";
import { PrismaMemberRepository } from "../../infrastructure/repositories/PrismaMemberRepository";
import { PrismaLoanRepository } from "../../infrastructure/repositories/PrismaLoanRepository";

export class MemberRoutes{

    static  get routes(): Router{

        const router = Router();
        const memberRepository = new PrismaMemberRepository()
        const loanRepository = new PrismaLoanRepository()
        const memberService = new MemberService(memberRepository,loanRepository);
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