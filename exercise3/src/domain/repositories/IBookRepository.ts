import { Book } from '../entities/Book';

export interface IBookRepository {
  create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book>;
  getById(id: string): Promise<Book | null>;
  getAll(): Promise<Book[]>;
  update(id: string, data: Partial<Omit<Book, 'id'>>): Promise<Book | null>;
  delete(id: string): Promise<Book>;
  getByLibraryId(libraryId: string): Promise<Book | null>;

}
