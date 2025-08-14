

export class PaginationDto {
    private constructor(
        public readonly page: number,
        public readonly pageSize: number,
    ) {}

    static create(page:number=1,pageSize:number=10):[string?, PaginationDto?]{
        if(isNaN(page) || isNaN(pageSize))return ['Page and pageSize must be a number'];
        if (page <= 0 ) return ['Page must be greater than zero'];
        if (pageSize <= 0 ) return ['PageSize must be greater than zero'];
        return [undefined, new PaginationDto(page, pageSize)];
    }
}