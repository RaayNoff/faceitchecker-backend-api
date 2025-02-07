import { Injectable } from '@nestjs/common';
import { DevPasswordDto } from './dtos/dev-password.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DevService {

    constructor(
        private readonly configService: ConfigService,
    ) {

    }

    public async checkAccess(dto: DevPasswordDto) {
        const configPass = this.configService.get<string>('DEV_PASSWORD');

        console.log({ configPass });
        console.log({'dto.password': dto.password});

        if (dto.password === configPass) {
            return {
                success: true,
            };
        }

        return {
            success: false,
        };
    }
}
