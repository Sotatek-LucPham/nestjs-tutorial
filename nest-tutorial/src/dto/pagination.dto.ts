import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    limit: number = 5;

    @IsOptional()
    @IsString()
    sort?: string;

    @IsOptional()
    @IsIn(['ASC', 'DESC'], { message: 'order must be ASC or DESC' })
    order: 'ASC' | 'DESC' = 'ASC';

    get skip(): number {
        return (this.page - 1) * this.limit;
    }
}