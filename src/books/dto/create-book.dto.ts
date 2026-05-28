import { IsNotEmpty, IsInt, IsPositive } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty()
    title!: string;

    @IsNotEmpty()
    author!: string;

    @IsNotEmpty()
    @IsInt()
    publish_year!: number;

    @IsNotEmpty()
    @IsPositive()
    @IsInt()
    page_count!: number;
}
