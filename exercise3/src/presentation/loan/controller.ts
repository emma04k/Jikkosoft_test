import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/CustomError";
import { LoanService } from "../../services/LoanService";


export  class LoanController {
    constructor(private loanService: LoanService) {
    }

    private handleError = (error:unknown, res: Response) =>{
        if(error instanceof CustomError){
            return  res.status(error.statusCode).json({error:error.message});
        }
        return res.status(500).json({error:'internal error'});
    }

    public create = (req: Request, res: Response) => {
        this.loanService.create(req.body)
            .then((result) => res.status(201).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public delete = (req: Request, res: Response) => {
        this.loanService.delete({ id: req.params.id })
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }
}