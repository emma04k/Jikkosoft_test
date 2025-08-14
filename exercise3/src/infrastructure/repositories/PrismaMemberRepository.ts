import { IMemberRepository } from '../../domain/repositories/IMemberRepository';
import { Member } from '../../domain/entities/Member';
import { prisma } from "../../data/postgres";

export class PrismaMemberRepository implements IMemberRepository {
  async create(data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member> {
    const created = await prisma.member.create({ data: {
      name: data.name,
      email: data.email
    }});
    return created as unknown as Member;
  }
  async getById(id: string): Promise<Member | null> {
    const item = await prisma.member.findUnique({ where: { id } });
    return item as unknown as Member | null;
  }
  async getAll(): Promise<Member[]> {
    const items = await prisma.member.findMany({ orderBy: { createdAt: 'desc' } });
    return items as unknown as Member[];
  }
  async update(id: string, data: Partial<Omit<Member, 'id'>>): Promise<Member | null> {
    try {
      const updated = await prisma.member.update({ where: { id }, data });
      return updated as unknown as Member;
    } catch {
      return null;
    }
  }
  async delete(id: string): Promise<void> {
    await prisma.member.delete({ where: { id } });
  }
}
