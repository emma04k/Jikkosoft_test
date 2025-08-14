import { z } from "zod";
import { IMemberRepository } from "../domain/repositories/IMemberRepository";


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


export class CreateMember {
    constructor(private repo: IMemberRepository) {}

    async create(input: { name: string; email: string }) {
        const data = CreateMemberInput.parse(input);
        return this.repo.create({
            id: '',
            name: data.name,
            email: data.email,
            createdAt: undefined,
            updatedAt: undefined
        } as any);
    }

    async delete(input: { id: string }) {
        const { id } = DeleteMemberInput.parse(input);
        await this.repo.delete(id);
    }

    async getById(input: { id: string }) {
        const { id } = GetMemberInput.parse(input);
        const m = await this.repo.getById(id);
        if (!m) {
            const err: any = new Error('Member not found');
            err.status = 404;
            throw err;
        }
        return m;
    }

    async getAll() { return this.repo.getAll(); }

    async update(input: z.infer<typeof UpdateMemberInput>) {
        const { id, ...data } = UpdateMemberInput.parse(input);
        const m = await this.repo.update(id, data);
        if (!m) {
            const err: any = new Error('Member not found');
            err.status = 404;
            throw err;
        }
        return m;
    }
}