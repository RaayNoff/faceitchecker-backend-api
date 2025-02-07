import { Body, Controller, Post } from '@nestjs/common';
import { DevService } from './dev.service';
import { DevPasswordDto } from './dtos/dev-password.dto';

@Controller('dev')
export class DevController {
    constructor(private readonly devService: DevService) {}


    @Post()
    public async checkAccess(
        @Body() passDto: DevPasswordDto,
    ) {
        return this.devService.checkAccess(passDto)
    }
}
