import { ILibraryRepository } from '../../domain/repositories/ILibraryRepository';
import { Library } from '../../domain/entities/Library';
import { prisma } from "../../data/postgres";
import { Book } from "../../domain/entities/Book";

export class PrismaLibraryRepository implements ILibraryRepository {
  async create(data: Omit<Library, 'id' | 'createdAt' | 'updatedAt'>): Promise<Library> {
    const created = await prisma.library.create({ data: {
      name: data.name,
      address: data.address ?? null
    }});
    return created as unknown as Library;
  }
  async getById(id: string): Promise<Library | null> {
    const item = await prisma.library.findUnique({ where: { id } });
    return item as unknown as Library | null;
  }
  async getAll(): Promise<Library[]> {
    const items = await prisma.library.findMany({ orderBy: { createdAt: 'desc' } });
    return items as unknown as Library[];
  }
  async update(id: string, data: Partial<Omit<Library, 'id'>>): Promise<Library | null> {
    try {
      const updated = await prisma.library.update({ where: { id }, data });
      return updated as unknown as Library;
    } catch {
      return null;
    }
  }
  async delete(id: string): Promise<Library> {
    const item = await prisma.library.delete({ where: { id } });
    return item as unknown as Library;
  }
}
