import { Request, Response } from "express";

export class MemberController {
    //*DI
    constructor() {
    }

    public  getById = (req: Request, res: Response) => {

    }

    public getAll = (req: Request, res: Response) => {
        res.json({message: 'todo god'});
    }

    public create = (req: Request, res: Response) => {
        const id = req.params.id;
    }

    public update = (req: Request, res: Response) => {

    }

    public delete = (req: Request, res: Response) => {

    }

}