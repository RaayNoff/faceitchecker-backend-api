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
        if (dto.password === this.configService.get<string>('DEV_PASSWORD')) {
            return {
                success: true,
            };
        }

        return {
            success: false,
        };
    }
}
