import { Request, Response } from "express";
import { LibraryService } from "../../services/LibraryService";
import { CustomError } from "../../domain/errors/CustomError";

export class LibraryController {

    //*DI
    constructor(private libraryService: LibraryService) {
    }

    private handleError = (error:unknown, res: Response) =>{
        if(error instanceof CustomError){
            return  res.status(error.statusCode).json({error:error.message});
        }
        return res.status(500).json({error:'internal error'});
    }

    public  getById = (req: Request, res: Response) => {
        this.libraryService.getById({id : req.params.id})
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public getAll = (req: Request, res: Response) => {
        this.libraryService.getAll()
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public create = (req: Request, res: Response) => {
        this.libraryService.create(req.body)
            .then((result) => res.status(201).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public update = (req: Request, res: Response) => {
        this.libraryService.update({ id: req.params.id, ...req.body })
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

    public delete = (req: Request, res: Response) => {
        this.libraryService.delete({ id: req.params.id })
            .then((result) => res.status(200).json(result))
            .catch((error) => this.handleError(error,res));
    }

}