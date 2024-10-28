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
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { FileValidation } from "./validation/validation.pipe";

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
    ): Promise<{ token: string }> {
        return this.authService.loginUser(user);
    }
}
