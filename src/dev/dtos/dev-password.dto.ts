import { IsNotEmpty, IsString } from 'class-validator';

export class DevPasswordDto {
    @IsString()
    @IsNotEmpty()
    password: string;
}
