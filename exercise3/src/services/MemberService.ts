import { z } from "zod";
import { IMemberRepository } from "../domain/repositories/IMemberRepository";
import { CustomError } from "../domain/errors/CustomError";


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
    constructor(private repo: IMemberRepository) {}

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
        try{
            const { id } = DeleteMemberInput.parse(input);
            return await this.repo.delete(id);
        }catch ( error ) {
            throw CustomError.internalServer(`${error}`);
        }
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