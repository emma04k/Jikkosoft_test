export class Member {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
