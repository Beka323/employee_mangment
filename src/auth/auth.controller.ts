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

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("register")
    async createNew(
        @Body(ValidationPipe) user: userDto
    ): Promise<{ msg: string } | any> {
        return this.authService.createNewUser(user);
    }
    @Post("login")
    async login(
        @Body() user: loginDto
    ): Promise<{ token: string; roles: string[] }> {
        return this.authService.loginUser(user);
    }
    @Post("admin")
    async createAdmin(
        @Body(ValidationPipe) admin: AdminDto
    ): Promise<{ msg: string } | any> {
        return this.authService.createAdmin(admin);
    }
    @Post("upload")
    @UseInterceptors(FileInterceptor("image"))
    upload(@UploadedFile() image: Express.Multer.File): { msg: string } {
        return this.authService.fileUpload(image);
    }
}
