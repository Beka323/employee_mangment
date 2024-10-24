import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    ValidationPipe
} from "@nestjs/common";
import { userDto } from "../users/dto/user.dto";
import { AuthService } from "./auth.service";
import { loginDto } from "../users/dto/login.dto";
import { AdminDto } from "../users/dto/admin.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { FileValidation } from "./validation/validation.pipe";


@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("register")
    @UseInterceptors(FileInterceptor("image"))
    async createNew(
        @Body() user: userDto,
        @UploadedFile(FileValidation) image: Express.Multer.File
    ): Promise<{ msg: string } | any> {
        return this.authService.createNewUser(user, image);
    }
    @Post("login")
    async login(
        @Body() user: loginDto
    ): Promise<{ token: string; roles: string[] }> {
        return this.authService.loginUser(user);
    }
    @Post("admin")
    @UseInterceptors(FileInterceptor("image"))
    async createAdmin(
        @Body() admin: AdminDto,
        @UploadedFile(FileValidation) image: Express.Multer.File
    ): Promise<{ msg: string } | any> {
        return this.authService.createAdmin(admin,image);
    }
}
