export class Loan {
  constructor(
    public id: string,
    public memberId: string,
    public bookId: string,
    public borrowedAt?: Date,
    public returnedAt?: Date
  ) {}
}
