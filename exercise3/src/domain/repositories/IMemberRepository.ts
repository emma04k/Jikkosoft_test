import { Member } from '../entities/Member';

export interface IMemberRepository {
  create(data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member>;
  getById(id: string): Promise<Member | null>;
  getAll(): Promise<Member[]>;
  update(id: string, data: Partial<Omit<Member, 'id'>>): Promise<Member | null>;
  delete(id: string): Promise<Member>;
}
