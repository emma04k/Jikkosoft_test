import { Loan } from '../../domain/entities/Loan';
import { prisma } from "../../data/postgres";
import { ILoanRepository } from "../../domain/repositories/ILoanRepository";

export class PrismaLoanRepository implements ILoanRepository {
  async create(data: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Loan> {
    const created = await prisma.loan.create({ data: {
      memberId: data.memberId,
      bookId: data.bookId
    }});
    return created as unknown as Loan;
  }
  async getByMemberAndBook(input:{memberId: string, bookId:string}): Promise<Loan | null> {
    const item = await prisma.loan.findFirst({
      where: {
          memberId:input.memberId,
          bookId: input.bookId
      },
    });
    return item as unknown as Loan | null;
  }
  async getAll(): Promise<Loan[]> {
    const items = await prisma.loan.findMany({ orderBy: { borrowedAt: 'desc' } });
    return items as unknown as Loan[];
  }
  async update(id: string, data: Partial<Omit<Loan, 'id'>>): Promise<Loan | null> {
    try {
      const updated = await prisma.loan.update({ where: { id }, data });
      return updated as unknown as Loan;
    } catch {
      return null;
    }
  }
  async delete(id: string): Promise<Loan> {
   const item =  await prisma.loan.delete({ where: { id } });
   return item as unknown as Loan;
  }
  async getByMemberId(memberId: string): Promise<Loan | null> {
    const item = await prisma.loan.findFirst({ where: { memberId:memberId } });
    return item as unknown as Loan | null;
  }

  async getByBookId(bookId: string): Promise<Loan | null> {
    const item = await prisma.loan.findFirst({ where: { bookId:bookId } });
    return item as unknown as Loan | null;
  }

}
