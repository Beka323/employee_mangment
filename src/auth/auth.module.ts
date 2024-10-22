import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
@Module({
    imports: [
        UsersModule,
        MulterModule.register({
            storage: diskStorage({
                destination: "public/upload",
                filename: function (req, file, cb) {
                    cb(null, file.originalname);
                }
            })
        })
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
