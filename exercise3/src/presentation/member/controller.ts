import { Request, Response } from "express";
import { MemberService } from "../../services/MemberService";
import { CustomError } from "../../domain/errors/CustomError";

export class MemberController {
    //*DI
    constructor(private memberService: MemberService) {
    }

    private handleError = (error:unknown, res: Response) =>{
        if(error instanceof CustomError){
            return  res.status(error.statusCode).json({error:error.message});
        }
        return res.status(500).json({error:'internal error'});
    }

    public  getById = (req: Request, res: Response) => {
        this.memberService.getById({id : req.params.id})
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public getAll = (req: Request, res: Response) => {
        this.memberService.getAll()
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public create = (req: Request, res: Response) => {
        this.memberService.create(req.body)
            .then((result) => res.status(201).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public update = (req: Request, res: Response) => {
        this.memberService.update({ id: req.params.id, ...req.body })
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public delete = (req: Request, res: Response) => {
        this.memberService.delete({ id: req.params.id })
            .then((result) => res.status(200).json(result))
            .catch((error) => res.status(500).json({error:error.message}));
    }

}