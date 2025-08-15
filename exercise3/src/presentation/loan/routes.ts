import { Router } from "express";
import { PrismaMemberRepository } from "../../infrastructure/repositories/PrismaMemberRepository";
import { MemberService } from "../../services/MemberService";
import { MemberController } from "../member/controller";
import { PrismaLoanRepository } from "../../infrastructure/repositories/PrismaLoanRepository";
import { LoanService } from "../../services/LoanService";
import { LoanController } from "./controller";

export class LoanRoutes{

    static  get routes(): Router{

        const router = Router();
        const  loanRepository = new PrismaLoanRepository()
        const loanService = new LoanService(loanRepository);
        const loanController = new LoanController(loanService);

        //Loan

        router.post('/', loanController.create);

        return router;
    }
}