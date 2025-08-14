import { Library } from '../entities/Library';

export interface ILibraryRepository {
  create(data: Omit<Library, 'id' | 'createdAt' | 'updatedAt'>): Promise<Library>;
  getById(id: string): Promise<Library | null>;
  getAll(): Promise<Library[]>;
  update(id: string, data: Partial<Omit<Library, 'id'>>): Promise<Library | null>;
  delete(id: string): Promise<void>;
}
