export class Library {
  constructor(
    public id: string,
    public name: string,
    public address: string | null,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
