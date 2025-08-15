import { Loan } from '../entities/Loan';

export interface ILoanRepository {
  create(data: Omit<Loan, 'id' | 'borrowedAt' | 'returnedAt'>): Promise<Loan>;
  getByMemberAndBook(input:{memberId: string, bookId:string}): Promise<Loan | null>;
  getAll(): Promise<Loan[]>;
  update(id: string, data: Partial<Omit<Loan, 'id'>>): Promise<Loan | null>;
  delete(id: string): Promise<Loan>;
  getByMemberId(id: string): Promise<Loan | null>;
  getByBookId(bookId: string): Promise<Loan | null>;
}
