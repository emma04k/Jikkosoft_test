import { Request, Response } from "express";
import { BookService } from "../../services/BookService";
import { CustomError } from "../../domain/errors/CustomError";

export class BookController {
    //*DI
    constructor(private bookService: BookService) {
    }

    private handleError = (error:unknown, res: Response) =>{
        if(error instanceof CustomError){
            return  res.status(error.statusCode).json({error:error.message});
        }
        return res.status(500).json({error:'internal error'});
    }

    public  getById = (req: Request, res: Response) => {
        this.bookService.getById({id : req.params.id})
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public getAll = (req: Request, res: Response) => {
        this.bookService.getAll()
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public create = (req: Request, res: Response) => {
        this.bookService.create(req.body)
            .then((result) => res.status(201).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public update = (req: Request, res: Response) => {
        this.bookService.update({ id: req.params.id, ...req.body })
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public delete = (req: Request, res: Response) => {
        this.bookService.delete({ id: req.params.id })
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

}