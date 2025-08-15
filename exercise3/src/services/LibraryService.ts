import { z } from "zod";
import { ILibraryRepository } from "../domain/repositories/ILibraryRepository";
import { CustomError } from "../domain/errors/CustomError";
import { IBookRepository } from "../domain/repositories/IBookRepository";


export const CreateLibraryInput = z.object({
    name: z.string().min(1),
    address: z.string().optional()
});

export const UpdateLibraryInput = z.object({
    id: z.uuid(),
    name: z.string().optional(),
    address: z.string().nullable().optional()
});

export const DeleteLibraryInput = z.object({ id: z.uuid() });
export const GetLibraryInput = z.object({ id: z.uuid() });

export class LibraryService {
    constructor(private repo: ILibraryRepository, private repoBook : IBookRepository) {}

    async create(input: { name: string; address?: string }) {
        try{
            const data = CreateLibraryInput.parse(input);
            return this.repo.create({
                id: '',
                name: data.name,
                address: data.address ?? null,
                createdAt: undefined,
                updatedAt: undefined
            } as any);
        }catch ( error ){
            throw CustomError.internalServer(`${error}`);
        }
    }

    async delete(input: { id: string }) {
        const { id } = DeleteLibraryInput.parse(input);
        const book = await this.repoBook.getByLibraryId(id);
        if(book){
            throw CustomError.badRequest("No se puede eliminar la biblioteca porque tiene libros asociados")
        }
        return await this.repo.delete(id);
    }

    async getById(input: { id: string }) {
        const { id } = GetLibraryInput.parse(input);
        const lib = await this.repo.getById(id);
        if (!lib) {
            throw CustomError.notFound('Library not found');
        }
        return lib;
    }
    async getAll() {
        try {
            return this.repo.getAll();
        }catch ( error ) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async update(input: { id: string, name: string; address?: string }) {
        const { id, ...data } = UpdateLibraryInput.parse(input);

        const lib = await this.repo.update(id, data);
        if (!lib) {
            throw CustomError.notFound('Library not found');
        }
        return lib;
    }
}