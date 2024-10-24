import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";

import { JwtModule } from "@nestjs/jwt";

import { UsersController } from "./users.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UploadModule } from "../upload/upload.module";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET")
            }),
            inject: [ConfigService]
        }),
        UploadModule
    ],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {}
