import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "./secret";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
            global: true,
            secret: jwtSecret.secret
        })
    ],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
