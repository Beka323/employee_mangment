import { Injectable, BadRequestException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Express } from "express";

import { userDto } from "../users/dto/user.dto";
import { loginDto } from "../users/dto/login.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
    async createNewUser(
        user: userDto
    ): Promise<{ msg: string } | any> {
        return this.usersService.createNewUser(user);
    }
    async loginUser(
        user: loginDto
    ): Promise<{ token: string}> {
        return this.usersService.login(user);
    }
}
