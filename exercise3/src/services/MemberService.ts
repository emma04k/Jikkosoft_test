import { z } from "zod";
import { IMemberRepository } from "../domain/repositories/IMemberRepository";
import { CustomError } from "../domain/errors/CustomError";
import { IBookRepository } from "../domain/repositories/IBookRepository";
import { ILoanRepository } from "../domain/repositories/ILoanRepository";


export const CreateMemberInput = z.object({
    name: z.string().min(1),
    email: z.email()
});

export const UpdateMemberInput = z.object({
    id: z.uuid(),
    name: z.string().optional(),
    email: z.email().optional()
});

export const DeleteMemberInput = z.object({ id: z.uuid() });
export const GetMemberInput = z.object({ id: z.uuid() });


export class MemberService {
    constructor(private repo: IMemberRepository, private loanRepo: ILoanRepository) {}

    async create(input: { name: string; email: string }) {
       try {
           const data = CreateMemberInput.parse(input);
           return this.repo.create({
               id: '',
               name: data.name,
               email: data.email,
               createdAt: undefined,
               updatedAt: undefined
           } as any);
       }catch ( error ) {
          throw CustomError.internalServer(`${error}`);
       }
    }

    async delete(input: { id: string }) {

        const { id } = DeleteMemberInput.parse(input);
        const loan = await this.loanRepo.getByMemberId(id)
        if (loan) {
            throw CustomError.badRequest("No puedes eliminar al miembro porque tiene libro/s prestado/s");
        }
        return await this.repo.delete(id);

    }

    async getById(input: { id: string }) {
          const { id } = GetMemberInput.parse(input);
          const m = await this.repo.getById(id);
          if (!m) {
              throw CustomError.notFound('Member not found');
          }
          return m;
    }

    async getAll() {
        try {
            return this.repo.getAll();
        }catch ( error ) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async update(input: z.infer<typeof UpdateMemberInput>) {
        const { id, ...data } = UpdateMemberInput.parse(input);

        const m = await this.repo.update(id, data);
        if (!m) {
            throw CustomError.notFound('Member not found');
        }
        return m;
    }
}