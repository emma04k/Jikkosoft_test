import { IBookRepository } from '../../domain/repositories/IBookRepository';
import { Book } from '../../domain/entities/Book';
import { prisma } from "../../data/postgres";

export class PrismaBookRepository implements IBookRepository {
  async create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const created = await prisma.book.create({ data: {
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      publishedYear: data.publishedYear ?? null,
      available: data.available ?? true,
      libraryId: data.libraryId
    }});
    return created as unknown as Book;
  }
  async getById(id: string): Promise<Book | null> {
    const b = await prisma.book.findUnique({ where: { id } });
    return b as unknown as Book | null;
  }
  async getAll(): Promise<Book[]> {
    const items = await prisma.book.findMany({ orderBy: { createdAt: 'desc' } });
    return items as unknown as Book[];
  }
  async update(id: string, data: Partial<Omit<Book, 'id'>>): Promise<Book | null> {
    try {
      const updated = await prisma.book.update({ where: { id }, data });
      return updated as unknown as Book;
    } catch {
      return null;
    }
  }
  async delete(id: string): Promise<Book> {
    const item = await prisma.book.delete({ where: { id } });
    return item as unknown as Book;
  }
}
