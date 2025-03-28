import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FetchService {
    private readonly FACEIT_API_TOKEN: string;

    constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    ) {
        const FACEIT_API_AUTHORIZATION_TOKEN = this.configService
            .get<string>('FACEIT_API_AUTHORIZATION_TOKEN');

        this.FACEIT_API_TOKEN = FACEIT_API_AUTHORIZATION_TOKEN as string;
    }

    public async get<TResponseData, >(
        url: string,
        config: AxiosRequestConfig<any>,
        includeBearer: boolean,
    ) {
        try {
            if (includeBearer) {
                // eslint-disable-next-line no-param-reassign
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${this.FACEIT_API_TOKEN}`,
                };
            }

            return await firstValueFrom<AxiosResponse<TResponseData>>(this.httpService.get<TResponseData>(
                url,
                config,
            ));
        } catch (error: any) {
            console.log(`Error occurs while fetching ${url}: ${error.message}`);
            return null;
        }
    }
}
