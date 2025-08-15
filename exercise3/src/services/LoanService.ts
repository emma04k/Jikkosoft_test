import { ILoanRepository } from "../domain/repositories/ILoanRepository";
import { CustomError } from "../domain/errors/CustomError";
import { z } from "zod";

export const CreateLoanInput = z.object({
    memberId: z.uuid(),
    bookId: z.uuid()
});

export class LoanService {
    constructor(private repo: ILoanRepository) {
    }
    async create(input: { memberId: string; bookId: string }) {

            const loan = await this.repo.getByBookId(input.bookId);
            if (loan) {
                throw  CustomError.badRequest("El libro se encuentra prestado")
            }
            const data = CreateLoanInput.parse(input);
            return this.repo.create({
                id: '',
                memberId: data.memberId,
                bookId: data.bookId,
            } as any);
    }

}