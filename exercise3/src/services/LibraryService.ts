import { z } from "zod";
import { ILibraryRepository } from "../domain/repositories/ILibraryRepository";


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
    constructor(private repo: ILibraryRepository) {}

    async create(input: { name: string; address?: string }) {
        const data = CreateLibraryInput.parse(input);
        return this.repo.create({
            id: '',
            name: data.name,
            address: data.address ?? null,
            createdAt: undefined,
            updatedAt: undefined
        } as any);
    }

    async delete(input: { id: string }) {
        const { id } = DeleteLibraryInput.parse(input);
        await this.repo.delete(id);
    }

    async getById(input: { id: string }) {
        const { id } = GetLibraryInput.parse(input);
        const lib = await this.repo.getById(id);
        if (!lib) {
            const err: any = new Error('Library not found');
            err.status = 404;
            throw err;
        }
        return lib;
    }
    async getAll() { return this.repo.getAll(); }

    async update(input: { id: string, name: string; address?: string }) {
        const { id, ...data } = UpdateLibraryInput.parse(input);

        const lib = await this.repo.update(id, data);
        if (!lib) {
            const err: any = new Error('Library not found');
            err.status = 404;
            throw err;
        }
        return lib;
    }
}