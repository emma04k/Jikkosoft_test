import { IBookRepository } from "../domain/repositories/IBookRepository";
import { z } from "zod";

export const CreateBookInput = z.object({
    title: z.string().min(1),
    author: z.string().min(1),
    isbn: z.string().min(3),
    publishedYear: z.number().int().optional(),
    available: z.boolean().optional(),
    libraryId: z.uuid()
});

export const UpdateBookInput = z.object({
    id: z.uuid(),
    title: z.string().min(1).optional(),
    author: z.string().min(1).optional(),
    isbn: z.string().min(3).optional(),
    publishedYear: z.number().int().nullable().optional(),
    available: z.boolean().optional(),
    libraryId: z.uuid().optional()
});

export type CreateBookDTO = z.infer<typeof CreateBookInput>;
export type UpdateBookDTO = z.infer<typeof UpdateBookInput>;
export const DeleteBookInput = z.object({ id: z.uuid() });
export const GetBookInput = z.object({ id: z.uuid() });

export class BookService {

    constructor(private repo: IBookRepository) {}

    async create(input: CreateBookDTO) {
        const data = CreateBookInput.parse(input);
        return this.repo.create({
            id: '',
            title: data.title,
            author: data.author,
            isbn: data.isbn,
            publishedYear: data.publishedYear ?? null,
            available: data.available ?? true,
            libraryId: data.libraryId,
            createdAt: undefined,
            updatedAt: undefined
        } as any);
    }

    async delete(input: { id: string }) {
        const { id } = DeleteBookInput.parse(input);
        return await this.repo.delete(id);
    }

    async getAll() {
        return this.repo.getAll();
    }

    async getById(input: { id: string }) {

        const { id } = GetBookInput.parse(input);
        const found = await this.repo.getById(id);

        if (!found) {
            const err: any = new Error('Book not found');
            err.status = 404;
            throw err;
        }
        return found;
    }

    async update(input: UpdateBookDTO) {
        const { id, ...data } = UpdateBookInput.parse(input);

        const updated = await this.repo.update(id, data);

        if (!updated) {
            const err: any = new Error('Book not found');
            err.status = 404;
            throw err;
        }
        return updated;
    }
}