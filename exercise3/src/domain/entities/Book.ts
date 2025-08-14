export class Book {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public isbn: string,
    public publishedYear: number | null,
    public available: boolean,
    public libraryId: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
