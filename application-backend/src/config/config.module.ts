import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            isGlobal: true,
            validationSchema: Joi.object({
                CONNECTION_STRING: Joi.string().required()
            }),
        }),
    ],
})
export class AppConfigModule {}
