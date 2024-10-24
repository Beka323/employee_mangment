import { Injectable, BadRequestException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Express } from "express";

import { userDto } from "../users/dto/user.dto";
import { loginDto } from "../users/dto/login.dto";
import { AdminDto } from "../users/dto/admin.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
    async createNewUser(
        user: userDto,
        image: Express.Multer.File
    ): Promise<{ msg: string } | any> {
        return this.usersService.createNewUser(user, image);
    }
    async loginUser(
        user: loginDto
    ): Promise<{ token: string; roles: string[] }> {
        return this.usersService.login(user);
    }
    async createAdmin(
        admin: AdminDto,
        image: Express.Multer.File
    ): Promise<{ msg: string } | any> {
        return this.usersService.createAdminUser(admin,image);
    }
}
