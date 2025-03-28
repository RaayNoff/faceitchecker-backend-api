import { IsNotEmpty, IsString } from 'class-validator';

export class PlayerStatsInputSearchDto {
    @IsNotEmpty({ message: 'inputRaw must be provided' })
    @IsString({ message: 'inputRaw must be a string' })
      inputRaw: string;
}
