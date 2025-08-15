import { IBookRepository } from "../domain/repositories/IBookRepository";
import { z } from "zod";
import { CustomError } from "../domain/errors/CustomError";
import { ILoanRepository } from "../domain/repositories/ILoanRepository";

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

    constructor(private repo: IBookRepository,  private repoLoan :ILoanRepository) {}

    async create(input: CreateBookDTO) {
        try {
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
        }catch ( error ) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async delete(input: { id: string }) {
        const { id } = DeleteBookInput.parse(input);

        const loan = await this.repoLoan.getByBookId(id);
        if (loan) {
            throw CustomError.badRequest("No se puede eliminar el libro porque se encuentra prestado");
        }

        return await this.repo.delete(id);
    }

    async getAll() {
        try {
            return this.repo.getAll();
        }catch ( error ) {
            console.log({error});
            throw CustomError.internalServer();
        }
    }

    async getById(input: { id: string }) {

        const { id } = GetBookInput.parse(input);
        const found = await this.repo.getById(id);

        if (!found) {
            throw CustomError.notFound('Book not found');
        }

        return found;

    }

    async update(input: UpdateBookDTO) {
        const { id, ...data } = UpdateBookInput.parse(input);

        const updated = await this.repo.update(id, data);

        if (!updated) {
            throw CustomError.notFound('Book not found');
        }

        return updated;
    }

    async getBooksWithLoanInfo(){
        const books = await this.repo.getAll();
        const loans = await this.repoLoan.getAll();

        const booksWithLoanInfo = books.map((book) => {
            // Busca el préstamo activo para este libro
            const loan = loans.find((loan) => loan.bookId === book.id);
            return {
                ...book,
                borrowed: loan ? true : false, // Si está prestado
                loanInfo: loan
                    ? {
                        memberId: loan.memberId, // ID del miembro
                        borrowedAt: loan.borrowedAt, // Fecha de préstamo
                    }
                    : null,
            };
        });

        return booksWithLoanInfo;

    }
}